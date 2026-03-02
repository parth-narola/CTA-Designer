import { useState, useRef, useCallback, useEffect } from "react";
import { toPng, toJpeg } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Download, Image, Type, Palette, Settings2, ChevronDown, Upload, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import cornerAccentImg from "@assets/Vector_(1)_1772451456855.png";

type LayoutStyle = "centered" | "split" | "background" | "darkSplit";

interface CTAConfig {
  layoutStyle: LayoutStyle;
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
  buttonSpacing: number;
  uploadedImage: string | null;
  overlayOpacity: number;
}

const colorPresets = [
  { name: "Blue", bg: "#8CC3D5", stripe: "#ffffff", heading: "#000000", desc: "#000000" },
  { name: "Pink", bg: "#F7D8E9", stripe: "#ffffff", heading: "#000000", desc: "#000000" },
  { name: "Yellow", bg: "#F9E7DB", stripe: "#ffffff", heading: "#000000", desc: "#000000" },
  { name: "Green", bg: "#99D9CA", stripe: "#ffffff", heading: "#000000", desc: "#000000" },
];

const splitColorPresets = [
  { name: "Mint", bg: "#D5E8E0", stripe: "#ffffff", heading: "#000000", desc: "#000000" },
  { name: "Lavender", bg: "#DDD9E8", stripe: "#ffffff", heading: "#000000", desc: "#000000" },
  { name: "Ice Blue", bg: "#D4DEE8", stripe: "#ffffff", heading: "#000000", desc: "#000000" },
  { name: "Cream", bg: "#E8E4D5", stripe: "#ffffff", heading: "#000000", desc: "#000000" },
];

const bgImageColorPresets = [
  { name: "Light", bg: "#ffffff", stripe: "#ffffff", heading: "#000000", desc: "#000000" },
  { name: "Warm", bg: "#f5f0eb", stripe: "#ffffff", heading: "#000000", desc: "#333333" },
  { name: "Cool", bg: "#eef2f5", stripe: "#ffffff", heading: "#1a1a2e", desc: "#333344" },
  { name: "Soft", bg: "#f0ebe5", stripe: "#ffffff", heading: "#2d2d2d", desc: "#444444" },
];

const darkSplitColorPresets = [
  { name: "Charcoal", bg: "#2d2d2d", stripe: "#ffffff", heading: "#ffffff", desc: "#e0e0e0" },
  { name: "Navy", bg: "#1a1a2e", stripe: "#ffffff", heading: "#ffffff", desc: "#d0d0e0" },
  { name: "Dark Teal", bg: "#1a2e2e", stripe: "#ffffff", heading: "#ffffff", desc: "#d0e0e0" },
  { name: "Graphite", bg: "#3a3a3a", stripe: "#ffffff", heading: "#ffffff", desc: "#cccccc" },
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
  layoutStyle: "centered",
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
  headingSize: 56,
  descriptionSize: 24,
  buttonSize: 22,
  fontFamily: "'DM Sans', sans-serif",
  stripeAngle: -20,
  stripeWidth: 200,
  borderRadius: 0,
  buttonSpacing: 24,
  uploadedImage: null,
  overlayOpacity: 0.75,
};

export default function CTADesigner() {
  const [config, setConfig] = useState<CTAConfig>(defaultConfig);
  const [isExporting, setIsExporting] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (wrapperRef.current) {
        const containerWidth = wrapperRef.current.clientWidth - 48;
        const s = Math.min(1, containerWidth / 2160);
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

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateConfig({ uploadedImage: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  }, [updateConfig]);

  const removeImage = useCallback(() => {
    updateConfig({ uploadedImage: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [updateConfig]);

  const switchLayout = useCallback((style: LayoutStyle) => {
    if (style === "split") {
      updateConfig({
        layoutStyle: "split",
        bgColor: "#D5E8E0",
        heading: "Ready to Upgrade Your QA Process?",
        description: "Discover how Alphabin helps teams ship faster with smarter test insights.",
        headingColor: "#000000",
        descriptionColor: "#000000",
        buttonBgColor: "#000000",
        buttonTextColor: "#ffffff",
        headingSize: 52,
        descriptionSize: 24,
        buttonSize: 22,
        buttonSpacing: 32,
      });
    } else if (style === "background") {
      updateConfig({
        layoutStyle: "background",
        bgColor: "#ffffff",
        heading: "Ready to Upgrade Your QA Process?",
        description: "Discover how Alphabin helps teams ship faster with smarter test insights.",
        headingColor: "#000000",
        descriptionColor: "#000000",
        buttonBgColor: "#000000",
        buttonTextColor: "#ffffff",
        headingSize: 52,
        descriptionSize: 24,
        buttonSize: 22,
        buttonSpacing: 32,
        overlayOpacity: 0.75,
      });
    } else if (style === "darkSplit") {
      updateConfig({
        layoutStyle: "darkSplit",
        bgColor: "#2d2d2d",
        heading: "Ready to Upgrade Your QA Process?",
        description: "Discover how Alphabin helps teams ship faster with smarter test insights.",
        headingColor: "#ffffff",
        descriptionColor: "#e0e0e0",
        buttonBgColor: "#ffffff",
        buttonTextColor: "#000000",
        headingSize: 52,
        descriptionSize: 24,
        buttonSize: 22,
        buttonSpacing: 32,
      });
    } else {
      updateConfig({
        layoutStyle: "centered",
        bgColor: "#F7D8E9",
        heading: "Improve Test Coverage Without Chasing Numbers",
        description: "Build meaningful coverage strategies that reduce risk and improve release confidence.",
        headingColor: "#000000",
        descriptionColor: "#000000",
        buttonBgColor: "#000000",
        buttonTextColor: "#ffffff",
        headingSize: 56,
        descriptionSize: 24,
        buttonSize: 22,
        buttonSpacing: 24,
      });
    }
  }, [updateConfig]);

  const exportImage = useCallback(async (format: "png" | "jpg") => {
    if (!ctaRef.current) return;
    setIsExporting(true);
    try {
      const el = ctaRef.current;
      const originalTransform = el.style.transform;
      el.style.transform = "scale(1)";

      const exportFn = format === "png" ? toPng : toJpeg;
      const dataUrl = await exportFn(el, {
        quality: 1,
        pixelRatio: 1,
        cacheBust: true,
        width: 2160,
        height: 619,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      });

      el.style.transform = originalTransform;

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

  const renderCenteredLayout = () => (
    <>
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
        viewBox="0 0 2160 619"
        preserveAspectRatio="none"
      >
        <defs>
          <clipPath id="bannerClip">
            <rect x="0" y="0" width="2160" height="619" />
          </clipPath>
        </defs>
        <g clipPath="url(#bannerClip)">
          {(() => {
            const skew = Math.tan((Math.abs(config.stripeAngle) * Math.PI) / 180);
            const w = config.stripeWidth * 2;
            const spacing = w * 2.4;
            return Array.from({ length: 6 }).map((_, i) => {
              const baseX = -600 + i * spacing;
              const topLeft = baseX + 619 * skew;
              const topRight = topLeft + w;
              const bottomLeft = baseX;
              const bottomRight = baseX + w;
              return (
                <polygon
                  key={i}
                  points={`${topLeft},-10 ${topRight},-10 ${bottomRight},629 ${bottomLeft},629`}
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
          fontStyle: "normal",
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
          margin: `0 0 ${config.buttonSpacing}px 0`,
          maxWidth: "85%",
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
    </>
  );

  const renderSplitLayout = () => (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "42%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {config.uploadedImage ? (
          <img
            src={config.uploadedImage}
            alt="CTA"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "left bottom",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <Upload style={{ width: "48px", height: "48px", color: "rgba(0,0,0,0.25)" }} />
            <span style={{ color: "rgba(0,0,0,0.35)", fontSize: "20px", fontFamily: config.fontFamily }}>Upload Image</span>
          </div>
        )}
      </div>

      <img
        src={cornerAccentImg}
        alt=""
        style={{
          position: "absolute",
          bottom: "0",
          right: "0",
          width: "320px",
          height: "auto",
          pointerEvents: "none",
          opacity: 1,
        }}
      />

      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "55%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 120px 60px 60px",
          boxSizing: "border-box",
          zIndex: 1,
        }}
      >
        <h2
          style={{
            color: config.headingColor,
            fontSize: `${config.headingSize}px`,
            fontWeight: 800,
            fontStyle: "normal",
            textAlign: "left",
            margin: "0 0 16px 0",
            lineHeight: 1.2,
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
            textAlign: "left",
            margin: `0 0 ${config.buttonSpacing}px 0`,
            maxWidth: "90%",
            lineHeight: 1.6,
          }}
          data-testid="text-cta-description"
        >
          {config.description}
        </p>
        <div>
          <button
            style={{
              backgroundColor: config.buttonBgColor,
              color: config.buttonTextColor,
              fontSize: `${config.buttonSize}px`,
              fontWeight: 500,
              padding: "14px 40px",
              border: "none",
              cursor: "pointer",
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
    </>
  );

  const renderBackgroundLayout = () => (
    <>
      {config.uploadedImage && (
        <img
          src={config.uploadedImage}
          alt="CTA Background"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `linear-gradient(to right, ${config.bgColor} 0%, ${config.bgColor}ee 35%, ${config.bgColor}aa 60%, ${config.bgColor}66 85%, ${config.bgColor}33 100%)`,
          opacity: config.overlayOpacity,
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 160px",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            color: config.headingColor,
            fontSize: `${config.headingSize}px`,
            fontWeight: 800,
            fontStyle: "normal",
            textAlign: "left",
            margin: "0 0 16px 0",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            maxWidth: "55%",
          }}
          data-testid="text-cta-heading"
        >
          {config.heading}
        </h2>
        <p
          style={{
            color: config.descriptionColor,
            fontSize: `${config.descriptionSize}px`,
            textAlign: "left",
            margin: `0 0 ${config.buttonSpacing}px 0`,
            maxWidth: "45%",
            lineHeight: 1.6,
          }}
          data-testid="text-cta-description"
        >
          {config.description}
        </p>
        <div>
          <button
            style={{
              backgroundColor: config.buttonBgColor,
              color: config.buttonTextColor,
              fontSize: `${config.buttonSize}px`,
              fontWeight: 500,
              padding: "14px 40px",
              border: "none",
              cursor: "pointer",
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
    </>
  );

  const renderDarkSplitLayout = () => (
    <>
      {config.uploadedImage ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "50%",
            height: "100%",
          }}
        >
          <img
            src={config.uploadedImage}
            alt="CTA"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: "-1px",
              width: "60%",
              height: "100%",
              background: `linear-gradient(to right, transparent 0%, ${config.bgColor} 100%)`,
            }}
          />
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "45%",
            height: "100%",
            backgroundColor: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <Upload style={{ width: "48px", height: "48px", color: "rgba(255,255,255,0.3)" }} />
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "20px", fontFamily: config.fontFamily }}>Upload Image</span>
        </div>
      )}

      <img
        src={cornerAccentImg}
        alt=""
        style={{
          position: "absolute",
          bottom: "0",
          right: "0",
          width: "280px",
          height: "auto",
          pointerEvents: "none",
          opacity: 0.15,
        }}
      />

      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "55%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 120px 60px 80px",
          boxSizing: "border-box",
          zIndex: 1,
        }}
      >
        <h2
          style={{
            color: config.headingColor,
            fontSize: `${config.headingSize}px`,
            fontWeight: 800,
            fontStyle: "normal",
            textAlign: "left",
            margin: "0 0 16px 0",
            lineHeight: 1.2,
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
            textAlign: "left",
            margin: `0 0 ${config.buttonSpacing}px 0`,
            maxWidth: "90%",
            lineHeight: 1.6,
          }}
          data-testid="text-cta-description"
        >
          {config.description}
        </p>
        <div>
          <button
            style={{
              backgroundColor: config.buttonBgColor,
              color: config.buttonTextColor,
              fontSize: `${config.buttonSize}px`,
              fontWeight: 500,
              padding: "14px 40px",
              border: `2px solid ${config.buttonBgColor}`,
              cursor: "pointer",
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
    </>
  );

  const getActivePresets = () => {
    switch (config.layoutStyle) {
      case "split": return splitColorPresets;
      case "background": return bgImageColorPresets;
      case "darkSplit": return darkSplitColorPresets;
      default: return colorPresets;
    }
  };

  const activePresets = getActivePresets();
  const showImageUpload = config.layoutStyle === "split" || config.layoutStyle === "background" || config.layoutStyle === "darkSplit";

  const renderPreview = () => {
    switch (config.layoutStyle) {
      case "split": return renderSplitLayout();
      case "background": return renderBackgroundLayout();
      case "darkSplit": return renderDarkSplitLayout();
      default: return renderCenteredLayout();
    }
  };

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
              <div style={{ width: `${2160 * scale}px`, height: `${619 * scale}px` }}>
              <div
                ref={ctaRef}
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  width: "2160px",
                  height: "619px",
                  backgroundColor: config.bgColor,
                  fontFamily: config.fontFamily,
                  borderRadius: `${config.borderRadius}px`,
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: config.layoutStyle === "centered" ? "center" : "flex-start",
                  justifyContent: "center",
                  padding: config.layoutStyle === "centered" ? "80px 160px" : "0",
                  boxSizing: "border-box",
                }}
                data-testid="cta-preview"
              >
                {renderPreview()}
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
                    <Label className="text-xs font-medium text-muted-foreground">Layout Style</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => switchLayout("centered")}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-md border-2 transition-all text-xs ${
                          config.layoutStyle === "centered"
                            ? "border-foreground bg-muted/50"
                            : "border-border hover:border-muted-foreground/50"
                        }`}
                        data-testid="layout-centered"
                      >
                        <div className="w-full h-10 rounded-sm bg-muted flex items-center justify-center">
                          <div className="flex flex-col items-center gap-0.5">
                            <div className="w-8 h-1 bg-foreground/40 rounded-full" />
                            <div className="w-5 h-0.5 bg-foreground/25 rounded-full" />
                            <div className="w-4 h-1.5 bg-foreground/30 rounded-sm mt-0.5" />
                          </div>
                        </div>
                        <span className="font-medium">Centered</span>
                      </button>
                      <button
                        onClick={() => switchLayout("split")}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-md border-2 transition-all text-xs ${
                          config.layoutStyle === "split"
                            ? "border-foreground bg-muted/50"
                            : "border-border hover:border-muted-foreground/50"
                        }`}
                        data-testid="layout-split"
                      >
                        <div className="w-full h-10 rounded-sm bg-muted flex">
                          <div className="w-[40%] h-full bg-foreground/15 rounded-l-sm" />
                          <div className="flex-1 flex flex-col justify-center items-start pl-2 gap-0.5">
                            <div className="w-6 h-1 bg-foreground/40 rounded-full" />
                            <div className="w-4 h-0.5 bg-foreground/25 rounded-full" />
                            <div className="w-3 h-1.5 bg-foreground/30 rounded-sm mt-0.5" />
                          </div>
                        </div>
                        <span className="font-medium">Split Image</span>
                      </button>
                      <button
                        onClick={() => switchLayout("background")}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-md border-2 transition-all text-xs ${
                          config.layoutStyle === "background"
                            ? "border-foreground bg-muted/50"
                            : "border-border hover:border-muted-foreground/50"
                        }`}
                        data-testid="layout-background"
                      >
                        <div className="w-full h-10 rounded-sm bg-muted relative overflow-hidden">
                          <div className="absolute inset-0 bg-foreground/10" />
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                            <div className="w-6 h-1 bg-foreground/50 rounded-full" />
                            <div className="w-4 h-0.5 bg-foreground/30 rounded-full" />
                            <div className="w-3 h-1.5 bg-foreground/40 rounded-sm mt-0.5" />
                          </div>
                        </div>
                        <span className="font-medium">BG Image</span>
                      </button>
                      <button
                        onClick={() => switchLayout("darkSplit")}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-md border-2 transition-all text-xs ${
                          config.layoutStyle === "darkSplit"
                            ? "border-foreground bg-muted/50"
                            : "border-border hover:border-muted-foreground/50"
                        }`}
                        data-testid="layout-dark-split"
                      >
                        <div className="w-full h-10 rounded-sm bg-neutral-800 flex">
                          <div className="w-[40%] h-full bg-white/15 rounded-l-sm" />
                          <div className="flex-1 flex flex-col justify-center items-start pl-2 gap-0.5">
                            <div className="w-6 h-1 bg-white/60 rounded-full" />
                            <div className="w-4 h-0.5 bg-white/40 rounded-full" />
                            <div className="w-3 h-1.5 bg-white/50 rounded-sm mt-0.5" />
                          </div>
                        </div>
                        <span className="font-medium">Dark Split</span>
                      </button>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  {showImageUpload && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">Image</Label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          data-testid="input-image-upload"
                        />
                        {config.uploadedImage ? (
                          <div className="relative group">
                            <img
                              src={config.uploadedImage}
                              alt="Uploaded"
                              className="w-full h-24 object-cover rounded-md border border-border"
                            />
                            <button
                              onClick={removeImage}
                              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-background/80 border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              data-testid="button-remove-image"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-20 rounded-md border-2 border-dashed border-border hover:border-muted-foreground/50 flex flex-col items-center justify-center gap-1.5 transition-colors"
                            data-testid="button-upload-image"
                          >
                            <Upload className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Click to upload</span>
                          </button>
                        )}
                      </div>
                      <div className="h-px bg-border" />
                    </>
                  )}

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
                      {activePresets.map((preset) => (
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

                <TabsContent value="style" className="p-4 space-y-4 mt-0">
                  <div className="space-y-3">
                    <Label className="text-xs font-medium text-muted-foreground">Text Sizes</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <SizeInput label="Heading" value={config.headingSize} onChange={(v) => updateConfig({ headingSize: v })} suffix="px" testId="input-heading-size" />
                      <SizeInput label="Description" value={config.descriptionSize} onChange={(v) => updateConfig({ descriptionSize: v })} suffix="px" testId="input-description-size" />
                      <SizeInput label="Button" value={config.buttonSize} onChange={(v) => updateConfig({ buttonSize: v })} suffix="px" testId="input-button-size" />
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="space-y-3">
                    <Label className="text-xs font-medium text-muted-foreground">Button Spacing</Label>
                    <SizeInput label="Top/Bottom" value={config.buttonSpacing} onChange={(v) => updateConfig({ buttonSpacing: v })} suffix="px" testId="input-button-spacing" />
                  </div>

                  <div className="h-px bg-border" />

                  {config.layoutStyle === "centered" && (
                    <>
                      <div className="space-y-3">
                        <Label className="text-xs font-medium text-muted-foreground">Stripe Settings</Label>
                        <div className="grid grid-cols-3 gap-3">
                          <SizeInput label="Opacity %" value={Math.round(config.stripeOpacity * 100)} onChange={(v) => updateConfig({ stripeOpacity: Math.min(100, Math.max(0, v)) / 100 })} suffix="%" testId="input-stripe-opacity" />
                          <SizeInput label="Angle" value={config.stripeAngle} onChange={(v) => updateConfig({ stripeAngle: v })} suffix="°" testId="input-stripe-angle" />
                          <SizeInput label="Width" value={config.stripeWidth} onChange={(v) => updateConfig({ stripeWidth: v })} suffix="px" testId="input-stripe-width" />
                        </div>
                      </div>
                      <div className="h-px bg-border" />
                    </>
                  )}

                  {config.layoutStyle === "background" && (
                    <>
                      <div className="space-y-3">
                        <Label className="text-xs font-medium text-muted-foreground">Overlay Settings</Label>
                        <SizeInput label="Overlay %" value={Math.round(config.overlayOpacity * 100)} onChange={(v) => updateConfig({ overlayOpacity: Math.min(100, Math.max(0, v)) / 100 })} suffix="%" testId="input-overlay-opacity" />
                      </div>
                      <div className="h-px bg-border" />
                    </>
                  )}

                  <div className="space-y-3">
                    <Label className="text-xs font-medium text-muted-foreground">Border Radius</Label>
                    <SizeInput label="Radius" value={config.borderRadius} onChange={(v) => updateConfig({ borderRadius: v })} suffix="px" testId="input-border-radius" />
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

function SizeInput({
  label,
  value,
  onChange,
  suffix,
  testId,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix: string;
  testId: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] text-muted-foreground">{label}</Label>
      <div className="relative">
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-8 text-xs font-mono pr-8"
          data-testid={testId}
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">{suffix}</span>
      </div>
    </div>
  );
}
