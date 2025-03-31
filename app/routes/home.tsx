import { Suspense } from "react";
import { Await } from "react-router";
import { Heading } from "~/components/heading";
import { Spinner } from "~/components/spinner";
import { TicketList } from "~/features/tickets/components/ticket-list";
import { getTickets } from "~/features/tickets/queries/get-tickets";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Ticket Bounty" },
    { name: "description", content: "Tickets For Everyone" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const search = searchParams.get("search") as string;

  const ticketPromise = getTickets(undefined, { search });
  return { ticketPromise };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="All Tickets"
        description="Tickets by everyone in your team"
      />

      <Suspense fallback={<Spinner />}>
        <Await resolve={loaderData.ticketPromise}>
          {(value) => <TicketList tickets={value} />}
        </Await>
      </Suspense>
    </div>
  );
}
