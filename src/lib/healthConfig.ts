export type HealthStatus = "normal" | "warning" | "critical";

interface Range {
  normal: [number, number];
  warning: [number, number]; // outside normal but inside critical
}

export const medicalRanges: Record<string, Range> = {
  fastingGlucose: { normal: [70, 100], warning: [100, 126] },
  postMealGlucose: { normal: [70, 140], warning: [140, 200] },
  systolicBP: { normal: [90, 120], warning: [120, 140] },
  diastolicBP: { normal: [60, 80], warning: [80, 90] },
  totalCholesterol: { normal: [0, 200], warning: [200, 240] },
  hdl: { normal: [40, 200], warning: [35, 40] },
  ldl: { normal: [0, 100], warning: [100, 160] },
  heartRate: { normal: [60, 100], warning: [50, 60] },
  hemoglobin: { normal: [12, 17], warning: [10, 12] },
  wbc: { normal: [4000, 11000], warning: [3000, 4000] },
  rbc: { normal: [4.2, 6.1], warning: [3.5, 4.2] },
  plateletCount: { normal: [150000, 400000], warning: [100000, 150000] },
};

export function getStatus(metricKey: string, value: number): HealthStatus {
  const range = medicalRanges[metricKey];
  if (!range) return "normal";
  const [nLow, nHigh] = range.normal;
  if (value >= nLow && value <= nHigh) return "normal";
  const [wLow, wHigh] = range.warning;
  if (value >= wLow && value <= wHigh) return "warning";
  return "critical";
}

export interface HealthMetrics {
  fastingGlucose?: number;
  postMealGlucose?: number;
  systolicBP?: number;
  diastolicBP?: number;
  totalCholesterol?: number;
  hdl?: number;
  ldl?: number;
  heartRate?: number;
  hemoglobin?: number;
  wbc?: number;
  rbc?: number;
  plateletCount?: number;
  updatedAt?: string;
}
