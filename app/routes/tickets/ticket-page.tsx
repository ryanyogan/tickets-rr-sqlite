import { data } from "react-router";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { Separator } from "~/components/ui/separator";
import { TicketItem } from "~/features/tickets/components/ticket-item";
import { getTicket } from "~/features/tickets/queries/get-ticket";
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
