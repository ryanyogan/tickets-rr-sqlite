import { prisma } from "~/lib/prisma";
import type { ParsedSearchParams } from "../search-params";
import type { TicketWithMetadata } from "../types";

export async function getTickets(
  userId: string | undefined,
  searchParams: ParsedSearchParams
): Promise<TicketWithMetadata[]> {
  return prisma.ticket.findMany({
    where: {
      userId,
      title: {
        contains: searchParams.search ?? "",
      },
    },
    orderBy: {
      [searchParams.sortKey]: searchParams.sortValue,
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
