export const Colors = {
    primary: "#6C63FF",
    secondary: "#FF6584",
    background: "#0F172A",
    surface: "#1E293B",
    text: "#F8FAFC",
    muted: "#94A3B8",
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const Typography = {
    sizes: {
        sm: 14,
        md: 16,
        lg: 18,
        xl: 24,
        xxl: 32,
    },
    weights: {
        regular: "400",
        medium: "500",
        bold: "700",
    } as const,
};

export const Theme = {
    colors: Colors,
    spacing: Spacing,
    typography: Typography,
};
