import { useEffect } from "react";
import { useRouteLoaderData } from "react-router";
import { toast } from "sonner";
import type { ToastMessage } from "~/lib/toast.server";

export function ToastHandler() {
  // Access toast messages from root loader data
  const rootData = useRouteLoaderData("root") as
    | { toasts?: ToastMessage[] }
    | undefined;
  const toasts = rootData?.toasts || [];

  useEffect(() => {
    // Display each toast message
    toasts.forEach((toastMessage) => {
      const { type, message, id } = toastMessage;

      switch (type) {
        case "success":
          toast.success(message, { id });
          break;
        case "error":
          toast.error(message, { id });
          break;
        case "info":
          toast.info(message, { id });
          break;
        case "warning":
          toast.warning(message, { id });
          break;
        default:
          toast(message, { id });
      }
    });
  }, [toasts]);

  // This component doesn't render anything visible
  return null;
}
