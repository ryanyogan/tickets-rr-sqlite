import { createCookie } from "react-router";

// Types for toast messages
export type ToastType = "success" | "error" | "info" | "warning";

export type ToastMessage = {
  type: ToastType;
  message: string;
  id?: string;
};

// Create a server-side cookie to store toast messages
const toastCookie = createCookie("toast", {
  maxAge: 5, // Short expiration time since toasts are transient
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secrets: [process.env.SESSION_SECRET || "s3cr3t"],
});

// Create a toast message and return the cookie header
export async function createToast(
  message: string,
  type: ToastType = "success"
): Promise<string> {
  const toast: ToastMessage = {
    type,
    message,
    id: crypto.randomUUID(), // Ensure unique ID for each toast
  };

  return toastCookie.serialize(toast);
}

// Get toast messages from the request
export async function getToasts(request: Request): Promise<ToastMessage[]> {
  const cookieHeader = request.headers.get("Cookie");
  const toast = await toastCookie.parse(cookieHeader);

  // Clear the toast cookie by returning an empty array and setting expire immediately
  return toast ? [toast] : [];
}

// Clear toast cookie by expiring it
export async function clearToasts(): Promise<string> {
  return toastCookie.serialize({}, { expires: new Date(0), maxAge: 0 });
}
