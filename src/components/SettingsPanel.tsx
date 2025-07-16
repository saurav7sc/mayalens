import React, { useState } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Settings, Moon, Sun, X } from "lucide-react";

interface SettingsPanelProps {
  onFontSizeChange?: (size: number) => void;
  onThemeChange?: (isDark: boolean) => void;
  isDarkTheme?: boolean;
  fontSize?: number;
}

const SettingsPanel = ({
  onFontSizeChange = () => {},
  onThemeChange = () => {},
  isDarkTheme = false,
  fontSize = 16,
}: SettingsPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleFontSizeChange = (value: number[]) => {
    onFontSizeChange(value[0]);
  };

  const handleThemeChange = (checked: boolean) => {
    onThemeChange(checked);
  };

  return (
    <div className="relative bg-background">
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 rounded-full shadow-md z-10"
        onClick={togglePanel}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Settings className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-16 right-4 w-72 shadow-lg z-10 border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Font Size</span>
                <span className="text-sm text-muted-foreground">
                  {fontSize}px
                </span>
              </div>
              <Slider
                defaultValue={[fontSize]}
                min={12}
                max={24}
                step={1}
                onValueChange={handleFontSizeChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4" />
                <span className="text-sm font-medium">Dark Theme</span>
                <Moon className="h-4 w-4" />
              </div>
              <Switch
                checked={isDarkTheme}
                onCheckedChange={handleThemeChange}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SettingsPanel;
