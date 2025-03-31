import { Suspense } from "react";
import { Await } from "react-router";
import { CardCompact } from "~/components/card-compact";
import { Heading } from "~/components/heading";
import { Spinner } from "~/components/spinner";
import { TicketList } from "~/features/tickets/components/ticket-list";
import { upsertTicket } from "~/features/tickets/mutations/upsert-tickets";
import { getTickets } from "~/features/tickets/queries/get-tickets";
import { getUserFromSession } from "~/lib/session.server";
import { TicketUpsertForm } from "../../features/tickets/components/ticket-upsert-form";
import type { Route } from "./+types/tickets";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUserFromSession(request);
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const search = searchParams.get("search") as string;

  const ticketPromise = getTickets(user?.id, { search });

  return { ticketPromise };
}

export async function action({ request }: Route.ActionArgs) {
  return upsertTicket(request);
}

export default function Tickets({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { ticketPromise } = loaderData;

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="My Tickets"
        description="Tickets by you and all team members"
      />

      <CardCompact
        title="Create Ticket"
        description="A new ticket will be created"
        className="w-full max-w-[420px] self-center"
        content={<TicketUpsertForm actionData={actionData} />}
      />

      <Suspense fallback={<Spinner />}>
        <Await resolve={ticketPromise}>
          {(value) => <TicketList tickets={value} />}
        </Await>
      </Suspense>
    </div>
  );
}
