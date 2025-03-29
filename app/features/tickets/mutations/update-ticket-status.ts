import type { TicketStatus } from "@prisma/client";
import { data } from "react-router";
import { prisma } from "~/lib/prisma";
import { requireUser } from "~/lib/session.server";

export async function updateTicketStatus(
  request: Request,
  ticketId: string,
  status: TicketStatus
) {
  const user = await requireUser(request);

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket || ticket.userId !== user.id) {
      return data(
        {
          success: false,
          message: "Not authorized to update this ticket",
        },
        { status: 403 }
      );
    }

    await prisma.ticket.update({
      where: { id: ticketId },
      data: { status },
    });

    // const toastCookie = await createToast("Status updated successfully");

    return data(
      { success: true, message: "Status updated" }
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
