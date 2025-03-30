import { useMemo } from "react";
import { useNavigation, useRouteLoaderData } from "react-router";
import type { Theme } from "~/lib/theme.server";

export function useTheme(): Theme {
  const rootLoaderData = useRouteLoaderData("root");
  const rootTheme = rootLoaderData?.theme ?? "system";
  const navigation = useNavigation();

  const theme = navigation.formData?.has("theme")
    ? (navigation.formData.get("theme") as Theme)
    : rootTheme;

  return theme;
}

export function ThemeScript() {
  const theme = useTheme();

  const script = useMemo(
    () => `
      const theme = ${JSON.stringify(theme)};
      const media = window.matchMedia("(prefers-color-scheme: dark)")
      if (theme === "system" && media.matches) {
        document.documentElement.classList.add("dark");
      }
    `,
    []
  );
}
