export type Language = "en" | "hi" | "te";

export const languageNames: Record<Language, string> = {
    en: "English",
    hi: "हिंदी",
    te: "తెలుగు",
};

export const translations = {
    // Nav
    appName: {
        en: "Lab Report AI",
        hi: "लैब रिपोर्ट AI",
        te: "లాబ్ రిపోర్ట్ AI",
    },

    // Landing hero
    heroHeadline1: {
        en: "Understand Your Lab Report",
        hi: "अपनी लैब रिपोर्ट को समझें",
        te: "మీ లాబ్ రిపోర్ట్‌ను అర్థం చేసుకోండి",
    },
    heroHeadline2: {
        en: "Clearly & Confidently",
        hi: "स्पष्ट रूप से और आत्मविश्वास के साथ",
        te: "స్పష్టంగా & నమ్మకంగా",
    },
    heroSubtitle: {
        en: "Upload your lab report PDF and get instant, AI-powered explanations for every test result. No medical jargon — just clear, calming insights you can act on.",
        hi: "अपनी लैब रिपोर्ट PDF अपलोड करें और प्रत्येक परिणाम के लिए तुरंत AI-आधारित स्पष्टीकरण प्राप्त करें। कोई डॉक्टरी भाषा नहीं — बस स्पष्ट और शांत जानकारी।",
        te: "మీ లాబ్ రిపోర్ట్ PDF అప్‌లోడ్ చేసి, ప్రతి పరీక్ష ఫలితానికి తక్షణ AI వివరణలు పొందండి. వైద్య పరిభాష లేదు — స్పష్టమైన, ప్రశాంతమైన సమాచారం.",
    },
    uploadPdf: {
        en: "Upload PDF",
        hi: "PDF अपलोड करें",
        te: "PDF అప్‌లోడ్ చేయండి",
    },
    tryDemo: {
        en: "Try Demo",
        hi: "डेमो आज़माएं",
        te: "డెమో చూడండి",
    },
    analyzing: {
        en: "Analyzing...",
        hi: "विश्लेषण हो रहा है...",
        te: "విశ్లేషిస్తోంది...",
    },

    // Features section
    poweredBy: {
        en: "POWERED BY INTELLIGENCE",
        hi: "AI द्वारा संचालित",
        te: "AI ద్వారా నడపబడుతోంది",
    },
    featuresSectionTitle: {
        en: "What makes Lab Report AI different",
        hi: "लैब रिपोर्ट AI को अलग क्या बनाता है",
        te: "లాబ్ రిపోర్ట్ AI ని వేరుగా చేసేది ఏమిటి",
    },
    feature1Title: {
        en: "AI Explanation",
        hi: "AI स्पष्टीकरण",
        te: "AI వివరణ",
    },
    feature1Desc: {
        en: "Every test result is explained in simple, easy-to-understand language with personalized context about what it means for you.",
        hi: "प्रत्येक परीक्षण परिणाम को सरल और समझने योग्य भाषा में समझाया गया है।",
        te: "ప్రతి పరీక్ష ఫలితాన్ని సరళమైన, అర్థమయ్యే భాషలో వివరించబడుతుంది.",
    },
    feature2Title: {
        en: "Multi-Test Intelligence",
        hi: "बहु-परीक्षण विश्लेषण",
        te: "బహు-పరీక్ష విశ్లేషణ",
    },
    feature2Desc: {
        en: "We analyze patterns across multiple tests to surface insights that looking at one result alone would miss.",
        hi: "हम कई परीक्षणों के बीच पैटर्न का विश्लेषण करते हैं जो एक परिणाम देखने से छूट जाती हैं।",
        te: "బహుళ పరీక్షలలో నమూనాలను విశ్లేషిస్తాము, ఒంటరిగా చూస్తే కనిపించని అంతర్దృష్టులను కనుగొంటాము.",
    },
    feature3Title: {
        en: "Calm Insights",
        hi: "शांत जानकारी",
        te: "శాంతమైన అంతర్దృష్టులు",
    },
    feature3Desc: {
        en: "Health data can be stressful. We present findings with reassuring context so you understand without unnecessary worry.",
        hi: "स्वास्थ्य डेटा तनावपूर्ण हो सकता है। हम निष्कर्षों को इस तरह प्रस्तुत करते हैं जिससे अनावश्यक चिंता न हो।",
        te: "ఆరోగ్య డేటా ఒత్తిడిగా ఉండవచ్చు. అనవసరమైన ఆందోళన లేకుండా అర్థమయ్యేలా ఫలితాలు తెలియజేస్తాము.",
    },
    landingFooter: {
        en: "Lab Report Intelligence Agent is for educational purposes only and does not provide medical advice. Always consult a healthcare professional for medical decisions.",
        hi: "लैब रिपोर्ट इंटेलिजेंस एजेंट केवल शैक्षणिक उद्देश्यों के लिए है। चिकित्सा निर्णयों के लिए हमेशा किसी डॉक्टर से परामर्श लें।",
        te: "లాబ్ రిపోర్ట్ ఇంటెలిజెన్స్ ఏజెంట్ విద్యా ప్రయోజనాల కోసం మాత్రమే. వైద్య నిర్ణయాల కోసం ఎల్లప్పుడూ వైద్యుడిని సంప్రదించండి.",
    },

    // Dashboard
    backToHome: {
        en: "Back to Home",
        hi: "होम पर वापस जाएं",
        te: "హోమ్‌కు తిరిగి వెళ్ళండి",
    },
    yourLabResults: {
        en: "Your Lab Results",
        hi: "आपके लैब परिणाम",
        te: "మీ లాబ్ ఫలితాలు",
    },
    reportDate: {
        en: "Report Date",
        hi: "रिपोर्ट दिनांक",
        te: "రిపోర్ట్ తేదీ",
    },
    overallInsight: {
        en: "Overall Insight",
        hi: "समग्र जानकारी",
        te: "మొత్తం అంతర్దృష్టి",
    },
    healthStability: {
        en: "Health Stability",
        hi: "स्वास्थ्य स्थिरता",
        te: "ఆరోగ్య స్థిరత",
    },
    score: {
        en: "Score",
        hi: "स्कोर",
        te: "స్కోర్",
    },
    riskLevel: {
        en: "Risk Level",
        hi: "जोखिम स्तर",
        te: "జోఖిమ స్థాయి",
    },
    testResults: {
        en: "Test Results",
        hi: "परीक्षण परिणाम",
        te: "పరీక్ష ఫలితాలు",
    },
    normalRange: {
        en: "Normal range",
        hi: "सामान्य सीमा",
        te: "సాధారణ పరిధి",
    },
    showExplanation: {
        en: "Show explanation",
        hi: "स्पष्टीकरण दिखाएं",
        te: "వివరణ చూపించు",
    },
    hideExplanation: {
        en: "Hide explanation",
        hi: "स्पष्टीकरण छुपाएं",
        te: "వివరణ దాచు",
    },
    patternInsights: {
        en: "Pattern Insights",
        hi: "पैटर्न अंतर्दृष्टि",
        te: "నమూనా అంతర్దృష్టులు",
    },
    possibleCauses: {
        en: "Possible Causes",
        hi: "संभावित कारण",
        te: "సాధ్యమైన కారణాలు",
    },
    suggestedIntakes: {
        en: "Suggested Dietary Intakes",
        hi: "सुझाए गए आहार/पूरक",
        te: "సూచించిన ఆహారం/సప్లిమెంట్లు",
    },
    crossTestAnalysis: {
        en: "Cross-test analysis revealing meaningful patterns in your results",
        hi: "आपके परिणामों में सार्थक पैटर्न प्रकट करने वाला क्रॉस-परीक्षण विश्लेषण",
        te: "మీ ఫలితాలలో అర్థవంతమైన నమూనాలను వెల్లడించే క్రాస్-పరీక్ష విశ్లేషణ",
    },
    askAboutReport: {
        en: "Ask About My Report",
        hi: "मेरी रिपोर्ट के बारे में पूछें",
        te: "నా రిపోర్ట్ గురించి అడగండి",
    },
    askSubtitle: {
        en: "Have a question about your results? Ask our AI assistant for clarity.",
        hi: "अपने परिणामों के बारे में कोई प्रश्न है? हमारे AI सहायक से पूछें।",
        te: "మీ ఫలితాల గురించి ప్రశ్న ఉందా? మా AI సహాయకుడిని అడగండి.",
    },
    askPlaceholder: {
        en: "e.g. Why is my hemoglobin low?",
        hi: "उदाहरण: मेरा हीमोग्लोबिन कम क्यों है?",
        te: "ఉదా: నా హిమోగ్లోబిన్ తక్కువగా ఎందుకు ఉంది?",
    },
    medicalDisclaimer: {
        en: "Medical Disclaimer",
        hi: "चिकित्सा अस्वीकरण",
        te: "వైద్య నిరాకరణ",
    },
    disclaimerText: {
        en: "This report analysis is generated by AI for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.",
        hi: "यह रिपोर्ट विश्लेषण केवल शैक्षणिक और सूचनात्मक उद्देश्यों के लिए AI द्वारा तैयार किया गया है। यह पेशेवर चिकित्सा सलाह का विकल्प नहीं है।",
        te: "ఈ రిపోర్ట్ విశ్లేషణ విద్యా మరియు సమాచార ప్రయోజనాల కోసం AI చే రూపొందించబడింది. ఇది వృత్తిపరమైన వైద్య సలహాకు ప్రత్యామ్నాయం కాదు.",
    },
    dashboardFooter: {
        en: "Lab Report Intelligence Agent",
        hi: "लैब रिपोर्ट इंटेलिजेंस एजेंट",
        te: "లాబ్ రిపోర్ట్ ఇంటెలిజెన్స్ ఏజెంట్",
    },
    educationalOnly: {
        en: "For educational purposes only",
        hi: "केवल शैक्षणिक उद्देश्यों के लिए",
        te: "విద్యా ప్రయోజనాల కోసం మాత్రమే",
    },

    // Translate banner
    translatePrompt: {
        en: "Translate this page?",
        hi: "इस पृष्ठ का अनुवाद करें?",
        te: "ఈ పేజీని అనువదించాలా?",
    },

    // Status badges
    normal: { en: "Normal", hi: "सामान्य", te: "సాధారణ" },
    low: { en: "Low", hi: "कम", te: "తక్కువ" },
    high: { en: "High", hi: "अधिक", te: "అధికం" },
    low_risk: { en: "Low", hi: "निम्न", te: "తక్కువ" },
    moderate_risk: { en: "Moderate", hi: "मध्यम", te: "మధ్యస్థం" },
    high_risk: { en: "High", hi: "उच्च", te: "అధికం" },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(lang: Language, key: TranslationKey): string {
    return translations[key][lang] ?? translations[key]["en"];
}
