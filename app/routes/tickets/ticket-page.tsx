import { data } from "react-router";
import { TicketItem } from "~/features/tickets/components/ticket-item";
import { getTicket } from "~/features/tickets/queries/get-tciet";
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
  const data = loaderData;

  return (
    <div className="flex justify-center animate-fade-from-top">
      <TicketItem ticket={data.ticket} isDetail />
    </div>
  );
}
