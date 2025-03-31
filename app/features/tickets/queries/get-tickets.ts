import { prisma } from "~/lib/prisma";
import type { ParsedSearchParams } from "../search-params";

export async function getTickets(
  userId: string | undefined,
  searchParams: ParsedSearchParams
) {
  const where = {
    userId,
    title: {
      contains: searchParams.search ?? "",
    },
  };
  const skip = searchParams.size * searchParams.page;
  const take = searchParams.size;

  const [tickets, count] = await prisma.$transaction([
    prisma.ticket.findMany({
      where,
      skip,
      take,
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
    }),

    prisma.ticket.count({
      where,
    }),
  ]);

  return {
    list: tickets,
    metadata: {
      count,
      hasNextPage: count > skip + take,
    },
  };
}
