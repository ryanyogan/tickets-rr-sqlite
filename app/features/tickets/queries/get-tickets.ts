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
      ...(searchParams.sort === "newest" && { createdAt: "desc" }),
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
