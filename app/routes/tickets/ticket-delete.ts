import { data, redirect } from "react-router";
import { deleteTicket } from "~/features/tickets/mutations/delete-ticket";
import type { Route } from "./+types/ticket-delete";

// Server action handler for ticket deletion
export async function action({ params, request }: Route.ActionArgs) {
  const ticketId = params.ticketId as string;

  try {
    const result = await deleteTicket(request, ticketId);

    // If the deletion was successful, redirect to tickets page
    if (result?.data.success) {
      return redirect("/tickets");
    }

    // Otherwise, return the error data
    return result;
  } catch (error) {
    return data(
      {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred",
      },
      { status: 500 }
    );
  }
}

// Prevent direct access to this URL
export function loader() {
  return redirect("/tickets");
}
