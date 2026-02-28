import { useState, useRef, useCallback } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HealthCard } from "@/components/HealthCard";
import { StickyBottomBar } from "@/components/StickyBottomBar";
import { type Language, t, getStoredLanguage, setStoredLanguage } from "@/lib/i18n";
import type { HealthMetrics } from "@/lib/healthConfig";
import { analyzeLabReportWithGemini } from "@/lib/gemini";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [lang, setLang] = useState<Language>(getStoredLanguage);
  const [metrics, setMetrics] = useState<HealthMetrics>({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleLangChange = useCallback((l: Language) => {
    setLang(l);
    setStoredLanguage(l);
  }, []);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({ title: "Please upload a PDF file", variant: "destructive" });
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast({ title: "File too large (max 20MB)", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const metricsResult = await analyzeLabReportWithGemini(base64, file.name);

      if (metricsResult) {
        setMetrics({ ...metricsResult, updatedAt: new Date().toISOString() });
        toast({ title: "Report analyzed successfully!" });
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      toast({ title: "Failed to analyze report", description: err.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-[hsl(210,100%,97%)] pb-24">
      {/* Hero */}
      <header className="px-4 pt-8 pb-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          {t(lang, "appTitle")}
        </h1>
        <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-md mx-auto">
          {t(lang, "uploadSubtitle")}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleUpload}
        />
        <Button
          size="lg"
          className="h-14 px-8 text-lg font-bold gap-3"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              {t(lang, "uploading")}
            </>
          ) : (
            <>
              <Upload className="h-6 w-6" />
              {t(lang, "uploadTitle")}
            </>
          )}
        </Button>
      </header>

      {/* Health Cards */}
      <main className="px-4 max-w-2xl mx-auto space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          {t(lang, "recentHealth")}
        </h2>

        <HealthCard
          titleKey="bloodSugarBP"
          lang={lang}
          updatedAt={metrics.updatedAt}
          metrics={[
            { labelKey: "fastingGlucose", metricKey: "fastingGlucose", value: metrics.fastingGlucose, unitKey: "mgdl" },
            { labelKey: "postMealGlucose", metricKey: "postMealGlucose", value: metrics.postMealGlucose, unitKey: "mgdl" },
            { labelKey: "systolicBP", metricKey: "systolicBP", value: metrics.systolicBP, unitKey: "mmHg" },
            { labelKey: "diastolicBP", metricKey: "diastolicBP", value: metrics.diastolicBP, unitKey: "mmHg" },
          ]}
        />

        <HealthCard
          titleKey="cholesterolHeart"
          lang={lang}
          updatedAt={metrics.updatedAt}
          metrics={[
            { labelKey: "totalCholesterol", metricKey: "totalCholesterol", value: metrics.totalCholesterol, unitKey: "mgdl" },
            { labelKey: "hdl", metricKey: "hdl", value: metrics.hdl, unitKey: "mgdl" },
            { labelKey: "ldl", metricKey: "ldl", value: metrics.ldl, unitKey: "mgdl" },
            { labelKey: "heartRate", metricKey: "heartRate", value: metrics.heartRate, unitKey: "bpm" },
          ]}
        />

        <HealthCard
          titleKey="cbcHemoglobin"
          lang={lang}
          updatedAt={metrics.updatedAt}
          metrics={[
            { labelKey: "hemoglobin", metricKey: "hemoglobin", value: metrics.hemoglobin, unitKey: "gdl" },
            { labelKey: "wbc", metricKey: "wbc", value: metrics.wbc, unitKey: "cellsul" },
            { labelKey: "rbc", metricKey: "rbc", value: metrics.rbc, unitKey: "millionul" },
            { labelKey: "plateletCount", metricKey: "plateletCount", value: metrics.plateletCount, unitKey: "lakhul" },
          ]}
        />
      </main>

      <StickyBottomBar lang={lang} onLangChange={handleLangChange} />
    </div>
  );
};

export default Index;
