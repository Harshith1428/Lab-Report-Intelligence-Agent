

# Simple Health Dashboard — Hyderabad Edition

## Page 1: Main Dashboard (Mobile-First)

### Hero Section
- Full-width "Calm Blue" (#E3F2FD) background with high-contrast dark text
- Large centered "Upload Lab Report" button with Upload icon + text (minimum 48px tap target)
- Subtitle: "Upload your PDF lab report and we'll extract your health data"

### Health Status Grid — 3 Large Cards
1. **Blood Sugar & BP** — Fasting glucose, post-meal glucose, systolic/diastolic BP
2. **Cholesterol & Heart** — Total cholesterol, HDL, LDL, heart rate
3. **CBC & Hemoglobin** — Hemoglobin, WBC, RBC, platelet count

Each card shows:
- Metric name + current value
- Color-coded status dot (🟢 Normal / 🟡 Warning / 🔴 Critical) based on standard medical ranges
- Last updated date

### Sticky Bottom Bar
- Large microphone icon button for voice commands (UI placeholder initially)
- Language toggle: EN / हिं / తె

## Trilingual Support (English + Hindi + Telugu)
- All labels, status messages, and metric names translated
- Language toggle persists across sessions via localStorage

## AI Lab Report Parsing (Lovable Cloud + Lovable AI)
- Enable Lovable Cloud for backend
- Edge function receives uploaded PDF, sends content to Lovable AI (Gemini Flash) to extract structured health metrics
- Extracted values populate the 3 health cards with color-coded status indicators
- Medical reference ranges stored in a config file (instructions.md pattern)

## Design Constraints
- Tailwind CSS, mobile-first
- Minimum font size 18px for body, 24px+ for card values
- High contrast ratio (WCAG AA minimum)
- No complex animations
- Large touch targets (48px+) throughout

