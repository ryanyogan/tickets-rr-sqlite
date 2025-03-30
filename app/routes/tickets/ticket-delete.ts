import { data, redirect } from "react-router";
import { deleteTicket } from "~/features/tickets/mutations/delete-ticket";
import { prisma } from "~/lib/prisma";
import { createToast } from "~/lib/toast.server";
import type { Route } from "./+types/ticket-delete";

// Server action handler for ticket deletion
export async function action({ params, request }: Route.ActionArgs) {
  const ticketId = params.ticketId as string;

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });
    if (!ticket) {
      const toastCookie = await createToast(
        "You don't have permission to delete this ticket",
        "error"
      );

      return data(
        {
          success: false,
          message: "Not authorized to delete this ticket",
        },
        {
          status: 403,
          headers: { "Set-Cookie": toastCookie },
        }
      );
    }

    const result = await deleteTicket(request, ticketId);

    // If the deletion was successful, redirect to tickets page
    if (result?.data.success) {
      const toastCookie = await createToast(
        "Ticket successfully deleted",
        "success"
      );

      return redirect("/tickets", {
        headers: {
          "Set-Cookie": toastCookie,
        },
      });
    }

    // Otherwise, return the error data
    return result;
  } catch (error) {
    const toastCookie = await createToast(
      error instanceof Error ? error.message : "Failed to delete ticket",
      "error"
    );

    return data(
      {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred",
      },
      {
        status: 500,
        headers: { "Set-Cookie": toastCookie },
      }
    );
  }
}

// Prevent direct access to this URL
export function loader() {
  return redirect("/tickets");
}
