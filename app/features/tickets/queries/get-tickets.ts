import { prisma } from "~/lib/prisma";
import type { SearchParams } from "../search-params";
import type { TicketWithMetadata } from "../types";

export async function getTickets(
  userId: string | undefined,
  searchParams: SearchParams
): Promise<TicketWithMetadata[]> {
  return prisma.ticket.findMany({
    where: {
      userId,
      title: {
        contains: searchParams.search ?? "",
      },
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
