import { data } from "react-router";
import { z } from "zod";
import { updateTicketStatus } from "~/features/tickets/mutations/update-ticket-status";
import type { Route } from "./+types/ticket-status";

const statusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "DONE"] as const),
});

export async function action({ params, request }: Route.ActionArgs) {
  const ticketId = params.ticketId as string;
  const formData = await request.formData();

  try {
    const result = statusSchema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      return data({ success: false, error: "Invalid status" }, { status: 400 });
    }

    return updateTicketStatus(request, ticketId, result.data.status);
  } catch (error) {
    return data(
      {
        success: false,
        error: error instanceof Error ? error.message : "An error occurred",
      },
      { status: 500 }
    );
  }
}

export function loader() {
  return data({ message: "Method not allowed" }, { status: 405 });
}
