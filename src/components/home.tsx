import React, { useState, useEffect } from "react";
import TypingInterface from "./TypingInterface";
import SettingsPanel from "./SettingsPanel";
import StatsPanel from "./StatsPanel";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Keyboard, Globe, Trophy, Clock } from "lucide-react";

const Home = () => {
  const [language, setLanguage] = useState<"english" | "nepali">("english");
  const [mode, setMode] = useState<"learn" | "practice">("practice");
  const [fontSize, setFontSize] = useState(16);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 100,
    errors: 0,
    elapsedTime: 0,
  });

  // Apply theme to document
  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkTheme]);

  const toggleLanguage = (selected: "english" | "nepali") => {
    setLanguage(selected);
  };

  const toggleMode = (selected: "learn" | "practice") => {
    setMode(selected);
  };

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
  };

  const handleThemeChange = (isDark: boolean) => {
    setIsDarkTheme(isDark);
  };

  const handleStatsUpdate = (newStats: typeof stats) => {
    setStats(newStats);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Keyboard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  HastaRekha
                </h1>
                <p className="text-sm text-muted-foreground">
                  English & Nepali Typing Practice
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
                <Button
                  variant={mode === "learn" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => toggleMode("learn")}
                  className="flex items-center gap-2"
                >
                  📚 Learn
                </Button>
                <Button
                  variant={mode === "practice" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => toggleMode("practice")}
                  className="flex items-center gap-2"
                >
                  ⚡ Practice
                </Button>
              </div>

              <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
                <Button
                  variant={language === "english" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => toggleLanguage("english")}
                  className="flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  English
                </Button>
                <Button
                  variant={language === "nepali" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => toggleLanguage("nepali")}
                  className="flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  Nepali
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Left Stats Panel */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-24">
              <StatsPanel
                wpm={stats.wpm}
                accuracy={stats.accuracy}
                errors={stats.errors}
                elapsedTime={stats.elapsedTime}
              />
            </div>
          </div>

          {/* Main Typing Interface */}
          <div className="flex-1">
            <TypingInterface
              language={language}
              mode={mode}
              fontSize={fontSize}
              onStatsUpdate={handleStatsUpdate}
            />
          </div>
        </div>
      </main>

      {/* Settings Panel */}
      <SettingsPanel
        onFontSizeChange={handleFontSizeChange}
        onThemeChange={handleThemeChange}
        isDarkTheme={isDarkTheme}
        fontSize={fontSize}
      />
    </div>
  );
};

export default Home;
