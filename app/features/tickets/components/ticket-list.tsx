import type { TicketWithMetadata } from "../types";
import { TicketItem } from "./ticket-item";

type TicketListProps = {
  tickets: TicketWithMetadata[];
};

export function TicketList({ tickets }: TicketListProps) {
  return (
    <div className="flex-1 flex flex-col items-center gap-y-4 animate-fade-from-top">
      {tickets.map((ticket) => (
        <TicketItem key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
