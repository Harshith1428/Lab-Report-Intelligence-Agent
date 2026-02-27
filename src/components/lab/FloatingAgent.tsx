import { useState, useRef, useEffect } from "react";
import {
    MessageCircle, X, Send, Bot, User, Sparkles, Mic, MicOff, Globe,
    CalendarPlus, Hospital, CheckCircle, Clock, MapPin, Phone
} from "lucide-react";
import { type Language, languageNames } from "@/lib/translations";
import { useLang } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";

interface Message {
    id: string;
    role: "agent" | "user";
    text: string;
    timestamp: Date;
    card?: "booking" | "lab_booking" | "hospitals" | "confirmation" | "lab_confirmation";
    cardData?: AppointmentData | LabTestData | Hospital[];
}

interface GeminiMessage {
    role: "user" | "model";
    parts: { text: string }[];
}

interface AppointmentData {
    doctor: string;
    specialty: string;
    date: string;
    time: string;
    confirmed?: boolean;
}

interface LabTestData {
    patientName: string;
    scanType: string;
    date: string;
    time: string;
    confirmed?: boolean;
}

interface Hospital {
    name: string;
    specialty: string;
    distance: string;
    phone: string;
    address: string;
    rating: string;
}

// BCP-47 language codes for SpeechRecognition
const speechLangCodes: Record<Language, string> = {
    en: "en-US",
    hi: "hi-IN",
    te: "te-IN",
};

const SUGGESTED: Record<Language, string[]> = {
    en: ["Book a doctor appointment", "Book a lab test (MRI/X-Ray)", "Find nearby hospitals"],
    hi: ["डॉक्टर अपॉइंटमेंट बुक करें", "लैब टेस्ट (MRI/X-Ray) बुक करें", "पास के अस्पताल खोजें"],
    te: ["డాక్టర్ అపాయింట్‌మెంట్ బుక్ చేయండి", "ల్యాబ్ టెస్ట్ (MRI/X-Ray) బుక్ చేయండి", "దగ్గర్లో ఆసుపత్రులు కనుగొనండి"],
};

const WELCOME: Record<Language, string> = {
    en: "Hi! 👋 I'm **Lena**, your personal health assistant. I can help you **book doctor appointments**, **book lab tests (like MRI or X-Ray)**, find **nearby hospitals**, or answer questions about your health reports!",
    hi: "नमस्ते! 👋 मैं **Lena** हूँ, आपकी व्यक्तिगत स्वास्थ्य सहायक। मैं **डॉक्टर अपॉइंटमेंट बुक** करने, **लैब टेस्ट (जैसे MRI या X-Ray) बुक** करने, **पास के अस्पताल** खोजने या आपकी स्वास्थ्य रिपोर्ट के बारे में सवालों का जवाब देने में मदद कर सकती हूँ!",
    te: "హాయ్! 👋 నేను **Lena**, మీ వ్యక్తిగత ఆరోగ్య సహాయకురాలిని. నేను **డాక్టర్ అపాయింట్‌మెంట్ బుక్** చేయడంలో, **ల్యాబ్ టెస్ట్‌లను (MRI లేదా X-Ray వంటివి) బుక్** చేయడంలో, **దగ్గర్లో ఆసుపత్రులు** కనుగొనడంలో లేదా మీ ఆరోగ్య నివేదికల గురించి ప్రశ్నలకు సమాధానం ఇవ్వగలను!",
};

const PLACEHOLDER: Record<Language, string> = {
    en: "Ask Lena anything...",
    hi: "Lena से कुछ भी पूछें...",
    te: "Lena ని ఏదైనా అడగండి...",
};

// --- Nearby Hospitals Data ---
const NEARBY_HOSPITALS: Hospital[] = [
    {
        name: "Apollo Hospitals",
        specialty: "Multi-Specialty",
        distance: "1.2 km",
        phone: "+91-040-2360-7777",
        address: "Jubilee Hills, Hyderabad",
        rating: "⭐ 4.8",
    },
    {
        name: "KIMS Hospitals",
        specialty: "Cardiology & Ortho",
        distance: "2.5 km",
        phone: "+91-040-4488-5000",
        address: "Secunderabad, Hyderabad",
        rating: "⭐ 4.7",
    },
    {
        name: "Yashoda Hospitals",
        specialty: "Neurology & General",
        distance: "3.1 km",
        phone: "+91-040-4567-4567",
        address: "Somajiguda, Hyderabad",
        rating: "⭐ 4.6",
    },
    {
        name: "Care Hospitals",
        specialty: "Oncology & Nephrology",
        distance: "4.0 km",
        phone: "+91-040-6165-6165",
        address: "Banjara Hills, Hyderabad",
        rating: "⭐ 4.5",
    },
];

// --- Doctor Slots ---
const DOCTORS = [
    { name: "Dr. Priya Sharma", specialty: "General Physician" },
    { name: "Dr. Rahul Mehta", specialty: "Cardiologist" },
    { name: "Dr. Anita Reddy", specialty: "Hematologist" },
    { name: "Dr. Suresh Kumar", specialty: "Endocrinologist" },
];

const SCAN_TYPES = [
    { name: "MRI Scan", desc: "Magnetic Resonance Imaging" },
    { name: "CT Scan", desc: "Computed Tomography" },
    { name: "X-Ray", desc: "Radiography" },
    { name: "Ultrasound", desc: "Sonography" },
    { name: "Blood Test", desc: "Complete Blood Count, Lipid Profile, etc." }
];

const TIME_SLOTS = ["09:00 AM", "10:30 AM", "12:00 PM", "02:30 PM", "04:00 PM", "05:30 PM"];

function getTomorrowDates(): string[] {
    const dates: string[] = [];
    for (let i = 1; i <= 5; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        dates.push(d.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" }));
    }
    return dates;
}

const SYSTEM_PROMPT = `You are Lena, a warm, friendly, and highly knowledgeable personal health assistant for the "Health Hub Helper" app.

User's demo lab report:
- Hemoglobin: 11.8 g/dL (Low — normal 12.0–17.5)
- WBC: 7.2 ×10³/µL (Normal)
- Platelet Count: 250 ×10³/µL (Normal)
- Fasting Glucose: 95 mg/dL (Normal)
- Total Cholesterol: 215 mg/dL (High — normal <200)
- HDL: 55 mg/dL (Normal), LDL: 138 mg/dL (High)
- TSH: 2.8 mIU/L (Normal)
- Health Score: 82/100, Risk Level: Low

Your capabilities:
1. Answer health questions about lab reports
2. Help users book doctor appointments (use the booking UI)
3. Help users book lab tests like MRI, X-Ray, CT Scans, Ultrasound, Blood tests (use the lab booking UI)
4. Suggest nearby hospitals (use the hospital cards)

Guidelines:
- Your name is Lena. Always introduce yourself as Lena.
- Be warm, calm, and conversational.
- ALWAYS reply in the SAME LANGUAGE as the user's message. If they write in Hindi, reply in Hindi. If Telugu, reply in Telugu. If English, reply in English.
- Keep responses concise and friendly, with occasional emojis.
- When user asks to book appointment or see doctor, respond with: SHOW_BOOKING_CARD
- When user asks to book a lab test, MRI, X-Ray, CT scan, ultrasound, or blood test, respond with: SHOW_LAB_BOOKING_CARD
- When user asks for nearby hospitals or clinics, respond with: SHOW_HOSPITAL_CARD`;

function getLocalResponse(input: string, lang: Language): string {
    const q = input.toLowerCase();

    if (/lab|test|mri|x-ray|xray|scan|ct|ultrasound|blood test|lab testing/.test(q)) {
        return "SHOW_LAB_BOOKING_CARD";
    }
    if (/book|appointment|doctor|schedule|consult|अपॉइंट|डॉक्टर|అపాయింట్/.test(q)) {
        return "SHOW_BOOKING_CARD";
    }
    if (/hospital|clinic|nearby|near|पास|अस्पताल|ఆసుపత్రి|దగ్గర/.test(q)) {
        return "SHOW_HOSPITAL_CARD";
    }

    const responses: Record<string, Record<Language, string>> = {
        greet: {
            en: "Hi there! 👋 I'm Lena, your health assistant. How can I help you today?",
            hi: "नमस्ते! 👋 मैं Lena हूँ। आज मैं आपकी कैसे मदद कर सकती हूँ?",
            te: "హాయ్! 👋 నేను Lena. నేను మీకు ఎలా సహాయం చేయగలను?",
        },
        hemoglobin: {
            en: "Your hemoglobin is 11.8 g/dL, which is slightly below normal (12.0–17.5 g/dL) 🔴. This may suggest anemia or iron deficiency. \n\n🥦 **Recommended Foods:** Eat more spinach, beetroot, lentils, red meat, and citrus fruits (Vitamin C) to boost iron absorption. \n\n⚠️ **Action:** Since it is below normal, I strongly recommend consulting a doctor. SHOW_HOSPITAL_CARD",
            hi: "आपका हीमोग्लोबिन 11.8 g/dL है, जो सामान्य से कम है 🔴। \n\n🥦 **सुझाए गए खाद्य पदार्थ:** पालक, चुकंदर, दाल और विटामिन सी युक्त फल खाएं। \n\n⚠️ **कार्रवाई:** चूँकि यह सामान्य से नीचे है, मैं डॉक्टर से परामर्श करने की सलाह देती हूँ। SHOW_HOSPITAL_CARD",
            te: "మీ హిమోగ్లోబిన్ 11.8 g/dL, సాధారణ పరిధి కంటే తక్కువగా ఉంది 🔴. \n\n🥦 **సూచించబడిన ఆహారం:** పాలకూర, బీట్‌రూట్, పప్పులు మరియు సిట్రస్ పండ్లు తినండి. \n\n⚠️ **చర్య:** ఇది సాధారణం కంటే తక్కువగా ఉన్నందున, డాక్టర్‌ను సంప్రదించాలి. SHOW_HOSPITAL_CARD",
        },
        sugar: {
            en: "Your fasting glucose is 95 mg/dL, which is normal 🟢. However, if your sugar levels ever drop too low (hypoglycemia) 🔴, you should consume fast-acting carbs like fruit juice or honey. \n\n🥦 **Recommended Foods (for steady levels):** Whole grains, nuts, seeds, and leafy greens. \n\n⚠️ **Action:** If you feel dizzy or your lab shows very low/high sugar, please consult a doctor immediately. SHOW_HOSPITAL_CARD",
            hi: "आपका फास्टिंग ग्लूकोज 95 mg/dL है, जो सामान्य है 🟢। लेकिन अगर शुगर कम हो जाए, तो तुरंत फलों का रस या शहद लें। \n\n🥦 **सुझाए गए खाद्य पदार्थ:** साबुत अनाज, मेवे और हरी सब्जियां। \n\n⚠️ **कार्रवाई:** यदि आपको चक्कर आता है या शुगर बहुत कम/ज्यादा है, तो तुरंत डॉक्टर से सलाह लें। SHOW_HOSPITAL_CARD",
            te: "మీ ఫాస్టింగ్ గ్లూకోజ్ 95 mg/dL, ఇది సాధారణం 🟢. దయచేసి పంచదార స్థాయి తగ్గినట్లయితే వెంటనే పండ్ల రసం లేదా తేనె తీసుకోండి. \n\n🥦 **సూచించబడిన ఆహారం:** తృణధాన్యాలు, గింజలు మరియు ఆకుకూరలు. \n\n⚠️ **చర్య:** మీకు కళ్లు తిరిగినట్లు అనిపిస్తే, వెంటనే డాక్టర్‌ను సంప్రదించండి. SHOW_HOSPITAL_CARD",
        },
        cholesterol: {
            en: "Your total cholesterol is 215 mg/dL (slightly high) 🟡. \n\n🥦 **Recommended Foods:** Reduce saturated fats and eat more Omega-3 rich foods (salmon, chia seeds), oats, beans, and foods rich in Vitamin B3 (Niacin). \n\n⚠️ **Action:** Since it is elevated, I recommend consulting a doctor to discuss lifestyle changes. SHOW_HOSPITAL_CARD",
            hi: "आपका कोलेस्ट्रॉल 215 mg/dL (थोड़ा अधिक) है 🟡। \n\n🥦 **सुझाए गए खाद्य पदार्थ:** संतृप्त वसा कम करें और ओमेगा-3 (चिया बीज), ओट्स और विटामिन बी3 युक्त भोजन खाएं। \n\n⚠️ **कार्रवाई:** चूँकि यह बढ़ा हुआ है, आहार में बदलाव के लिए डॉक्टर से बात करें। SHOW_HOSPITAL_CARD",
            te: "మీ కొలెస్ట్రాల్ 215 mg/dL (కొంచెం అధికం) 🟡. \n\n🥦 **సూచించబడిన ఆహారం:** ఒమేగా-3 (చియా విత్తనాలు), ఓట్స్ మరియు విటమిన్ బి3 ఉన్న ఆహారం తీసుకోండి. \n\n⚠️ **చర్య:** ఇది కొంచెం ఎక్కువగా ఉన్నందున, డాక్టర్‌ను సంప్రదించండి. SHOW_HOSPITAL_CARD",
        },
        eat: {
            en: "Based on your general profile 🥗:\n• Leafy greens & lentils for Iron\n• Citrus fruits for Vitamin C\n• Nuts, seeds, & fatty fish for Omega-3s\n• Whole grains for stable sugar\n\nIf any levels are abnormal, always consult a doctor!",
            hi: "आपके प्रोफ़ाइल के आधार पर 🥗:\n• आयरन के लिए हरी सब्जियां और दाल\n• विटामिन सी के लिए खट्टे फल\n• ओमेगा-3 के लिए मेवे और मछली\n\nयदि कोई भी स्तर सामान्य नहीं है, तो डॉक्टर से मिलें!",
            te: "మీ ప్రొఫైల్ ఆధారంగా 🥗:\n• ఇనుము కోసం ఆకుకూరలు మరియు పప్పులు\n• విటమిన్ సి కోసం సిట్రస్ పండ్లు\n• ఒమేగా-3 కోసం గింజలు మరియు చేపలు\n\nఏదైనా స్థాయి అసాధారణంగా ఉంటే, డాక్టర్‌ను కలవండి!",
        },
        default: {
            en: "Great question! 😊 I'm Lena and I'm here to help with your health queries, book appointments, or find nearby hospitals. What would you like?",
            hi: "अच्छा सवाल! 😊 मैं Lena हूँ। मैं स्वास्थ्य प्रश्नों, अपॉइंटमेंट बुकिंग या अस्पताल खोजने में मदद कर सकती हूँ।",
            te: "మంచి ప్రశ్న! 😊 నేను Lena. ఆరోగ్య సందేహాలు, అపాయింట్‌మెంట్ బుకింగ్ లేదా ఆసుపత్రి కోసం మీకు సహాయం చేయగలను.",
        },
    };

    if (/hi|hello|hey|నమస్తే|హాయ్|नमस्ते/.test(q)) return responses.greet[lang];
    if (/hemoglobin|hb|anemia|iron|blood|హిమోగ్లో|हीमोग्लो|రక్తం|रक्त/.test(q)) return responses.hemoglobin[lang];
    if (/cholesterol|ldl|hdl|కొలె|कोलेस्ट/.test(q)) return responses.cholesterol[lang];
    if (/sugar|glucose|diabetes|sweet|షుగర్|గూకోజ్|शुगर|ग्लूकोज/.test(q)) return responses.sugar[lang];
    if (/eat|food|diet|vitamin|nutrition|తినా|खाना|విటమిన్|विटामिन/.test(q)) return responses.eat[lang];
    return responses.default[lang];
}

const MODELS = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-2.5-flash"];

async function callGemini(history: GeminiMessage[], userText: string): Promise<string | null> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const contents: GeminiMessage[] = [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Hi! I'm Lena, ready to help!" }] },
        ...history,
        { role: "user", parts: [{ text: userText }] },
    ];

    for (const model of MODELS) {
        try {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents }) }
            );
            if (res.status === 429) continue;
            if (!res.ok) continue;
            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) return text;
        } catch { continue; }
    }
    return null;
}

// --- Booking Card Component ---
function BookingCard({ onConfirm }: { onConfirm: (data: AppointmentData) => void }) {
    const [step, setStep] = useState(0);
    const [selected, setSelected] = useState<AppointmentData>({ doctor: "", specialty: "", date: "", time: "" });
    const dates = getTomorrowDates();

    return (
        <div className="bg-white border border-blue-100 rounded-2xl shadow-sm overflow-hidden text-sm w-full">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CalendarPlus className="h-4 w-4 text-white" />
                    <span className="text-white font-semibold text-xs">Book Doctor Appointment</span>
                </div>
                {step > 0 && (
                    <button onClick={() => setStep(s => s - 1)} className="text-[10px] font-medium bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-md transition-colors flex items-center gap-1">
                        ← Back
                    </button>
                )}
            </div>

            {step === 0 && (
                <div className="p-3">
                    <p className="text-xs text-slate-500 mb-2 font-medium">Select a Doctor</p>
                    <div className="space-y-1.5">
                        {DOCTORS.map((d) => (
                            <button
                                key={d.name}
                                onClick={() => { setSelected(s => ({ ...s, doctor: d.name, specialty: d.specialty })); setStep(1); }}
                                className="w-full text-left px-3 py-2 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
                            >
                                <p className="font-semibold text-slate-700 text-xs group-hover:text-blue-600">{d.name}</p>
                                <p className="text-xs text-slate-400">{d.specialty}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 1 && (
                <div className="p-3">
                    <p className="text-xs text-slate-500 mb-2 font-medium">Pick a Date</p>
                    <div className="grid grid-cols-3 gap-1.5">
                        {dates.map((d) => (
                            <button
                                key={d}
                                onClick={() => { setSelected(s => ({ ...s, date: d })); setStep(2); }}
                                className="text-center px-2 py-2 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-xs font-medium text-slate-600 hover:text-blue-600 transition-all"
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="p-3">
                    <p className="text-xs text-slate-500 mb-2 font-medium">Pick a Time Slot</p>
                    <div className="grid grid-cols-3 gap-1.5">
                        {TIME_SLOTS.map((t) => (
                            <button
                                key={t}
                                onClick={() => { const data = { ...selected, time: t }; setSelected(data); onConfirm(data); }}
                                className="flex items-center justify-center gap-1 px-2 py-2 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-xs font-medium text-slate-600 hover:text-blue-600 transition-all"
                            >
                                <Clock className="h-3 w-3" />
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}

// --- Lab Test Booking Component ---
function LabTestBookingCard({ onConfirm }: { onConfirm: (data: LabTestData) => void }) {
    const [step, setStep] = useState(0);
    const [selected, setSelected] = useState<LabTestData>({ patientName: "", scanType: "", date: "", time: "" });
    const dates = getTomorrowDates();

    return (
        <div className="bg-white border border-blue-100 rounded-2xl shadow-sm overflow-hidden text-sm w-full">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CalendarPlus className="h-4 w-4 text-white" />
                    <span className="text-white font-semibold text-xs">Book Lab Test</span>
                </div>
                {step > 0 && (
                    <button onClick={() => setStep(s => s - 1)} className="text-[10px] font-medium bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-md transition-colors flex items-center gap-1">
                        ← Back
                    </button>
                )}
            </div>

            {step === 0 && (
                <div className="p-3">
                    <p className="text-xs text-slate-500 mb-2 font-medium">Patient Name</p>
                    <input
                        type="text"
                        placeholder="Enter patient's name"
                        value={selected.patientName}
                        onChange={(e) => setSelected(s => ({ ...s, patientName: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-xs mb-3"
                    />
                    <button
                        disabled={!selected.patientName.trim()}
                        onClick={() => setStep(1)}
                        className="w-full py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white rounded-xl text-xs font-semibold transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}

            {step === 1 && (
                <div className="p-3">
                    <p className="text-xs text-slate-500 mb-2 font-medium">Select Scan Type</p>
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                        {SCAN_TYPES.map((s) => (
                            <button
                                key={s.name}
                                onClick={() => { setSelected(prev => ({ ...prev, scanType: s.name })); setStep(2); }}
                                className="w-full text-left px-3 py-2 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
                            >
                                <p className="font-semibold text-slate-700 text-xs group-hover:text-blue-600">{s.name}</p>
                                <p className="text-[10px] text-slate-400">{s.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="p-3">
                    <p className="text-xs text-slate-500 mb-2 font-medium">Pick a Date</p>
                    <div className="grid grid-cols-3 gap-1.5">
                        {dates.map((d) => (
                            <button
                                key={d}
                                onClick={() => { setSelected(s => ({ ...s, date: d })); setStep(3); }}
                                className="text-center px-2 py-2 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-xs font-medium text-slate-600 hover:text-blue-600 transition-all"
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="p-3">
                    <p className="text-xs text-slate-500 mb-2 font-medium">Pick a Time Slot</p>
                    <div className="grid grid-cols-3 gap-1.5">
                        {TIME_SLOTS.map((t) => (
                            <button
                                key={t}
                                onClick={() => { const data = { ...selected, time: t }; setSelected(data); onConfirm(data); }}
                                className="flex items-center justify-center gap-1 px-2 py-2 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-xs font-medium text-slate-600 hover:text-blue-600 transition-all"
                            >
                                <Clock className="h-3 w-3" />
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}

// --- Lab Test Confirmation Card ---
function LabTestConfirmationCard({ data }: { data: LabTestData }) {
    return (
        <div className="bg-white border border-emerald-200 rounded-2xl shadow-sm overflow-hidden text-sm w-full">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-white" />
                <span className="text-white font-semibold text-xs">Test Booked Successfully! 🎉</span>
            </div>
            <div className="p-3 space-y-2">
                <div className="flex items-start gap-2">
                    <Bot className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-xs font-semibold text-slate-700">{data.patientName}</p>
                        <p className="text-xs text-slate-400">{data.scanType}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                    <CalendarPlus className="h-3.5 w-3.5 text-blue-400" />
                    {data.date} at {data.time}
                </div>
                <p className="text-xs text-emerald-600 font-medium">✅ Instructions will be sent to your registered number.</p>
            </div>
        </div>
    );
}

// --- Confirmation Card ---
function ConfirmationCard({ data }: { data: AppointmentData }) {
    return (
        <div className="bg-white border border-emerald-200 rounded-2xl shadow-sm overflow-hidden text-sm w-full">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-white" />
                <span className="text-white font-semibold text-xs">Appointment Confirmed! 🎉</span>
            </div>
            <div className="p-3 space-y-2">
                <div className="flex items-start gap-2">
                    <Bot className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-xs font-semibold text-slate-700">{data.doctor}</p>
                        <p className="text-xs text-slate-400">{data.specialty}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                    <CalendarPlus className="h-3.5 w-3.5 text-blue-400" />
                    {data.date} at {data.time}
                </div>
                <p className="text-xs text-emerald-600 font-medium">✅ Confirmation SMS will be sent to your registered number.</p>
            </div>
        </div>
    );
}

// --- Hospital Card ---
function HospitalCards() {
    return (
        <div className="space-y-2 w-full">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 px-1">
                <MapPin className="h-3.5 w-3.5 text-blue-500" />
                Nearby Hospitals
            </div>
            {NEARBY_HOSPITALS.map((h) => (
                <div key={h.name} className="bg-white border border-slate-200 rounded-xl p-3 hover:border-blue-300 hover:shadow-sm transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-semibold text-slate-700">{h.name}</p>
                            <p className="text-xs text-slate-400">{h.specialty}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-semibold text-blue-600">{h.distance}</p>
                            <p className="text-xs text-amber-500">{h.rating}</p>
                        </div>
                    </div>
                    <div className="mt-2 flex flex-col gap-0.5">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            {h.address}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Phone className="h-3 w-3 text-slate-400" />
                            <a href={`tel:${h.phone}`} className="text-blue-500 hover:underline">{h.phone}</a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function FloatingAgent() {
    const { lang: globalLang } = useLang();
    const { user } = useAuth();
    const [chatLang, setChatLang] = useState<Language>(globalLang);
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [geminiHistory, setGeminiHistory] = useState<GeminiMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [showLangPicker, setShowLangPicker] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setChatLang(globalLang); }, [globalLang]);

    useEffect(() => {
        setMessages([{ id: "welcome", role: "agent", text: WELCOME[chatLang], timestamp: new Date() }]);
    }, [chatLang]);

    useEffect(() => {
        if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    const startVoice = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) { alert("Voice input not supported. Use Chrome."); return; }
        const recognition = new SpeechRecognition();
        recognition.lang = speechLangCodes[chatLang];
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognition.onresult = (e: SpeechRecognitionEvent) => {
            const transcript = e.results[0][0].transcript;
            setInput(transcript);
            sendMessage(transcript);
        };
        recognition.start();
        recognitionRef.current = recognition;
    };

    const stopVoice = () => { recognitionRef.current?.stop(); setIsListening(false); };

    const addAgentMessage = (text: string, card?: Message["card"], cardData?: Message["cardData"]) => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: "agent",
            text,
            timestamp: new Date(),
            card,
            cardData,
        }]);
    };

    const handleBookingConfirm = (data: AppointmentData) => {
        setMessages(prev => {
            // Replace the booking card message with confirmation
            const last = [...prev];
            last[last.length - 1] = {
                ...last[last.length - 1],
                card: "confirmation",
                cardData: data,
                text: `Appointment confirmed with ${data.doctor}!`,
            };
            return last;
        });
        setTimeout(() => {
            addAgentMessage(
                `✅ Your appointment with **${data.doctor}** (${data.specialty}) is booked for **${data.date}** at **${data.time}**. You'll receive a confirmation SMS shortly! Is there anything else I can help you with?`
            );
        }, 300);
    };

    const handleLabTestConfirm = (data: LabTestData) => {
        setMessages(prev => {
            const last = [...prev];
            last[last.length - 1] = {
                ...last[last.length - 1],
                card: "lab_confirmation",
                cardData: data,
                text: `${data.scanType} booked for ${data.patientName}!`,
            };
            return last;
        });
        setTimeout(() => {
            addAgentMessage(
                `✅ Your **${data.scanType}** for **${data.patientName}** is booked on **${data.date}** at **${data.time}**. Fasting may be required depending on the test! Is there anything else I can help you with?`
            );
        }, 300);
    };

    const sendMessage = async (text: string = input) => {
        const trimmed = text.trim();
        if (!trimmed || isTyping) return;
        setInput("");

        const userMsg: Message = { id: Date.now().toString(), role: "user", text: trimmed, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        try {
            const reply = await callGemini(geminiHistory, `[Language: ${chatLang}] ${trimmed}`);
            const finalReply = reply ?? getLocalResponse(trimmed, chatLang);

            setGeminiHistory(prev => [
                ...prev,
                { role: "user", parts: [{ text: trimmed }] },
                { role: "model", parts: [{ text: finalReply }] },
            ]);

            if (finalReply.includes("SHOW_BOOKING_CARD")) {
                addAgentMessage("Sure! Let me help you book an appointment 🗓️", "booking");
            } else if (finalReply.includes("SHOW_LAB_BOOKING_CARD")) {
                addAgentMessage("Okay, let's get your lab test booked! 🧪", "lab_booking");
            } else if (finalReply.includes("SHOW_HOSPITAL_CARD")) {
                const textWithoutToken = finalReply.replace("SHOW_HOSPITAL_CARD", "").trim();
                if (textWithoutToken) {
                    // Send text first, then delay hospital card
                    addAgentMessage(textWithoutToken);
                    setTimeout(() => addAgentMessage("Here are some specialized hospitals near you 🏥", "hospitals"), 500);
                } else {
                    addAgentMessage("Here are some hospitals near you 🏥", "hospitals");
                }
            } else {
                addAgentMessage(finalReply);
            }
        } catch {
            const fallback = getLocalResponse(trimmed, chatLang);
            if (fallback.includes("SHOW_BOOKING_CARD")) {
                addAgentMessage("Sure! Let me help you book an appointment 🗓️", "booking");
            } else if (fallback.includes("SHOW_LAB_BOOKING_CARD")) {
                addAgentMessage("Okay, let's get your lab test booked! 🧪", "lab_booking");
            } else if (fallback.includes("SHOW_HOSPITAL_CARD")) {
                const textWithoutToken = fallback.replace("SHOW_HOSPITAL_CARD", "").trim();
                if (textWithoutToken) {
                    addAgentMessage(textWithoutToken);
                    setTimeout(() => addAgentMessage("Here are some specialized hospitals near you 🏥", "hospitals"), 500);
                } else {
                    addAgentMessage("Here are some hospitals near you 🏥", "hospitals");
                }
            } else {
                addAgentMessage(fallback);
            }
        } finally {
            setIsTyping(false);
        }
    };

    // Only show the agent if the user is signed in
    if (!user) return null;

    return (
        <>
            {/* Chat panel */}
            <div
                className={`fixed bottom-24 right-5 z-50 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-blue-100 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none"}`}
                style={{ maxHeight: "580px" }}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-violet-600 to-blue-500 px-4 py-3 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/30">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white tracking-wide">Lena</p>
                            <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                                <p className="text-xs text-blue-100">Your Health Assistant · Online</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Language picker */}
                        <div className="relative">
                            <button
                                onClick={() => setShowLangPicker(p => !p)}
                                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/20 hover:bg-white/30 transition text-white text-xs font-medium"
                            >
                                <Globe className="h-3.5 w-3.5" />
                                {chatLang === "en" ? "EN" : chatLang === "hi" ? "HI" : "TE"}
                            </button>
                            {showLangPicker && (
                                <div className="absolute top-9 right-0 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-10 min-w-[130px]">
                                    {(["en", "hi", "te"] as Language[]).map(l => (
                                        <button
                                            key={l}
                                            onClick={() => { setChatLang(l); setShowLangPicker(false); }}
                                            className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-blue-50 transition-colors ${chatLang === l ? "text-blue-600 font-semibold bg-blue-50" : "text-slate-700"}`}
                                        >
                                            <span>{l === "en" ? "🇬🇧" : "🇮🇳"}</span>
                                            {languageNames[l]}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                            <X className="h-4 w-4 text-white" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                            <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center ${msg.role === "agent" ? "bg-gradient-to-br from-violet-500 to-blue-500" : "bg-slate-300"}`}>
                                {msg.role === "agent" ? <Sparkles className="h-3.5 w-3.5 text-white" /> : <User className="h-4 w-4 text-white" />}
                            </div>
                            <div className="max-w-[85%] flex flex-col gap-2">
                                {msg.text && !msg.card && (
                                    <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "agent" ? "bg-white border border-slate-100 text-slate-700 rounded-tl-sm shadow-sm" : "bg-gradient-to-r from-violet-500 to-blue-500 text-white rounded-tr-sm"}`}>
                                        {msg.text}
                                    </div>
                                )}
                                {msg.card === "booking" && (
                                    <>
                                        <div className="px-3 py-2 rounded-2xl text-sm bg-white border border-slate-100 text-slate-700 rounded-tl-sm shadow-sm">
                                            {msg.text}
                                        </div>
                                        <BookingCard onConfirm={handleBookingConfirm} />
                                    </>
                                )}
                                {msg.card === "lab_booking" && (
                                    <>
                                        <div className="px-3 py-2 rounded-2xl text-sm bg-white border border-slate-100 text-slate-700 rounded-tl-sm shadow-sm">
                                            {msg.text}
                                        </div>
                                        <LabTestBookingCard onConfirm={handleLabTestConfirm} />
                                    </>
                                )}
                                {msg.card === "confirmation" && msg.cardData && (
                                    <ConfirmationCard data={msg.cardData as AppointmentData} />
                                )}
                                {msg.card === "lab_confirmation" && msg.cardData && (
                                    <LabTestConfirmationCard data={msg.cardData as LabTestData} />
                                )}
                                {msg.card === "hospitals" && (
                                    <>
                                        <div className="px-3 py-2 rounded-2xl text-sm bg-white border border-slate-100 text-slate-700 rounded-tl-sm shadow-sm">
                                            {msg.text}
                                        </div>
                                        <HospitalCards />
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex gap-2 items-center">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shrink-0">
                                <Sparkles className="h-3.5 w-3.5 text-white" />
                            </div>
                            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm flex gap-1 items-center">
                                <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested questions */}
                {messages.length <= 1 && (
                    <div className="px-3 pt-1 pb-2 bg-slate-50 border-t border-slate-100 flex gap-2 overflow-x-auto shrink-0">
                        {SUGGESTED[chatLang].map(q => (
                            <button key={q} onClick={() => sendMessage(q)} className="text-xs text-violet-600 bg-violet-50 border border-violet-200 rounded-full px-3 py-1.5 whitespace-nowrap hover:bg-violet-100 transition-colors shrink-0">
                                {q}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input row */}
                <div className="p-3 border-t border-slate-100 bg-white shrink-0 flex gap-2 items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && sendMessage()}
                        placeholder={PLACEHOLDER[chatLang]}
                        className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
                    />
                    <button
                        onClick={isListening ? stopVoice : startVoice}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isListening ? "bg-rose-500 text-white shadow-md shadow-rose-500/30 animate-pulse" : "bg-slate-100 text-slate-500 hover:bg-violet-50 hover:text-violet-500"}`}
                        title={isListening ? "Stop listening" : `Speak in ${languageNames[chatLang]}`}
                    >
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </button>
                    <button
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || isTyping}
                        className="w-9 h-9 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 flex items-center justify-center text-white disabled:opacity-40 hover:from-violet-600 hover:to-blue-600 transition-all shadow-md shadow-violet-500/20"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>

                {isListening && (
                    <div className="px-3 pb-2 bg-white flex items-center gap-2 text-xs text-rose-500 font-medium">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        Listening in {languageNames[chatLang]}... speak now
                    </div>
                )}
            </div>

            {/* Floating button */}
            <button
                onClick={() => setOpen(prev => !prev)}
                className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-blue-500 text-white shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 flex items-center justify-center transition-all duration-300 hover:scale-110"
                title="Chat with Lena"
            >
                {open ? <X className="h-6 w-6" /> : (
                    <>
                        <Hospital className="h-6 w-6" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
                    </>
                )}
            </button>
        </>
    );
}
