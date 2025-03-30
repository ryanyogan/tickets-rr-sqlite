import { useRouteLoaderData } from "react-router";
import type { Theme } from "~/lib/theme.server";

export function useTheme(): Theme {
  const rootLoaderData = useRouteLoaderData("root");
  const rootTheme = rootLoaderData?.theme ?? "system";

  return rootTheme;
}
