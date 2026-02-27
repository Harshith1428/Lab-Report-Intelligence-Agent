export type Language = "en" | "hi" | "te";

const translations = {
  en: {
    appTitle: "Health Dashboard",
    uploadTitle: "Upload Lab Report",
    uploadSubtitle: "Upload your PDF lab report and we'll extract your health data",
    recentHealth: "Recent Health Status",
    lastUpdated: "Last updated",
    noData: "No data yet",
    uploading: "Analyzing report...",
    // Card titles
    bloodSugarBP: "Blood Sugar & BP",
    cholesterolHeart: "Cholesterol & Heart",
    cbcHemoglobin: "CBC & Hemoglobin",
    // Metrics
    fastingGlucose: "Fasting Glucose",
    postMealGlucose: "Post-Meal Glucose",
    systolicBP: "Systolic BP",
    diastolicBP: "Diastolic BP",
    totalCholesterol: "Total Cholesterol",
    hdl: "HDL",
    ldl: "LDL",
    heartRate: "Heart Rate",
    hemoglobin: "Hemoglobin",
    wbc: "WBC",
    rbc: "RBC",
    plateletCount: "Platelet Count",
    // Status
    normal: "Normal",
    warning: "Warning",
    critical: "Critical",
    // Units
    mgdl: "mg/dL",
    mmHg: "mmHg",
    bpm: "bpm",
    gdl: "g/dL",
    cellsul: "cells/µL",
    millionul: "M/µL",
    lakhul: "L/µL",
    voice: "Voice",
  },
  hi: {
    appTitle: "स्वास्थ्य डैशबोर्ड",
    uploadTitle: "लैब रिपोर्ट अपलोड करें",
    uploadSubtitle: "अपनी PDF लैब रिपोर्ट अपलोड करें और हम आपके स्वास्थ्य डेटा को निकालेंगे",
    recentHealth: "हालिया स्वास्थ्य स्थिति",
    lastUpdated: "अंतिम अपडेट",
    noData: "अभी कोई डेटा नहीं",
    uploading: "रिपोर्ट का विश्लेषण...",
    bloodSugarBP: "रक्त शर्करा और बीपी",
    cholesterolHeart: "कोलेस्ट्रॉल और हृदय",
    cbcHemoglobin: "सीबीसी और हीमोग्लोबिन",
    fastingGlucose: "उपवास ग्लूकोज",
    postMealGlucose: "भोजन के बाद ग्लूकोज",
    systolicBP: "सिस्टोलिक बीपी",
    diastolicBP: "डायस्टोलिक बीपी",
    totalCholesterol: "कुल कोलेस्ट्रॉल",
    hdl: "एचडीएल",
    ldl: "एलडीएल",
    heartRate: "हृदय गति",
    hemoglobin: "हीमोग्लोबिन",
    wbc: "डब्ल्यूबीसी",
    rbc: "आरबीसी",
    plateletCount: "प्लेटलेट गिनती",
    normal: "सामान्य",
    warning: "चेतावनी",
    critical: "गंभीर",
    mgdl: "मि.ग्रा./डी.ली.",
    mmHg: "मि.मी.एचजी",
    bpm: "बीपीएम",
    gdl: "ग्रा./डी.ली.",
    cellsul: "कोशिकाएं/µL",
    millionul: "M/µL",
    lakhul: "L/µL",
    voice: "आवाज़",
  },
  te: {
    appTitle: "ఆరోగ్య డ్యాష్‌బోర్డ్",
    uploadTitle: "ల్యాబ్ రిపోర్ట్ అప్‌లోడ్ చేయండి",
    uploadSubtitle: "మీ PDF ల్యాబ్ రిపోర్ట్‌ను అప్‌లోడ్ చేయండి, మేము మీ ఆరోగ్య డేటాను తీస్తాము",
    recentHealth: "ఇటీవల ఆరోగ్య స్థితి",
    lastUpdated: "చివరిగా నవీకరించబడింది",
    noData: "ఇంకా డేటా లేదు",
    uploading: "రిపోర్ట్ విశ్లేషిస్తోంది...",
    bloodSugarBP: "రక్తంలో చక్కెర & బీపీ",
    cholesterolHeart: "కొలెస్ట్రాల్ & గుండె",
    cbcHemoglobin: "సీబీసీ & హీమోగ్లోబిన్",
    fastingGlucose: "ఉపవాస గ్లూకోజ్",
    postMealGlucose: "భోజనం తర్వాత గ్లూకోజ్",
    systolicBP: "సిస్టోలిక్ బీపీ",
    diastolicBP: "డయాస్టోలిక్ బీపీ",
    totalCholesterol: "మొత్తం కొలెస్ట్రాల్",
    hdl: "హెచ్‌డిఎల్",
    ldl: "ఎల్‌డిఎల్",
    heartRate: "గుండె వేగం",
    hemoglobin: "హీమోగ్లోబిన్",
    wbc: "డబ్ల్యూబీసీ",
    rbc: "ఆర్‌బీసీ",
    plateletCount: "ప్లేట్‌లెట్ కౌంట్",
    normal: "సాధారణం",
    warning: "హెచ్చరిక",
    critical: "క్రిటికల్",
    mgdl: "mg/dL",
    mmHg: "mmHg",
    bpm: "bpm",
    gdl: "g/dL",
    cellsul: "cells/µL",
    millionul: "M/µL",
    lakhul: "L/µL",
    voice: "వాయిస్",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function t(lang: Language, key: TranslationKey): string {
  return translations[lang][key] || translations.en[key];
}

export function getStoredLanguage(): Language {
  const stored = localStorage.getItem("health-dashboard-lang");
  if (stored === "en" || stored === "hi" || stored === "te") return stored;
  return "en";
}

export function setStoredLanguage(lang: Language) {
  localStorage.setItem("health-dashboard-lang", lang);
}
