import { data } from "react-router";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { Separator } from "~/components/ui/separator";
import { TicketItem } from "~/features/tickets/components/ticket-item";
import { getTicket } from "~/features/tickets/queries/get-ticket";
import { prisma } from "~/lib/prisma";
import { requireUser } from "~/lib/session.server";
import { homePath } from "~/paths";
import type { Route } from "./+types/ticket-page";

export async function loader({ params }: Route.LoaderArgs) {
  const { ticketId } = params;
  const ticket = await getTicket(ticketId);

  if (!ticket) {
    // TODO: Handle this error
    throw new Response("Ticket not found", {
      status: 404,
      statusText: "Not Found",
    });
  }

  return data({ ticket });
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const content = formData.get("content") as string;
  const ticketId = formData.get("ticketId") as string;

  if (!content || !ticketId) {
    return new Response("Invalid data", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  try {
    const user = await requireUser(request);
    if (!user) {
      return new Response("Unauthorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    await prisma.comment.create({
      data: {
        userId: user.id,
        ticketId: ticketId as string,
        content,
      },
    });

    return new Response("Comment created", {
      status: 201,
      statusText: "Created",
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return new Response("Internal Server Error", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}

export default function TicketPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Breadcrumbs
        breadcumbs={[
          { title: "Tickets", href: homePath() },
          { title: loaderData.ticket.title },
        ]}
      />

      <Separator />

      <div className="flex justify-center animate-fade-from-top">
        <TicketItem ticket={loaderData.ticket} isDetail />
      </div>
    </div>
  );
}
