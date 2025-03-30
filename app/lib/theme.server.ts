import { createCookie } from "react-router";

export type Theme = "system" | "light" | "dark";

const cookie = createCookie("theme", {
  maxAge: 60 * 60 * 24 * 30, // 30 days
});

export function validateTheme(value: unknown): value is Theme {
  return value === "system" || value === "light" || value === "dark";
}

export async function parseTheme(request: Request) {
  const header = request.headers.get("Cookie");
  const vals = await cookie.parse(header);

  const theme = vals?.theme;
  if (validateTheme(theme)) {
    return theme;
  } else {
    return "system";
  }
}

export function serializeTheme(theme: Theme) {
  const eatCookie = theme === "system";
  if (eatCookie) {
    return cookie.serialize({}, { expires: new Date(0), maxAge: 0 });
  } else {
    return cookie.serialize({ theme });
  }
}
