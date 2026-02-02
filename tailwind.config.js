/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    // Override default font family
    fontFamily: {
      sans: ["PlusJakartaSans_400Regular"],
      "sans-medium": ["PlusJakartaSans_500Medium"],
      "sans-semibold": ["PlusJakartaSans_600SemiBold"],
      "sans-bold": ["PlusJakartaSans_700Bold"],
      "sans-extrabold": ["PlusJakartaSans_800ExtraBold"],
    },
    // Override default fontSize with pixel-based values (no rem)
    // Each entry: [fontSize, { lineHeight }]
    fontSize: {
      "xxs": ["10px", { lineHeight: "14px" }],
      xs: ["12px", { lineHeight: "16px" }],
      sm: ["14px", { lineHeight: "20px" }],
      base: ["16px", { lineHeight: "24px" }],
      lg: ["18px", { lineHeight: "26px" }],
      xl: ["20px", { lineHeight: "28px" }],
      "two-xl": ["24px", { lineHeight: "32px" }],
      "slarge": ["30px", { lineHeight: "38px" }],
      "large": ["36px", { lineHeight: "44px" }],
      "xlarge": ["48px", { lineHeight: "56px" }],
      "6xl": ["60px", { lineHeight: "68px" }],
    },
    // Override default lineHeight (for manual leading-* usage)
    lineHeight: {
      none: "16px",
      tight: "20px",
      snug: "24px",
      normal: "24px",
      relaxed: "28px",
      loose: "32px",
      // Pixel-based line-heights
      3: "12px",
      4: "16px",
      5: "20px",
      6: "24px",
      7: "28px",
      8: "32px",
      9: "36px",
      10: "40px",
    },
    // Override default spacing scale (pixel-based, matches RN)
    spacing: {
      px: "1px",
      0: "0",
      0.5: "2px",
      1: "4px",
      1.5: "6px",
      2: "8px",
      2.5: "10px",
      3: "12px",
      3.5: "14px",
      4: "16px",
      5: "20px",
      6: "24px",
      7: "28px",
      8: "32px",
      9: "36px",
      10: "40px",
      11: "44px",
      12: "48px",
      14: "56px",
      16: "64px",
      20: "80px",
      24: "96px",
      28: "112px",
      32: "128px",
      36: "144px",
      40: "160px",
      44: "176px",
      48: "192px",
      52: "208px",
      56: "224px",
      60: "240px",
      64: "256px",
      72: "288px",
      80: "320px",
      96: "384px",
    },
    extend: {
      colors: {
        // Core Palette
        "bg-primary": "#050505",
        "bg-secondary": "#0f172a",
        "bg-surface": "#1e293b",
        "logo-container": "#0B0B0F",
        "card": "#121217",

        // Accents
        "accent-purple": "#8B5CF6",
        "accent-fuchsia": "#d946ef",
        "telegram-blue": "#24A1DE",

        // Text
        "text-primary": "#ffffff",
        "text-secondary": "#a1a1aa", // zinc-400
        "text-muted": "#71717a", // zinc-500
        "text-dim": "#52525b", // zinc-600

        // Status
        destructive: "#ef4444",
        success: "#22c55e",
      },
      borderRadius: {
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        xxl: "45px",
        full: "9999px",
      },
      // NativeWind shadows (using elevation/boxShadow syntax)
      boxShadow: {
        xl: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "deep": "0 25px 60px rgba(0, 0, 0, 0.5)",
        "heavy": "0 30px 70px rgba(0, 0, 0, 0.9)",
        "accent": "0 10px 15px -3px rgba(139, 92, 246, 0.2)",
      },
      // Font weight utilities that map to font families (RN approach)
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
      },
    },
  },
  plugins: [],
};

