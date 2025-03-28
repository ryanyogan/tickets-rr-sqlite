import { prisma } from "~/lib/prisma";
import type { TicketWithMetadata } from "../types";

export async function getTickets(
  userId?: string | undefined
): Promise<TicketWithMetadata[]> {
  return prisma.ticket.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
}
