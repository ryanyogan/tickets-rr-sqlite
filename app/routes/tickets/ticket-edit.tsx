import { data, redirect } from "react-router";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { CardCompact } from "~/components/card-compact";
import { Separator } from "~/components/ui/separator";
import { isOwner } from "~/features/auth/utils/is-owner";
import { TicketUpsertForm } from "~/features/tickets/components/ticket-upsert-form";
import { upsertTicket } from "~/features/tickets/mutations/upsert-tickets";
import { getTicket } from "~/features/tickets/queries/get-ticket";
import { getUserFromSession } from "~/lib/session.server";
import { createToast } from "~/lib/toast.server";
import { homePath, ticketPath } from "~/paths";
import type { Route } from "./+types/ticket-edit";

export async function loader({ request, params }: Route.LoaderArgs) {
  const { ticketId } = params;

  if (!ticketId) {
    const toastCookie = await createToast("Ticket not found", "error");
    return redirect("/tickets", {
      headers: { "Set-Cookie": toastCookie },
    });
  }

  const [user, ticket] = await Promise.all([
    getUserFromSession(request),
    getTicket(ticketId),
  ]);

  // Check if ticket exists
  if (!ticket) {
    const toastCookie = await createToast("Ticket not found", "error");
    return redirect("/tickets", {
      headers: { "Set-Cookie": toastCookie },
    });
  }

  // Check if user is the owner of the ticket
  if (!isOwner(user, ticket)) {
    const toastCookie = await createToast(
      "You don't have permission to edit this ticket",
      "error"
    );
    return redirect(`/tickets/${ticketId}`, {
      headers: { "Set-Cookie": toastCookie },
    });
  }

  return data({ ticket });
}

export async function action({ params, request }: Route.ActionArgs) {
  const { ticketId } = params;

  if (!ticketId) {
    return redirect("/tickets");
  }

  return upsertTicket(request, ticketId);
}

export default function TicketEditPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Breadcrumbs
        breadcumbs={[
          { title: "Tickets", href: homePath() },
          {
            title: loaderData.ticket.title,
            href: ticketPath(loaderData.ticket.id),
          },
          { title: "Edit" },
        ]}
      />

      <Separator />

      <div className="flex-1 flex flex-col justify-center items-center">
        <CardCompact
          title="Edit Ticket"
          description="Edit an existing ticket"
          className="w-full max-w-[420px] animate-fade-from-top"
          content={
            <TicketUpsertForm
              ticket={loaderData.ticket}
              actionData={actionData}
            />
          }
        />
      </div>
    </div>
  );
}
