from fastapi import FastAPI, File, UploadFile, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.concurrency import run_in_threadpool
from openai import OpenAI, APITimeoutError, APIConnectionError, RateLimitError
from PIL import Image, UnidentifiedImageError
from io import BytesIO
import base64
import os
import logging
import requests
import uuid
import time
import json
import hashlib
import asyncio
from pathlib import Path
from typing import Dict, Optional, Tuple
from functools import lru_cache
from dotenv import load_dotenv
import uvicorn
import random
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

# Initialize logging with more detailed format
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s'
)
logger = logging.getLogger("palm_reader")

# Setup FastAPI
app = FastAPI(
    title="Palm Reading API", 
    version="1.1.0",
    description="AI-powered palm reading API with optimized performance and caching",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cache configuration
CACHE_DIR = Path("./cache")
CACHE_DIR.mkdir(exist_ok=True)

# Image processing settings
MAX_IMAGE_SIZE = (1024, 1024)  # Resize large images for better performance

# Setup rate limiting
rate_limit = {}
RATE_LIMIT_WINDOW = 60  # seconds
MAX_REQUESTS_PER_WINDOW = 10  # requests per minute per IP

# Initialize OpenAI client
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Cache results with expiration
analysis_cache = {}
CACHE_EXPIRY = 3600  # 1 hour in seconds

# Temp directory setup
TEMP_DIR = Path("temp")
TEMP_DIR.mkdir(exist_ok=True)

audio_cache = {}

# Rate limiting dependency
async def check_rate_limit(request: Request):
    client_ip = request.client.host
    current_time = time.time()
    
    if client_ip in rate_limit:
        # Clean up expired requests
        rate_limit[client_ip] = [t for t in rate_limit[client_ip] if current_time - t < RATE_LIMIT_WINDOW]
        
        # Check if limit exceeded
        if len(rate_limit[client_ip]) >= MAX_REQUESTS_PER_WINDOW:
            logger.warning(f"Rate limit exceeded for IP: {client_ip}")
            raise HTTPException(
                status_code=429,
                detail="Too many requests. Please try again later.",
                headers={"Retry-After": str(RATE_LIMIT_WINDOW)}
            )
        
        # Add current request timestamp
        rate_limit[client_ip].append(current_time)
    else:
        # First request from this IP
        rate_limit[client_ip] = [current_time]
    
    return True

# Image processing functions
def get_image_hash(image_bytes: bytes) -> str:
    """Generate a hash for image content for caching purposes"""
    return hashlib.md5(image_bytes).hexdigest()

def optimize_image(image_bytes: bytes) -> bytes:
    """Optimize image for AI processing - resize and convert to JPEG"""
    try:
        img = Image.open(BytesIO(image_bytes))
        
        # Convert to RGB if necessary (handles RGBA, etc.)
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize large images to improve performance
        if max(img.size) > max(MAX_IMAGE_SIZE):
            img.thumbnail(MAX_IMAGE_SIZE, Image.LANCZOS)
            
        # Save as optimized JPEG
        output = BytesIO()
        img.save(output, format='JPEG', quality=85, optimize=True)
        return output.getvalue()
    except Exception as e:
        logger.error(f"Error optimizing image: {e}")
        # Return original if optimization fails
        return image_bytes

def image_to_base64_data_url(image_bytes: bytes) -> str:
    """Convert image bytes to base64 data URL format"""
    base64_str = base64.b64encode(image_bytes).decode('utf-8')
    return f"data:image/jpeg;base64,{base64_str}"

@lru_cache(maxsize=10)
def get_prompt_template() -> str:
    """Return the prompt template for palm reading analysis with LRU caching"""
    return """
Please do a traditional Palmistry-style overview.

Your analysis should be fun and engaging, but respectfully crafted as if by a professional palmist.

Follow this structured format using these 5 sections with emojis:

1. 🖐️ Overall Impression: General overview of their palm and what stands out most prominently in 4 to 6 sentences

2. ❤️ Relationships & Emotions: Love life, emotional nature, and relationships with others in 3 to 5 sentences

3. 💼 Career & Wealth: Professional aptitudes, financial tendencies, and work-life path in 3 to 5 sentences

4. 🧠 Personality Traits: Core character strengths, thought patterns, and unique qualities in 3 to 5 sentences

5. ✨ Hidden Talents: Special abilities or potentials they might not be fully aware of

Write in second person ("you"), be specific, and make it feel personalized. Keep your reading entertaining but meaningful.

Important: This is for entertainment purposes only. Never include disclaimers or mention that you're AI in your reading.
"""

def get_generic_response() -> str:
    """Return a random fallback response when analysis fails"""
    fallback_responses = [
        "🔮 Your palm holds many secrets — the stars are still aligning. Try another photo with clearer lines and better lighting to see what they reveal.",
        "✨ The mystic energies are unclear with this image. Perhaps try with different lighting or showing more of your palm?",
        "🧙‍♂️ Hmm, the cosmic forces need a clearer view of your palm lines. Could you try another photo with your palm more fully open?",
        "🌙 The alignment of celestial bodies makes your palm reading difficult at this moment. Try with better lighting and your palm facing directly toward the camera.",
        "🌟 The ancient palmistry texts remain clouded. A clearer image showing your full palm with visible lines might reveal your destiny!",
        "🪄 The mystical connection is weak with this image. Try taking a photo with natural light and your palm fully extended.",
        "🔍 I need to see your palm lines more clearly. Try a photo with your hand relaxed and in good lighting.",
        "🧿 The cosmic energies need a better view of your palm. A photo with your hand against a contrasting background might help.",
        "🪞 Your palm's reflection in the cosmic mirror is blurry. A clearer, well-lit photo would help reveal your fortune.",
        "🌠 The stars cannot align properly with this image. Try photographing your palm straight-on with clear lighting."
    ]
    return random.choice(fallback_responses)

def validate_image(image_file: UploadFile) -> bool:
    try:
        allowed_extensions = {".jpg", ".jpeg", ".png", ".webp"}
        ext = Path(image_file.filename or "").suffix.lower()
        if ext not in allowed_extensions:
            return False
        image = Image.open(BytesIO(image_file.file.read()))
        image.verify()
        image_file.file.seek(0)
        return True
    except Exception:
        return False


def convert_image_to_base64(image_file: UploadFile) -> str:
    try:
        image_file.file.seek(0)
        image = Image.open(image_file.file)
        if image.mode != "RGB":
            image = image.convert("RGB")
        buffer = BytesIO()
        image.save(buffer, format="JPEG")
        return base64.b64encode(buffer.getvalue()).decode("utf-8")
    except Exception as e:
        logger.error(f"Image conversion error: {e}", exc_info=True)
        raise HTTPException(status_code=400, detail="Invalid image format")


async def analyze_palm_with_openai(image_base64: str) -> Tuple[str, bool]:
    """Analyze a palm image using OpenAI API with improved error handling
    
    Returns a tuple of (text_content, success_status)
    """
    try:
        # Set up the chat completion with proper timeout and retry handling
        response = await run_in_threadpool(
            lambda: openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system",
                        "content": get_prompt_template()
                    },
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Please analyze this palm image and provide a detailed reading. Focus on the lines, mounts, and overall shape of the hand."}, 
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": image_base64
                                }
                            }
                        ]
                    }
                ],
                max_tokens=700,
                temperature=0.7,  # Slightly randomized for variety
                timeout=45  # 45 seconds timeout
            )
        )
        # Extract and return the content
        response_text = response.choices[0].message.content
        
        # Enhanced fallback detection
        fallback_phrases = [
            "i'm sorry", "i cannot", "i can't", "not able to", "do not have the ability",
            "as an ai", "as an assistant", "as a language model", "ai language model",
            "i don't see", "unable to determine", "cannot analyze", "cannot identify",
            "no palm", "no hand", "no image", "difficult to interpret", "unclear image"
        ]
        
        # Check for empty or very short responses
        if not response_text or len(response_text) < 50:
            logger.warning("Empty or very short response — returning generic response")
            return get_generic_response(), False
            
        # Check for fallback phrases
        if any(x in response_text.lower() for x in fallback_phrases):
            logger.warning(f"Fallback detected in response: {response_text[:100]}...")
            return get_generic_response(), False
            
        # Check if response doesn't contain all required section headers/emojis
        required_section_markers = [
            "overall impression", "🖐️",  # Section 1
            "relationships", "emotions", "❤️",  # Section 2
            "career", "wealth", "💼",  # Section 3
            "personality", "traits", "🧠",  # Section 4
            "hidden talents", "✨"  # Section 5
        ]
        
        # Count how many section markers are present (should have at least 3-4 to be valid)
        marker_count = sum(1 for marker in required_section_markers if marker in response_text.lower())
        if marker_count < 5:  # Require at least 5 markers for a valid response
            logger.warning(f"Response missing required sections (found {marker_count}/13 markers) — returning generic response")
            return get_generic_response(), False
            
        # Check overall structure - should have multiple paragraphs
        paragraphs = [p for p in response_text.split('\n\n') if p.strip()]
        if len(paragraphs) < 4:  # We expect at least 4-5 sections
            logger.warning(f"Response has insufficient structure (only {len(paragraphs)} paragraphs) — returning generic response")
            return get_generic_response(), False
            
        return response_text, True
    
    except APITimeoutError:
        logger.error("OpenAI API request timed out")
        return "The cosmic energies are taking longer than expected. Please try again in a moment.", False
    
    except APIConnectionError:
        logger.error("Connection error to OpenAI API")
        return "The connection to the mystic realm was lost. Please try again shortly.", False
    
    except RateLimitError:
        logger.error("OpenAI API rate limit exceeded")
        return "Too many seekers are consulting the stars right now. Please try again in a few minutes.", False
    
    except Exception as e:
        logger.error(f"Error analyzing palm with OpenAI: {str(e)}", exc_info=True)
        return get_generic_response(), False


# async def text_to_speech_elevenlabs(text: str) -> str:
#     try:
#         api_key = os.getenv("ELEVENLABS_API_KEY")
#         if not api_key:
#             raise HTTPException(status_code=500, detail="Missing ElevenLabs API Key")
#         voice_id = "pNInz6obpgDQGcFmaJgB"
#         url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
#         headers = {
#             "Accept": "audio/mpeg",
#             "Content-Type": "application/json",
#             "xi-api-key": api_key
#         }
#         data = {
#             "text": text,
#             "model_id": "eleven_multilingual_v2",
#             "voice_settings": {"stability": 0.5, "similarity_boost": 0.5}
#         }
#         response = requests.post(url, json=data, headers=headers)
#         if response.status_code != 200:
#             raise Exception("TTS failed")
#         filename = f"{uuid.uuid4()}.mp3"
#         path = TEMP_DIR / filename
#         with open(path, "wb") as f:
#             f.write(response.content)
#         return f"/audio/{filename}"
#     except Exception as e:
#         logger.error(f"TTS error: {e}", exc_info=True)
#         raise HTTPException(status_code=500, detail="Failed to convert text to speech")


# Reimplement text-to-speech with caching
# async def text_to_speech(text: str) -> str:
#     """Generate audio from text with caching and fallback options"""
#     # Generate a hash for the text to use as cache key
#     text_hash = hashlib.md5(text.encode('utf-8')).hexdigest()
    
#     # Check if we have this audio cached
#     cache_path = CACHE_DIR / f"audio_{text_hash}.mp3"
#     if cache_path.exists():
#         logger.info(f"Using cached audio for text hash {text_hash}")
#         return f"/audio/cached_{text_hash}.mp3"
    
#     # Try ElevenLabs first if API key is available
#     api_key = os.getenv("ELEVENLABS_API_KEY")
#     if api_key:
#         try:
#             voice_id = "pNInz6obpgDQGcFmaJgB"  # Neutral voice
#             url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
#             headers = {
#                 "Accept": "audio/mpeg",
#                 "Content-Type": "application/json",
#                 "xi-api-key": api_key
#             }
#             data = {
#                 "text": text,
#                 "model_id": "eleven_multilingual_v2",
#                 "voice_settings": {"stability": 0.5, "similarity_boost": 0.5}
#             }
            
#             # Make async request using threadpool
#             response = await run_in_threadpool(
#                 lambda: requests.post(url, json=data, headers=headers)
#             )
            
#             if response.status_code == 200:
#                 # Save to cache
#                 with open(cache_path, "wb") as f:
#                     f.write(response.content)
                
#                 logger.info(f"Successfully generated ElevenLabs audio for {text_hash}")
#                 return f"/audio/cached_{text_hash}.mp3"
        
#         except Exception as e:
#             logger.error(f"ElevenLabs TTS error: {str(e)}")
#             # Will fall back to Google TTS
    
#     # TODO: Add Google Cloud TTS as fallback
#     # For now, return empty audio URL
#     return ""

@app.post("/api/analyze-palm", dependencies=[Depends(check_rate_limit)])
async def analyze_palm(request: Request, image: UploadFile = File(...)):
    """Analyze a palm image with caching"""
    start_time = time.time()
    try:
        # Validate image format
        if not await validate_image(image):
            raise HTTPException(status_code=400, detail="Invalid image format. Please upload a valid palm image.")
        
        # Read image bytes
        image_bytes = await image.read()
        
        # Check for HEIC format
        if image.filename.lower().endswith(".heic") or image.content_type == "image/heic":
            raise HTTPException(
                status_code=400,
                detail="HEIC format is not supported. Please convert your image to JPEG or PNG format before uploading."
            )
        
        # Generate hash for caching
        image_hash = get_image_hash(image_bytes)
        logger.info(f"Processing image with hash: {image_hash}")
        
        # Check cache
        if image_hash in analysis_cache and time.time() - analysis_cache[image_hash]['timestamp'] < CACHE_EXPIRY:
            logger.info(f"Cache hit for image {image_hash}")
            cached_result = analysis_cache[image_hash]['result']
            return JSONResponse({
                "text": cached_result['text'],
                "audioUrl": cached_result['audioUrl'],
                "status": "success",
                "cached": True
            })
        
        # Optimize image for processing
        optimized_image = optimize_image(image_bytes)
        image_data_url = image_to_base64_data_url(optimized_image)
        
        # Get palm analysis from OpenAI
        analysis_text, success = await analyze_palm_with_openai(image_data_url)
        
        if not success:
            return JSONResponse({
                "text": analysis_text,  # This will be the error/fallback message
                "audioUrl": "",
                "status": "error"
            }, status_code=500)
        
        # Generate audio if analysis was successful
        audio_url = await text_to_speech(analysis_text)
        
        # Cache the result
        analysis_cache[image_hash] = {
            'timestamp': time.time(),
            'result': {
                'text': analysis_text,
                'audioUrl': audio_url
            }
        }
        
        processing_time = round(time.time() - start_time, 2)
        logger.info(f"Palm analysis completed in {processing_time}s")
        
        return JSONResponse({
            "text": analysis_text,
            "audioUrl": audio_url,
            "status": "success",
            "processingTime": processing_time
        })
        
    except HTTPException as e:
        # Pass through HTTP exceptions
        raise e
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        return JSONResponse({
            "text": "A mystical error occurred. The stars are not aligned for this reading.",
            "audioUrl": "", 
            "status": "error"
        }, status_code=500)


@app.get("/audio/{filename}")
async def get_audio(filename: str):
    """Serve audio files with caching support"""
    if filename.startswith("cached_"):
        # This is a cached file
        hash_part = filename.replace("cached_", "").replace(".mp3", "")
        path = CACHE_DIR / f"audio_{hash_part}.mp3"
    else:
        # Regular temp file
        path = TEMP_DIR / filename
    
    if not path.exists():
        logger.warning(f"Audio file not found: {path}")
        raise HTTPException(status_code=404, detail="Audio file not found")
    
    return FileResponse(path, media_type="audio/mpeg")


@app.get("/health")
def health():
    """Health check endpoint with API status information"""
    # Check if OpenAI API key is configured
    openai_status = "ok" if os.getenv("OPENAI_API_KEY") else "missing"
    
    # Check if ElevenLabs API key is configured
    # elevenlabs_status = "ok" if os.getenv("ELEVENLABS_API_KEY") else "missing"
    
    # Get cache statistics
    cache_stats = {
        "analysis_items": len(analysis_cache),
        "cache_dir_size_mb": round(sum(f.stat().st_size for f in CACHE_DIR.glob('**/*') if f.is_file()) / (1024 * 1024), 2) if CACHE_DIR.exists() else 0
    }
    
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "api_version": app.version,
        "services": {
            "openai": openai_status
            # "elevenlabs": elevenlabs_status
        },
        "cache": cache_stats
    }


@app.get("/")
async def root():
    return {
        "message": "Palm Reading API",
        "version": "1.0.0",
        "endpoints": {
            "analyze": "/api/analyze-palm",
            "health": "/health"
        }
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
