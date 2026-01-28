export const Colors = {
    // Backgrounds
    bgPrimary: '#050505',
    bgSecondary: '#0f172a',
    bgSurface: '#1e293b',
    logoContainer: '#0B0B0F',

    // Accents
    accentPurple: '#8B5CF6',
    accentFuchsia: '#d946ef',
    telegramBlue: '#24A1DE',
    primary: '#8B5CF6', // Alias for backward compatibility if needed

    // Text
    textPrimary: '#ffffff',
    textSecondary: '#a1a1aa', // zinc-400
    textMuted: '#71717a',    // zinc-500
    textDim: '#52525b',      // zinc-600
    text: '#ffffff',         // Alias

    // Status
    destructive: '#ef4444',
    success: '#22c55e',

    // Legacy mappings (keeping minimal set to prevent breakage)
    background: '#050505',
    surface: '#1e293b',
    muted: '#71717a',
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const Typography = {
    sizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        hero: 48,
    },
    weights: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
    } as const,
    family: {
        regular: "PlusJakartaSans_400Regular",
        medium: "PlusJakartaSans_500Medium",
        semibold: "PlusJakartaSans_600SemiBold",
        bold: "PlusJakartaSans_700Bold",
        extraBold: "PlusJakartaSans_800ExtraBold",
    },
};

export const Theme = {
    colors: Colors,
    spacing: Spacing,
    typography: Typography,
};
