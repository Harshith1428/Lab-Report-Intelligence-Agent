// Types
export type TestStatus = "normal" | "low" | "high";

export interface TestResult {
  id: string;
  name: string;
  value: number;
  unit: string;
  normalRange: { min: number; max: number };
  status: TestStatus;
  explanation: string;
  causes?: string[];
  suggestedIntakes?: string[];
}

export interface PatternInsight {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface LabReport {
  patientName: string;
  date: string;
  overallInsight: string;
  healthScore: number;
  riskLevel: "Low" | "Moderate" | "High";
  tests: TestResult[];
  patterns: PatternInsight[];
}

// Utilities
export function getStatusColor(status: TestStatus) {
  switch (status) {
    case "normal":
      return { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-700", bar: "bg-emerald-500" };
    case "low":
      return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-700", bar: "bg-amber-500" };
    case "high":
      return { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", badge: "bg-rose-100 text-rose-700", bar: "bg-rose-500" };
  }
}

export function getProgressPercent(value: number, min: number, max: number): number {
  const range = max - min;
  const buffer = range * 0.3;
  const effectiveMin = min - buffer;
  const effectiveMax = max + buffer;
  const percent = ((value - effectiveMin) / (effectiveMax - effectiveMin)) * 100;
  return Math.max(2, Math.min(98, percent));
}

export function getRiskColor(risk: string) {
  switch (risk) {
    case "Low":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Moderate":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "High":
      return "bg-rose-100 text-rose-700 border-rose-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

// Demo data
export const demoReport: LabReport = {
  patientName: "Demo Patient",
  date: "2026-02-27",
  overallInsight:
    "Your results are mostly within healthy ranges. A few markers show minor deviations that are worth monitoring. Your hemoglobin is slightly below normal range, and your cholesterol levels could benefit from dietary adjustments. Overall, your health profile looks stable.",
  healthScore: 82,
  riskLevel: "Low",
  tests: [
    {
      id: "hemoglobin",
      name: "Hemoglobin (Hb)",
      value: 11.8,
      unit: "g/dL",
      normalRange: { min: 12.0, max: 15.5 },
      status: "low",
      explanation:
        "Your hemoglobin is slightly below the normal range (12.0–15.5 g/dL for women). This could indicate mild iron-deficiency anemia. Consider increasing iron-rich foods like spinach, lentils, and red meat, paired with vitamin C for better absorption. A follow-up test in 3 months is recommended.",
      causes: [
        "Inadequate dietary iron intake",
        "Vitamin B12 or folate deficiency",
      ],
      suggestedIntakes: [
        "Iron supplements (consult healthcare provider)",
        "Spinach, red meat, and lentils",
        "Vitamin C-rich foods (citrus fruits) to boost iron absorption",
      ],
    },
    {
      id: "wbc",
      name: "White Blood Cells (WBC)",
      value: 7.2,
      unit: "×10³/µL",
      normalRange: { min: 4.5, max: 11.0 },
      status: "normal",
      explanation:
        "Your white blood cell count is well within the normal range, indicating a healthy immune system with no signs of infection or immune disorder.",
    },
    {
      id: "platelets",
      name: "Platelet Count",
      value: 250,
      unit: "×10³/µL",
      normalRange: { min: 150, max: 400 },
      status: "normal",
      explanation:
        "Your platelet count is normal, indicating healthy blood clotting ability. No concerns here.",
    },
    {
      id: "glucose",
      name: "Fasting Blood Glucose",
      value: 95,
      unit: "mg/dL",
      normalRange: { min: 70, max: 100 },
      status: "normal",
      explanation:
        "Your fasting glucose is within the normal range. Continue maintaining a balanced diet and regular exercise for optimal blood sugar management.",
    },
    {
      id: "cholesterol",
      name: "Total Cholesterol",
      value: 215,
      unit: "mg/dL",
      normalRange: { min: 125, max: 200 },
      status: "high",
      explanation:
        "Your total cholesterol is in the borderline high range (200–239 mg/dL). Desirable levels are below 200 mg/dL. Consider reducing saturated fats and trans fats, increasing fiber intake, and adding regular cardiovascular exercise. A follow-up lipid panel in 6 months is advised.",
      causes: [
        "Diet high in saturated and trans fats",
        "Lack of regular cardiovascular exercise",
        "Genetics / family history",
      ],
      suggestedIntakes: [
        "Omega-3 fatty acids (flaxseeds, salmon, walnuts)",
        "Soluble fiber (oats, beans, apples)",
      ],
    },
    {
      id: "hdl",
      name: "HDL Cholesterol",
      value: 55,
      unit: "mg/dL",
      normalRange: { min: 40, max: 80 },
      status: "normal",
      explanation:
        'Your HDL ("good") cholesterol is in a healthy range. Levels above 60 mg/dL are considered protective against heart disease — aim to push it higher through regular aerobic exercise and healthy fats (avocado, olive oil, nuts).',
    },
    {
      id: "ldl",
      name: "LDL Cholesterol",
      value: 138,
      unit: "mg/dL",
      normalRange: { min: 50, max: 100 },
      status: "high",
      explanation:
        'Your LDL ("bad") cholesterol is in the borderline high range (130–159 mg/dL). Optimal LDL is below 100 mg/dL. Reducing processed foods, saturated fats, and adding omega-3 fatty acids (salmon, flaxseeds, walnuts) can help bring this down within a few months.',
      causes: [
        "High consumption of processed and fried foods",
        "Low physical activity",
      ],
      suggestedIntakes: [
        "Plant sterols / stanols (found in fortified foods)",
        "Almonds and other unsalted nuts",
      ],
    },
    {
      id: "tsh",
      name: "Thyroid (TSH)",
      value: 2.8,
      unit: "mIU/L",
      normalRange: { min: 0.4, max: 4.0 },
      status: "normal",
      explanation:
        "Your thyroid-stimulating hormone level is within the normal range, indicating proper thyroid function. No action needed.",
    },
  ],
  patterns: [
    {
      id: "p1",
      title: "Mild Anemia Signal",
      description:
        "Your low hemoglobin combined with normal WBC and platelets suggests a potential iron-deficiency pattern rather than a systemic issue. Consider an iron panel for further clarity.",
      icon: "🔬",
    },
    {
      id: "p2",
      title: "Cardiovascular Attention",
      description:
        "Elevated total cholesterol and LDL alongside normal HDL suggests dietary-driven lipid changes. A balanced diet shift could normalize these values within 3–6 months.",
      icon: "❤️",
    },
    {
      id: "p3",
      title: "Metabolic Stability",
      description:
        "Normal fasting glucose and TSH indicate a stable metabolic profile. Continue your current lifestyle habits to maintain these healthy levels.",
      icon: "✅",
    },
  ],
};
