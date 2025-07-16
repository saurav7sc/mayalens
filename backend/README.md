# Palm Reading API Backend

A FastAPI backend service that analyzes palm images using OpenAI GPT-4V and converts the analysis to speech.

## Features

- Image upload and validation
- Palm reading analysis using OpenAI GPT-4V
- Text-to-speech conversion in Nepali
- RESTful API endpoints
- CORS support for frontend integration

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp ../.env.example .env
```

Required API keys:
- **OpenAI API Key**: Get from https://platform.openai.com/api-keys
- **ElevenLabs API Key**: Get from https://elevenlabs.io/app/speech-synthesis

### 3. Run the Server

```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

### POST /api/analyze-palm
Analyze a palm image and return text + audio analysis.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: image file (JPG/PNG)

**Response:**
```json
{
  "text": "हस्तरेखा विश्लेषण...",
  "audioUrl": "/audio/filename.mp3",
  "status": "success"
}
```

### GET /audio/{filename}
Serve generated audio files.

### GET /health
Health check endpoint.

## Deployment

### Option 1: Render
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `cd backend && pip install -r requirements.txt`
4. Set start command: `cd backend && python main.py`
5. Add environment variables in Render dashboard

### Option 2: Railway
1. Connect repository to Railway
2. Set root directory to `backend`
3. Railway will auto-detect FastAPI
4. Add environment variables

### Option 3: Heroku
1. Create `Procfile` in backend directory:
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
2. Deploy using Heroku CLI or GitHub integration

## Notes

- Images are temporarily stored and should be cleaned up in production
- Consider using cloud storage (AWS S3, Google Cloud Storage) for audio files
- Rate limiting should be implemented for production use
- Add proper logging and monitoring
