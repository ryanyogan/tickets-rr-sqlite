import { Button } from "./ui/button";

import { Monitor, Moon, Sun } from "lucide-react";
import { useRef } from "react";
import { Form, useLocation } from "react-router";
import { useTheme } from "./theme-script";

export function ThemeSwitcher() {
  const location = useLocation();
  const theme = useTheme();
  const detailsRef = useRef<HTMLDetailsElement>(null);

  return (
    <span ref={detailsRef} className="group relative cursor-pointer">
      <Form
        role="listbox"
        aria-label="Theme switcher"
        preventScrollReset
        replace
        action="/actions/theme"
        method="post"
        onSubmit={() => {
          detailsRef.current?.removeAttribute("open");
        }}
      >
        <input
          type="hidden"
          name="returnTo"
          value={location.pathname + location.search + location.hash}
        />
        <Button
          aria-label="Theme switcher"
          variant="outline"
          size="icon"
          role="option"
          name="theme"
          value={
            theme === "light" ? "dark" : theme === "dark" ? "system" : "light"
          }
          className="cursor-pointer"
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5" />
          ) : theme === "dark" ? (
            <Sun className="w-5 h-5 text-white" />
          ) : (
            <Monitor className="w-5 h-5" />
          )}
        </Button>
      </Form>
    </span>
  );
}
