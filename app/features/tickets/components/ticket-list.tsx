import { Placeholder } from "~/components/placeholder";
import { SearchInput } from "~/components/search-input";
import { SortSelect } from "~/components/sort-select";
import type { TicketWithMetadata } from "../types";
import { TicketItem } from "./ticket-item";

type TicketListProps = {
  tickets: TicketWithMetadata[];
};

export function TicketList({ tickets }: TicketListProps) {
  return (
    <div className="flex-1 flex flex-col items-center gap-y-4 animate-fade-from-top">
      <div className="w-full max-w-[420px] flex gap-x-2">
        <SearchInput placeholder="Search tickets..." />
        <SortSelect
          options={[
            { value: "newest", label: "Newest" },
            { value: "bounty", label: "Bounty" },
          ]}
        />
      </div>

      {tickets.length ? (
        tickets.map((ticket) => <TicketItem key={ticket.id} ticket={ticket} />)
      ) : (
        <Placeholder label="No tickets found" />
      )}
    </div>
  );
}
