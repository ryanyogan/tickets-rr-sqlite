import { data } from "react-router";
import { prisma } from "~/lib/prisma";
import { requireUser } from "~/lib/session.server";

export async function deleteTicket(request: Request, ticketId: string) {
  const user = await requireUser(request);

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket || ticket.userId !== user.id) {
      return data(
        {
          success: false,
          message: "Not authorized to delete this ticket",
        },
        { status: 403 }
      );
    }

    await prisma.ticket.delete({
      where: { id: ticketId },
    });

    // const toastCookie = await createToast("Ticket deleted successfully");

    return data(
      { success: true, message: "Ticket deleted" }
      // { headers: { "Set-Cookie": toastCookie } }
    );
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
