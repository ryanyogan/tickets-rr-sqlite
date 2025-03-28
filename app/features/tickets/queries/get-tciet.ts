import { cache } from "react";
import { prisma } from "~/lib/prisma";

export const getTicket = cache(async (id: string) => {
  return await prisma.ticket.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
});
