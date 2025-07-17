import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import {
  Upload,
  Play,
  Pause,
  RotateCcw,
  Camera,
  Share2,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PalmReaderProps {
  className?: string;
}

interface AnalysisResult {
  text: string;
  audioUrl: string;
}

interface FortuneSection {
  icon: string;
  title: string;
  content: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PalmReader: React.FC<PalmReaderProps> = ({ className }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fortuneSections, setFortuneSections] = useState<FortuneSection[]>([]);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Platform detection effect
  useEffect(() => {
    // Simple Android detection
    const isAndroidDevice = /android/i.test(navigator.userAgent);
    setIsAndroid(isAndroidDevice);
  }, []);

  // Parse the analysis text into sections
  const parseAnalysisText = (text: string): FortuneSection[] => {
    const sections = text.split("\n\n").filter((section) => section.trim());
    const parsedSections: FortuneSection[] = [];

    sections.forEach((section) => {
      const lines = section.split("\n").filter((line) => line.trim());
      if (lines.length >= 2) {
        const titleLine = lines[0].trim();
        const content = lines.slice(1).join(" ").trim();

        // Extract icon and title
        const iconMatch = titleLine.match(
          /^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])\s*(.+)$/u,
        );
        if (iconMatch) {
          parsedSections.push({
            icon: iconMatch[1],
            title: iconMatch[2],
            content: content,
          });
        } else {
          // Fallback for sections without emojis
          parsedSections.push({
            icon: "✨",
            title: titleLine,
            content: content,
          });
        }
      }
    });

    return parsedSections;
  };

  // Handle sharing functionality
  const handleShare = async () => {
    const shareText = `Check out my palm reading analysis! ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Palm Reading Analysis",
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // Fallback to copy
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      const shareText = `Check out my palm reading analysis! ${shareUrl}`;
      await navigator.clipboard.writeText(shareText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Set up share URL
  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file (JPG or PNG)");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("Image file must be smaller than 10MB");
        return;
      }

      try {
        // Compress and optimize the image
        const optimizedFile = await compressImage(file);
        setSelectedImage(optimizedFile);
        setError(null);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(optimizedFile);
      } catch (error) {
        console.error("Error optimizing image:", error);
        // Fallback to original file
        setSelectedImage(file);
        setError(null);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Function to compress and optimize images before upload
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      // Skip compression for small files (less than 1MB)
      if (file.size <= 1024 * 1024) {
        return resolve(file);
      }
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          
          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          const maxDimension = 1200;
          
          if (width > height && width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert to JPEG with quality 0.8 (80%)
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }
            
            // Create a new file from the blob
            const optimizedFile = new File(
              [blob], 
              file.name.replace(/\.[^\.]+$/, '.jpg'), 
              { type: 'image/jpeg' }
            );
            
            console.log(`Image optimized: ${(file.size / (1024 * 1024)).toFixed(2)}MB -> ${(optimizedFile.size / (1024 * 1024)).toFixed(2)}MB`);
            resolve(optimizedFile);
          }, 'image/jpeg', 0.8);
        };
        img.onerror = () => reject(new Error('Image loading error'));
      };
      reader.onerror = () => reject(new Error('File reading error'));
    });
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setProgress(0);
    setError(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await fetch(`${API_BASE_URL}/api/analyze-palm`, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Invalid image. Please try another.");
        } else if (response.status === 429) {
          throw new Error("Too many requests. Please wait a minute before trying again.");
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      const data = await response.json();
      
      // Check if the response indicates an error or fallback message
      if (data.status === "error") {
        throw new Error(data.text || "Something went wrong with the analysis. Please try another image.");
      }
      
      // Verify minimum content length for a proper reading
      if (!data.text || data.text.length < 100) {
        throw new Error("The reading was incomplete. Please try uploading a clearer image of your palm.");
      }
      
      const analysisResult = {
        text: data.text,
        audioUrl: data.audioUrl || "",
      };
      
      setResult(analysisResult);
      setFortuneSections(parseAnalysisText(data.text));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleTryAgain = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    setIsPlaying(false);
    setFortuneSections([]);
    setCopySuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4",
        className,
      )}
    >
      <div className="max-w-2xl mx-auto">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="relative">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  className="text-indigo-600 dark:text-indigo-400"
                  fill="currentColor"
                >
                  <path
                    d="M24 4c-1.5 0-3 0.5-4 1.5L12 14c-2 2-2 5 0 7l8 8c1 1 2.5 1.5 4 1.5s3-0.5 4-1.5l8-8c2-2 2-5 0-7L28 5.5c-1-1-2.5-1.5-4-1.5z"
                    opacity="0.3"
                  />
                  <path d="M24 8c-0.5 0-1 0.2-1.4 0.6L16 15.2c-0.8 0.8-0.8 2 0 2.8l6.6 6.6c0.4 0.4 0.9 0.6 1.4 0.6s1-0.2 1.4-0.6L32 18c0.8-0.8 0.8-2 0-2.8L25.4 8.6C25 8.2 24.5 8 24 8z" />
                  <circle cx="24" cy="16" r="2" fill="white" opacity="0.8" />
                  <path d="M20 20h8v2h-8z" fill="white" opacity="0.6" />
                  <path d="M22 24h4v1h-4z" fill="white" opacity="0.4" />
                </svg>
                <div className="absolute -top-1 -right-1 text-yellow-400">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 0l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  MystiView
                </h1>
                <div className="flex items-center gap-1 justify-center mt-1">
                  <span className="text-2xl">✋</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                    AI PALM READING
                  </span>
                  <span className="text-2xl">🔮</span>
                </div>
              </div>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium mb-2">
              Discover what your palm says about your personality, career, and
              hidden talents
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload a photo of your palm and get instant <span className="text-indigo-600 dark:text-indigo-400">AI-powered palmistry
            insights</span> — completely free! Learn about your <a href="#personality" className="underline hover:text-indigo-600 dark:hover:text-indigo-400">personality</a>, <a href="#career" className="underline hover:text-indigo-600 dark:hover:text-indigo-400">career</a>, and <a href="#talents" className="underline hover:text-indigo-600 dark:hover:text-indigo-400">hidden talents</a>.
          </p>
          </div>
        </div>

        {!result ? (
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-gray-900 dark:text-white">
                Upload Palm Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Upload Area */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Selected palm image for palmistry analysis"
                      className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Image selected
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Select Palm Image
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        JPG or PNG file (max 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* File Inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {/* Separate input for camera capture */}
              <input
                id="camera-input"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                className="hidden"
              />
              
              {/* Camera input is shown conditionally based on platform */}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center flex-wrap">
                <Button
                  onClick={handleButtonClick}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Select Image
                </Button>
                
                {isAndroid && (
                  <Button
                    onClick={() => document.getElementById('camera-input')?.click()}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Take Photo
                  </Button>
                )}

                {selectedImage && (
                  <Button
                    onClick={handleUpload}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 mt-2 sm:mt-0"
                  >
                    {isLoading ? "Analyzing..." : "Analyze Palm"}
                  </Button>
                )}
              </div>

              {/* Progress Bar */}
              {isLoading && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    Please wait... AI is analyzing your palm lines
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-700 dark:text-red-400 text-center">
                    {error}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          /* Results Display */
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold font-quicksand bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Your Mystical Palm Reading
              </h2>
              <p className="text-gray-600 dark:text-gray-300 font-quicksand">
                The AI art of palmistry reveals your destiny
              </p>
            </div>

            {/* Fortune Cards */}
            <div className="space-y-4">
              {fortuneSections.map((section, index) => {
                // Check if this is the share section
                const isShareSection =
                  section.content.includes("Share your palm reading") ||
                  section.content.includes("mystiview.com");

                if (isShareSection) {
                  return (
                    <div
                      key={index}
                      className={cn(
                        "relative overflow-hidden rounded-2xl p-6 text-center",
                        "bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600",
                        "shadow-xl border border-purple-200 dark:border-purple-800",
                        "animate-fade-in-up animate-glow",
                      )}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className="relative z-10">
                        <div className="text-4xl mb-3">✨</div>
                        <h3 className="text-xl font-bold font-caveat text-white mb-4">
                          Share Your Mystical Reading
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <Button
                            onClick={handleShare}
                            className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                            variant="outline"
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Reading
                          </Button>
                          <Button
                            onClick={handleCopy}
                            className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                            variant="outline"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            {copySuccess ? "Copied!" : "Copy Link"}
                          </Button>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                    </div>
                  );
                }

                // Generate a section ID based on the title
                const sectionId = section.title?.toLowerCase().replace(/\s+/g, '-') || `section-${index}`;
                
                return (
                  <div
                    id={sectionId}
                    key={index}
                    className={cn(
                      "relative overflow-hidden rounded-2xl p-6",
                      "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50",
                      "dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20",
                      "shadow-xl border border-amber-200 dark:border-amber-800",
                      "hover:shadow-2xl transition-all duration-300",
                      "animate-fade-in-up",
                    )}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-3xl">{section.icon}</div>
                        <h3 className="text-xl font-bold font-caveat text-amber-800 dark:text-amber-200">
                          {section.title}
                        </h3>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-quicksand text-lg">
                        {section.content}
                      </p>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-200/30 to-transparent rounded-full -translate-y-16 translate-x-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-200/30 to-transparent rounded-full translate-y-12 -translate-x-12" />
                  </div>
                );
              })}
            </div>

            {/* Audio Player */}
            {/* <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={handlePlayAudio}
                    size="lg"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 mr-2" />
                    ) : (
                      <Play className="w-5 h-5 mr-2" />
                    )}
                    {isPlaying ? "Pause Audio" : "Listen to Reading"}
                  </Button>
                </div>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-3 font-quicksand">
                  Experience your reading in mystical audio
                </p>
              </CardContent>
            </Card> */}

            {/* Audio Element */}
            {result.audioUrl && (
              <audio
                ref={audioRef}
                src={result.audioUrl}
                onEnded={handleAudioEnded}
                preload="metadata"
              />
            )}

            {/* Try Again Button */}
            <div className="text-center">
              <Button
                onClick={handleTryAgain}
                variant="outline"
                size="lg"
                className="font-quicksand border-2 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Read Another Palm
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This is for entertainment purposes only. No scientific basis.
          </p>
          <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
            <p>© 2025 MystiView. All rights reserved.</p>
            <p>
              <a
                href="/about"
                className="hover:text-indigo-600 transition-colors"
              >
                About
              </a>
              {" • "}
              <a
                href="/contact"
                className="hover:text-indigo-600 transition-colors"
              >
                Contact
              </a>
              {" • "}
              <a
                href="/privacy"
                className="hover:text-indigo-600 transition-colors"
              >
                Privacy Policy
              </a>
              {" • "}
              <a
                href="/terms"
                className="hover:text-indigo-600 transition-colors"
              >
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PalmReader;
