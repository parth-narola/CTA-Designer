import { useState, useRef, useCallback, useEffect } from "react";
import { toPng, toJpeg } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Image, Type, Palette, Settings2, ChevronDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface CTAConfig {
  heading: string;
  description: string;
  buttonText: string;
  bgColor: string;
  stripeColor: string;
  stripeOpacity: number;
  headingColor: string;
  descriptionColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  headingSize: number;
  descriptionSize: number;
  buttonSize: number;
  fontFamily: string;
  stripeAngle: number;
  stripeWidth: number;
  borderRadius: number;
}

const colorPresets = [
  { name: "Blue", bg: "#8CC3D5", stripe: "#ffffff", heading: "#000000", desc: "#000000" },
  { name: "Pink", bg: "#F7D8E9", stripe: "#ffffff", heading: "#000000", desc: "#000000" },
  { name: "Yellow", bg: "#F9E7DB", stripe: "#ffffff", heading: "#000000", desc: "#000000" },
  { name: "Green", bg: "#99D9CA", stripe: "#ffffff", heading: "#000000", desc: "#000000" },
];

const fontOptions = [
  { value: "'Inter', sans-serif", label: "Inter" },
  { value: "'Open Sans', sans-serif", label: "Open Sans" },
  { value: "'Poppins', sans-serif", label: "Poppins" },
  { value: "'Montserrat', sans-serif", label: "Montserrat" },
  { value: "'Roboto', sans-serif", label: "Roboto" },
  { value: "'Plus Jakarta Sans', sans-serif", label: "Plus Jakarta Sans" },
  { value: "'Space Grotesk', sans-serif", label: "Space Grotesk" },
  { value: "'DM Sans', sans-serif", label: "DM Sans" },
  { value: "'Outfit', sans-serif", label: "Outfit" },
  { value: "'Playfair Display', serif", label: "Playfair Display" },
  { value: "'Lora', serif", label: "Lora" },
  { value: "'Merriweather', serif", label: "Merriweather" },
];

const defaultConfig: CTAConfig = {
  heading: "Improve Test Coverage Without Chasing Numbers",
  description: "Build meaningful coverage strategies that reduce risk and improve release confidence.",
  buttonText: "Contact Us",
  bgColor: "#F7D8E9",
  stripeColor: "#ffffff",
  stripeOpacity: 0.5,
  headingColor: "#000000",
  descriptionColor: "#000000",
  buttonBgColor: "#000000",
  buttonTextColor: "#ffffff",
  headingSize: 36,
  descriptionSize: 16,
  buttonSize: 16,
  fontFamily: "'DM Sans', sans-serif",
  stripeAngle: -20,
  stripeWidth: 160,
  borderRadius: 0,
};

export default function CTADesigner() {
  const [config, setConfig] = useState<CTAConfig>(defaultConfig);
  const [isExporting, setIsExporting] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (wrapperRef.current) {
        const containerWidth = wrapperRef.current.clientWidth - 48;
        const s = Math.min(1, containerWidth / 1024);
        setScale(s);
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const updateConfig = useCallback((updates: Partial<CTAConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const applyPreset = useCallback((preset: typeof colorPresets[0]) => {
    updateConfig({
      bgColor: preset.bg,
      stripeColor: preset.stripe,
      headingColor: preset.heading,
      descriptionColor: preset.desc,
    });
  }, [updateConfig]);

  const exportImage = useCallback(async (format: "png" | "jpg") => {
    if (!ctaRef.current) return;
    setIsExporting(true);
    try {
      const exportFn = format === "png" ? toPng : toJpeg;
      const dataUrl = await exportFn(ctaRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `cta-banner.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background" data-testid="cta-designer-page">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4 h-14 px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-foreground flex items-center justify-center">
              <Type className="w-4 h-4 text-background" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight" data-testid="text-app-title">CTA Designer</h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" disabled={isExporting} data-testid="button-export">
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? "Exporting..." : "Export"}
                <ChevronDown className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportImage("png")} data-testid="button-export-png">
                <Image className="w-4 h-4 mr-2" />
                Export as PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportImage("jpg")} data-testid="button-export-jpg">
                <Image className="w-4 h-4 mr-2" />
                Export as JPG
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <div className="mb-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Preview</h2>
            </div>
            <div ref={wrapperRef} className="flex items-center justify-center bg-muted/30 rounded-lg p-6 border border-border/50">
              <div style={{ width: `${1024 * scale}px`, height: `${300 * scale}px` }}>
              <div
                ref={ctaRef}
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  width: "1024px",
                  height: "300px",
                  backgroundColor: config.bgColor,
                  fontFamily: config.fontFamily,
                  borderRadius: `${config.borderRadius}px`,
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px 80px",
                  boxSizing: "border-box",
                }}
                data-testid="cta-preview"
              >
                <svg
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                  }}
                  viewBox="0 0 1024 300"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <clipPath id="bannerClip">
                      <rect x="0" y="0" width="1024" height="300" />
                    </clipPath>
                  </defs>
                  <g clipPath="url(#bannerClip)">
                    {(() => {
                      const skew = Math.tan((Math.abs(config.stripeAngle) * Math.PI) / 180);
                      const w = config.stripeWidth;
                      const spacing = w * 2.4;
                      return Array.from({ length: 5 }).map((_, i) => {
                        const baseX = -400 + i * spacing;
                        const topLeft = baseX + 300 * skew;
                        const topRight = topLeft + w;
                        const bottomLeft = baseX;
                        const bottomRight = baseX + w;
                        return (
                          <polygon
                            key={i}
                            points={`${topLeft},-10 ${topRight},-10 ${bottomRight},310 ${bottomLeft},310`}
                            fill="rgba(255,255,255,1)"
                            opacity={config.stripeOpacity * 0.3}
                          />
                        );
                      });
                    })()}
                  </g>
                </svg>
                <h2
                  style={{
                    color: config.headingColor,
                    fontSize: `${config.headingSize}px`,
                    fontWeight: 800,
                    fontStyle: "italic",
                    textAlign: "center",
                    margin: "0 0 12px 0",
                    lineHeight: 1.2,
                    position: "relative",
                    zIndex: 1,
                    letterSpacing: "-0.02em",
                  }}
                  data-testid="text-cta-heading"
                >
                  {config.heading}
                </h2>
                <p
                  style={{
                    color: config.descriptionColor,
                    fontSize: `${config.descriptionSize}px`,
                    textAlign: "center",
                    margin: "0 0 24px 0",
                    maxWidth: "600px",
                    lineHeight: 1.6,
                    position: "relative",
                    zIndex: 1,
                  }}
                  data-testid="text-cta-description"
                >
                  {config.description}
                </p>
                <button
                  style={{
                    backgroundColor: config.buttonBgColor,
                    color: config.buttonTextColor,
                    fontSize: `${config.buttonSize}px`,
                    fontWeight: 500,
                    padding: "12px 32px",
                    border: "none",
                    cursor: "pointer",
                    position: "relative",
                    zIndex: 1,
                    fontFamily: config.fontFamily,
                    letterSpacing: "0.01em",
                    borderRadius: config.borderRadius > 0 ? `${Math.min(config.borderRadius, 8)}px` : "0px",
                  }}
                  data-testid="button-cta-action"
                >
                  {config.buttonText}
                </button>
              </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[360px] shrink-0">
            <div className="mb-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Configuration</h2>
            </div>
            <div className="border border-border/50 rounded-lg bg-card">
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="w-full rounded-b-none h-11 bg-muted/50">
                  <TabsTrigger value="content" className="flex-1 gap-1.5 text-xs" data-testid="tab-content">
                    <Type className="w-3.5 h-3.5" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="colors" className="flex-1 gap-1.5 text-xs" data-testid="tab-colors">
                    <Palette className="w-3.5 h-3.5" />
                    Colors
                  </TabsTrigger>
                  <TabsTrigger value="style" className="flex-1 gap-1.5 text-xs" data-testid="tab-style">
                    <Settings2 className="w-3.5 h-3.5" />
                    Style
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="p-4 space-y-5 mt-0">
                  <div className="space-y-2">
                    <Label htmlFor="heading" className="text-xs font-medium text-muted-foreground">Heading</Label>
                    <Textarea
                      id="heading"
                      value={config.heading}
                      onChange={(e) => updateConfig({ heading: e.target.value })}
                      className="resize-none text-sm"
                      rows={2}
                      data-testid="input-heading"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-xs font-medium text-muted-foreground">Description</Label>
                    <Textarea
                      id="description"
                      value={config.description}
                      onChange={(e) => updateConfig({ description: e.target.value })}
                      className="resize-none text-sm"
                      rows={3}
                      data-testid="input-description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buttonText" className="text-xs font-medium text-muted-foreground">Button Text</Label>
                    <Input
                      id="buttonText"
                      value={config.buttonText}
                      onChange={(e) => updateConfig({ buttonText: e.target.value })}
                      className="text-sm"
                      data-testid="input-button-text"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">Font Family</Label>
                    <Select
                      value={config.fontFamily}
                      onValueChange={(v) => updateConfig({ fontFamily: v })}
                    >
                      <SelectTrigger className="text-sm" data-testid="select-font">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontOptions.map((f) => (
                          <SelectItem key={f.value} value={f.value} data-testid={`font-option-${f.label.toLowerCase().replace(/\s/g, '-')}`}>
                            <span style={{ fontFamily: f.value }}>{f.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="colors" className="p-4 space-y-5 mt-0">
                  <div className="space-y-3">
                    <Label className="text-xs font-medium text-muted-foreground">Color Presets</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {colorPresets.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => applyPreset(preset)}
                          className="group relative"
                          title={preset.name}
                          data-testid={`preset-${preset.name.toLowerCase().replace(/\s/g, '-')}`}
                        >
                          <div
                            className="w-full aspect-square rounded-md border-2 transition-all"
                            style={{
                              backgroundColor: preset.bg,
                              borderColor: config.bgColor === preset.bg ? config.headingColor : "transparent",
                            }}
                          />
                          <span className="text-[10px] text-muted-foreground mt-1 block text-center leading-tight truncate">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="space-y-3">
                    <Label className="text-xs font-medium text-muted-foreground">Custom Colors</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <ColorPicker label="Background" value={config.bgColor} onChange={(v) => updateConfig({ bgColor: v })} testId="color-bg" />
                      <ColorPicker label="Stripes" value={config.stripeColor} onChange={(v) => updateConfig({ stripeColor: v })} testId="color-stripe" />
                      <ColorPicker label="Heading" value={config.headingColor} onChange={(v) => updateConfig({ headingColor: v })} testId="color-heading" />
                      <ColorPicker label="Description" value={config.descriptionColor} onChange={(v) => updateConfig({ descriptionColor: v })} testId="color-description" />
                      <ColorPicker label="Button BG" value={config.buttonBgColor} onChange={(v) => updateConfig({ buttonBgColor: v })} testId="color-button-bg" />
                      <ColorPicker label="Button Text" value={config.buttonTextColor} onChange={(v) => updateConfig({ buttonTextColor: v })} testId="color-button-text" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="style" className="p-4 space-y-5 mt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-muted-foreground">Heading Size</Label>
                      <span className="text-xs text-muted-foreground tabular-nums">{config.headingSize}px</span>
                    </div>
                    <Slider
                      value={[config.headingSize]}
                      min={20}
                      max={56}
                      step={1}
                      onValueChange={([v]) => updateConfig({ headingSize: v })}
                      data-testid="slider-heading-size"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-muted-foreground">Description Size</Label>
                      <span className="text-xs text-muted-foreground tabular-nums">{config.descriptionSize}px</span>
                    </div>
                    <Slider
                      value={[config.descriptionSize]}
                      min={12}
                      max={24}
                      step={1}
                      onValueChange={([v]) => updateConfig({ descriptionSize: v })}
                      data-testid="slider-description-size"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-muted-foreground">Button Size</Label>
                      <span className="text-xs text-muted-foreground tabular-nums">{config.buttonSize}px</span>
                    </div>
                    <Slider
                      value={[config.buttonSize]}
                      min={12}
                      max={22}
                      step={1}
                      onValueChange={([v]) => updateConfig({ buttonSize: v })}
                      data-testid="slider-button-size"
                    />
                  </div>

                  <div className="h-px bg-border" />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-muted-foreground">Stripe Opacity</Label>
                      <span className="text-xs text-muted-foreground tabular-nums">{Math.round(config.stripeOpacity * 100)}%</span>
                    </div>
                    <Slider
                      value={[config.stripeOpacity]}
                      min={0}
                      max={1}
                      step={0.05}
                      onValueChange={([v]) => updateConfig({ stripeOpacity: v })}
                      data-testid="slider-stripe-opacity"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-muted-foreground">Stripe Angle</Label>
                      <span className="text-xs text-muted-foreground tabular-nums">{config.stripeAngle}°</span>
                    </div>
                    <Slider
                      value={[config.stripeAngle]}
                      min={-45}
                      max={45}
                      step={1}
                      onValueChange={([v]) => updateConfig({ stripeAngle: v })}
                      data-testid="slider-stripe-angle"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-muted-foreground">Stripe Width</Label>
                      <span className="text-xs text-muted-foreground tabular-nums">{config.stripeWidth}px</span>
                    </div>
                    <Slider
                      value={[config.stripeWidth]}
                      min={40}
                      max={200}
                      step={5}
                      onValueChange={([v]) => updateConfig({ stripeWidth: v })}
                      data-testid="slider-stripe-width"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-muted-foreground">Border Radius</Label>
                      <span className="text-xs text-muted-foreground tabular-nums">{config.borderRadius}px</span>
                    </div>
                    <Slider
                      value={[config.borderRadius]}
                      min={0}
                      max={24}
                      step={1}
                      onValueChange={([v]) => updateConfig({ borderRadius: v })}
                      data-testid="slider-border-radius"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorPicker({
  label,
  value,
  onChange,
  testId,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  testId: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 rounded-md border border-border cursor-pointer appearance-none bg-transparent [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-none"
            data-testid={testId}
          />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 text-xs font-mono flex-1"
          data-testid={`${testId}-input`}
        />
      </div>
    </div>
  );
}
