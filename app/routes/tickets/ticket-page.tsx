import { data } from "react-router";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { Separator } from "~/components/ui/separator";
import { TicketItem } from "~/features/tickets/components/ticket-item";
import { getTicket } from "~/features/tickets/queries/get-ticket";
import { prisma } from "~/lib/prisma";
import { requireUser } from "~/lib/session.server";
import { createToast } from "~/lib/toast.server";
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
  const intent = formData.get("intent") as string;

  switch (intent) {
    case "deleteComment": {
      const commentId = formData.get("entityId") as string;
      if (!commentId) {
        return new Response("Invalid comment ID", {
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

        await prisma.comment.deleteMany({
          where: {
            id: commentId,
            userId: user.id,
          },
        });

        const toastCookie = await createToast("Comment deleted successfully");
        return data(
          { success: true },
          { headers: { "Set-Cookie": toastCookie } }
        );
      } catch (error) {
        console.error("Error deleting comment:", error);
        return new Response("Internal Server Error", {
          status: 500,
          statusText: "Internal Server Error",
        });
      }
    }

    default: {
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

        const toastCookie = await createToast("Comment created successfully");

        return data(
          {
            success: true,
          },
          { headers: { "Set-Cookie": toastCookie } }
        );
      } catch (error) {
        console.error("Error creating comment:", error);
        return new Response("Internal Server Error", {
          status: 500,
          statusText: "Internal Server Error",
        });
      }
    }
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
