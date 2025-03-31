import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { Toaster } from "sonner";
import type { Route } from "./+types/root";
import "./app.css";
import { Header } from "./components/header";
import { Sidebar } from "./components/sidebar/sidebar";
import { ThemeScript, useTheme } from "./components/theme-script";
import { ToastHandler } from "./components/toast-handler";
import { getUserFromSession } from "./lib/session.server";
import { parseTheme } from "./lib/theme.server";
import { clearToasts, getToasts } from "./lib/toast.server";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUserFromSession(request);
  const theme = await parseTheme(request);
  const toasts = await getToasts(request);
  const headers = new Headers();

  if (toasts.length > 0) {
    headers.append("Set-Cookie", await clearToasts());
  }

  headers.append("Vary", "Cookie");

  return data({ theme, user, toasts }, { headers });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const theme = useTheme() === "dark" ? "dark" : "";

  return (
    <html lang="en" className={`${theme} antialiased font-geist`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <NuqsAdapter>
          <Header />
          <div className="flex h-screen overflow-hidden border-collapse">
            <Sidebar />
            <main
              className="
            min-h-screen flex-1 overflow-y-auto 
            overflow-x-hidden py-24 px-8 
            bg-secondary/20 flex flex-col
          "
            >
              {children}
            </main>
          </div>
          <Toaster expand />
          <ToastHandler />
          <ThemeScript />
          <ScrollRestoration />
          <Scripts />
        </NuqsAdapter>
      </body>
    </html>
  );
}

export default function App({}: Route.ComponentProps) {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
