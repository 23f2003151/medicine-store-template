import type { CSSProperties } from "react";
import type { ThemeConfig } from "@/types/template";

export interface ThemeVariables extends CSSProperties {
  "--theme-primary": string;
  "--theme-secondary": string;
  "--theme-page": string;
  "--theme-surface": string;
  "--theme-text": string;
  "--theme-muted": string;
  "--theme-border": string;
  "--theme-accent": string;
  "--theme-font": string;
  "--theme-radius": string;
  "--theme-container": string;
  "--theme-shadow": string;
}

export function getThemeVariables(theme: ThemeConfig): ThemeVariables {
  const shadows: Record<ThemeConfig["shadow"], string> = {
    soft: "0 18px 48px rgba(29, 76, 59, 0.08)",
    medium: "0 22px 58px rgba(29, 76, 59, 0.14)",
    none: "none",
  };

  return {
    "--theme-primary": theme.primary,
    "--theme-secondary": theme.secondary,
    "--theme-page": theme.pageBackground,
    "--theme-surface": theme.surface,
    "--theme-text": theme.text,
    "--theme-muted": theme.mutedText,
    "--theme-border": theme.border,
    "--theme-accent": theme.accent,
    "--theme-font":
      theme.fontFamily === "geometric"
        ? "'Avenir Next', 'Segoe UI', sans-serif"
        : "Arial, Helvetica, sans-serif",
    "--theme-radius": `${theme.borderRadius}px`,
    "--theme-container": `${theme.containerWidth}px`,
    "--theme-shadow": shadows[theme.shadow],
  };
}
