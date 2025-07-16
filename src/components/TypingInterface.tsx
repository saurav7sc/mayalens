import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { RotateCcw, Shuffle } from "lucide-react";

interface TypingInterfaceProps {
  language?: "english" | "nepali";
  mode?: "learn" | "practice";
  sampleText?: string;
  fontSize?: number;
  onStatsUpdate?: (stats: {
    wpm: number;
    accuracy: number;
    errors: number;
    elapsedTime: number;
  }) => void;
}

const TypingInterface = ({
  language = "english",
  mode = "practice",
  sampleText,
  fontSize = 16,
  onStatsUpdate = () => {},
}: TypingInterfaceProps) => {
  // Sample texts for different languages and modes
  const sampleTexts = {
    english: {
      learn: [
        "cat dog run jump sit",
        "the quick brown fox",
        "hello world how are you",
        "practice makes perfect typing skills",
      ],
      practice: [
        "The quick brown fox jumps over the lazy dog. This pangram contains all the letters of the English alphabet. It is often used to test typewriters or fonts, or to display examples of fonts.",
        "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat.",
        "To be or not to be, that is the question. Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles.",
        "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity.",
      ],
    },
    nepali: {
      learn: ["क ख ग घ ङ", "मा पा बा फा", "नमस्ते कस्तो छ", "राम्रो छ धन्यवाद"],
      practice: [
        "नेपाली भाषा नेपालको राष्ट्रभाषा हो। यो भाषा नेपालमा बोलिने प्रमुख भाषाहरू मध्ये एक हो। नेपाली भाषा देवनागरी लिपिमा लेखिन्छ र यसको आफ्नै विशेष व्याकरण र शब्दावली छ।",
        "नेपाल एक सुन्दर देश हो। यहाँ हिमाल, पहाड र तराई तीन भू-भाग छन्। नेपालमा विविध संस्कृति, भाषा र परम्परा पाइन्छ। यो देश प्राकृतिक सौन्दर्यले भरिपूर्ण छ।",
        "शिक्षा मानव जीवनको आधार हो। यसले व्यक्तिको व्यक्तित्व विकास गर्छ र समाजको प्रगतिमा योगदान पुर्याउँछ। शिक्षाले मानिसलाई सभ्य र संस्कारी बनाउँछ।",
        "पर्यटन नेपालको अर्थतन्त्रको मुख्य आधार हो। यहाँका पर्वतहरू, मन्दिरहरू र सांस्कृतिक सम्पदाले विदेशी पर्यटकहरूलाई आकर्षित गर्छ।",
      ],
    },
  };

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Get current sample text
  const currentSampleText =
    sampleText || sampleTexts[language][mode][currentTextIndex];

  // Get next character to type
  const nextChar =
    typedText.length < currentSampleText.length
      ? currentSampleText[typedText.length].toLowerCase()
      : "";

  // Keyboard layout for highlighting
  const keyboardLayout = {
    english: [
      ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
      ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
      ["z", "x", "c", "v", "b", "n", "m"],
    ],
    nepali: [
      ["त्र", "ध", "भ", "च", "त", "थ", "ग", "ष", "य", "उ"],
      ["ब", "क", "म", "ा", "न", "ज", "व", "प", "ि"],
      ["श", "ह", "अ", "ख", "द", "ल", "स"],
    ],
  };

  // Start timer when user begins typing
  useEffect(() => {
    if (typedText.length === 1 && !startTime) {
      setStartTime(Date.now());
      setIsActive(true);
    }

    if (typedText.length === 0) {
      resetStats();
    }

    // Check if typing is completed
    if (
      typedText.length === currentSampleText.length &&
      typedText === currentSampleText
    ) {
      setIsCompleted(true);
      setIsActive(false);
    }
  }, [typedText, currentSampleText, startTime]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && startTime) {
      interval = setInterval(() => {
        const currentTime = Date.now();
        setElapsedTime(Math.floor((currentTime - startTime) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, startTime]);

  // Calculate stats
  useEffect(() => {
    if (typedText.length > 0 && elapsedTime > 0) {
      // Calculate WPM (assuming average word length of 5 characters)
      const words = typedText.length / 5;
      const minutes = elapsedTime / 60;
      const calculatedWpm = Math.round(words / minutes);
      setWpm(calculatedWpm);

      // Calculate accuracy and errors
      let errorCount = 0;
      for (let i = 0; i < typedText.length; i++) {
        if (
          i >= currentSampleText.length ||
          typedText[i] !== currentSampleText[i]
        ) {
          errorCount++;
        }
      }
      setErrors(errorCount);

      const calculatedAccuracy = Math.max(
        0,
        Math.round(((typedText.length - errorCount) / typedText.length) * 100),
      );
      setAccuracy(calculatedAccuracy);

      // Calculate progress
      const calculatedProgress = Math.min(
        100,
        (typedText.length / currentSampleText.length) * 100,
      );
      setProgress(calculatedProgress);

      // Update parent component with stats
      onStatsUpdate({
        wpm: calculatedWpm,
        accuracy: calculatedAccuracy,
        errors: errorCount,
        elapsedTime,
      });
    }
  }, [typedText, elapsedTime, currentSampleText, onStatsUpdate]);

  const resetStats = () => {
    setStartTime(null);
    setIsActive(false);
    setElapsedTime(0);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setProgress(0);
    setIsCompleted(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTypedText(e.target.value);
  };

  const handleReset = () => {
    setTypedText("");
    resetStats();
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleShuffle = () => {
    const maxIndex = sampleTexts[language][mode].length - 1;
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * (maxIndex + 1));
    } while (newIndex === currentTextIndex && maxIndex > 0);

    setCurrentTextIndex(newIndex);
    setTypedText("");
    resetStats();
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Render characters with highlighting
  const renderText = () => {
    return currentSampleText.split("").map((char, index) => {
      let className = "text-muted-foreground";

      if (index < typedText.length) {
        className =
          typedText[index] === char
            ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
            : "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
      } else if (index === typedText.length) {
        className =
          "text-foreground bg-blue-200 dark:bg-blue-800/50 animate-pulse";
      }

      return (
        <span
          key={index}
          className={`${className} transition-colors duration-150`}
        >
          {char}
        </span>
      );
    });
  };

  // Render virtual keyboard for learn mode
  const renderKeyboard = () => {
    if (mode !== "learn") return null;

    return (
      <div className="mb-6 p-4 bg-muted/20 rounded-lg border">
        <h4 className="text-sm font-semibold mb-3 text-center">
          Virtual Keyboard
        </h4>
        <div className="space-y-2">
          {keyboardLayout[language].map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1">
              {row.map((key) => {
                const isHighlighted =
                  key === nextChar || (nextChar === " " && key === "space");
                return (
                  <div
                    key={key}
                    className={`
                      px-3 py-2 rounded border text-sm font-medium min-w-[40px] text-center
                      transition-all duration-200
                      ${
                        isHighlighted
                          ? "bg-primary text-primary-foreground shadow-lg scale-110 border-primary"
                          : "bg-background border-border hover:bg-muted/50"
                      }
                    `}
                  >
                    {key}
                  </div>
                );
              })}
            </div>
          ))}
          {/* Space bar */}
          <div className="flex justify-center mt-2">
            <div
              className={`
                px-8 py-2 rounded border text-sm font-medium
                transition-all duration-200
                ${
                  nextChar === " "
                    ? "bg-primary text-primary-foreground shadow-lg scale-105 border-primary"
                    : "bg-background border-border hover:bg-muted/50"
                }
              `}
            >
              Space
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render finger placement guide
  const renderFingerPlacement = () => {
    if (mode !== "learn") return null;

    return (
      <div className="mt-6 p-4 bg-muted/20 rounded-lg border">
        <h4 className="text-sm font-semibold mb-3 text-center">
          Proper Finger Placement
        </h4>
        <div className="flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80"
            alt="Proper finger placement on keyboard"
            className="max-w-full h-auto rounded-lg shadow-sm"
          />
        </div>
        <div className="mt-3 text-xs text-muted-foreground text-center space-y-1">
          <p>
            • Place your fingers on the home row: ASDF (left hand) and JKL;
            (right hand)
          </p>
          <p>• Keep your wrists straight and fingers curved</p>
          <p>• Use the correct finger for each key as shown above</p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-background">
      <Card className="mb-6 shadow-lg border-2">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-foreground">
              {language === "english" ? "English" : "नेपाली"} Typing{" "}
              {mode === "learn" ? "Learning" : "Practice"}
              {mode === "learn" && (
                <span className="ml-2 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                  📚 Learn Mode
                </span>
              )}
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShuffle}
                className="flex items-center gap-2"
              >
                <Shuffle className="h-4 w-4" />
                Shuffle
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          <div className="mb-6">
            {mode === "learn" && (
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  💡 Learning Tips:
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Take your time and focus on accuracy over speed</li>
                  <li>• Use proper finger positioning on the keyboard</li>
                  <li>• Practice regularly for better muscle memory</li>
                  {language === "nepali" && (
                    <li>
                      • Familiarize yourself with Devanagari script layout
                    </li>
                  )}
                </ul>
              </div>
            )}
            <div
              className={`leading-relaxed p-6 rounded-lg bg-muted/30 border-2 border-dashed border-muted-foreground/20 ${language === "nepali" ? "font-sans" : "font-serif"} ${mode === "learn" ? "text-lg" : ""}`}
              style={{
                fontSize: `${mode === "learn" ? fontSize + 2 : fontSize}px`,
                lineHeight: 1.6,
              }}
            >
              {renderText()}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Progress: {Math.round(progress)}%
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                Time: {formatTime(elapsedTime)}
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {renderKeyboard()}

          <div className="mb-6">
            <textarea
              ref={textareaRef}
              value={typedText}
              onChange={handleInputChange}
              className="w-full p-4 border-2 rounded-lg min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 bg-background transition-all duration-200 resize-none"
              placeholder={`Start typing in ${language === "english" ? "English" : "नेपाली"}...`}
              spellCheck="false"
              autoComplete="off"
              disabled={isCompleted}
              style={{ fontSize: `${fontSize}px` }}
            />
          </div>

          {renderFingerPlacement()}

          {isCompleted && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                🎉 Congratulations! You completed the text!
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">WPM:</span> {wpm}
                </div>
                <div>
                  <span className="font-medium">Accuracy:</span> {accuracy}%
                </div>
                <div>
                  <span className="font-medium">Time:</span>{" "}
                  {formatTime(elapsedTime)}
                </div>
                <div>
                  <span className="font-medium">Errors:</span> {errors}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TypingInterface;
