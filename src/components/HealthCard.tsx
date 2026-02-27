import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStatus, type HealthStatus } from "@/lib/healthConfig";
import { t, type Language, type TranslationKey } from "@/lib/i18n";

interface MetricRow {
  labelKey: TranslationKey;
  metricKey: string;
  value?: number;
  unitKey: TranslationKey;
}

interface HealthCardProps {
  titleKey: TranslationKey;
  metrics: MetricRow[];
  lang: Language;
  updatedAt?: string;
}

const statusColors: Record<HealthStatus, string> = {
  normal: "bg-green-500",
  warning: "bg-yellow-500",
  critical: "bg-red-500",
};

export function HealthCard({ titleKey, metrics, lang, updatedAt }: HealthCardProps) {
  return (
    <Card className="border-2 border-border shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl md:text-2xl font-bold">{t(lang, titleKey)}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((m) => {
          const status = m.value != null ? getStatus(m.metricKey, m.value) : null;
          return (
            <div key={m.metricKey} className="flex items-center justify-between gap-2">
              <span className="text-base md:text-lg font-medium text-foreground">
                {t(lang, m.labelKey)}
              </span>
              <div className="flex items-center gap-2">
                {m.value != null ? (
                  <>
                    <span className="text-2xl md:text-3xl font-bold text-foreground tabular-nums">
                      {m.value}
                    </span>
                    <span className="text-sm text-muted-foreground">{t(lang, m.unitKey)}</span>
                    <span
                      className={`inline-block h-4 w-4 rounded-full ${statusColors[status!]} shrink-0`}
                      title={t(lang, status!)}
                      aria-label={t(lang, status!)}
                    />
                  </>
                ) : (
                  <span className="text-lg text-muted-foreground">{t(lang, "noData")}</span>
                )}
              </div>
            </div>
          );
        })}
        {updatedAt && (
          <p className="text-sm text-muted-foreground pt-2 border-t border-border">
            {t(lang, "lastUpdated")}: {new Date(updatedAt).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
