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
      ...(typeof searchParams.search === "string" && {
        title: {
          contains: searchParams.search ?? "",
        },
      }),
    },
    orderBy: {
      ...(searchParams.sort === undefined && { createdAt: "desc" }),
      ...(searchParams.sort === "bounty" && { bounty: "desc" }),
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
