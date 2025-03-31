import clsx from "clsx";
import {
  LucideArrowUpRightFromSquare,
  LucideMoreVertical,
  LucidePencil,
} from "lucide-react";
import { Link, useRouteLoaderData } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { isOwner } from "~/features/auth/utils/is-owner";
import { Comments } from "~/features/comments/components/comments";
import { ticketEditPath, ticketPath } from "~/paths";
import { toCurrencyFromCent } from "~/utils/currency";
import { TICKET_ICONS } from "../constants";
import type { TicketWithMetadata } from "../types";
import { TicketMoreMenu } from "./ticket-more-menu";

type TicketItemProps = {
  ticket: TicketWithMetadata;
  isDetail?: boolean;
};

export function TicketItem({ ticket, isDetail }: TicketItemProps) {
  const { user } = useRouteLoaderData("root");
  const isTicketOwner = isOwner(user, ticket);

  const detailButton = (
    <Button variant="outline" size="icon" asChild>
      <Link
        aria-label="Show Ticket"
        prefetch="intent"
        to={ticketPath(ticket.id)}
      >
        <LucideArrowUpRightFromSquare className="size-4" />
      </Link>
    </Button>
  );

  const editButton = isTicketOwner ? (
    <Button variant="outline" size="icon" asChild>
      <Link
        aria-label="Edit Ticket"
        prefetch="intent"
        to={ticketEditPath(ticket.id)}
      >
        <LucidePencil className="size-4" />
      </Link>
    </Button>
  ) : null;

  const moreMenu = isTicketOwner ? (
    <TicketMoreMenu
      ticket={ticket}
      trigger={
        <Button
          aria-label="Show More"
          variant="outline"
          size="icon"
          className="cursor-pointer"
        >
          <LucideMoreVertical className="size-4" />
        </Button>
      }
    />
  ) : null;

  return (
    <div
      className={clsx("w-full flex flex-col gap-y-4", {
        "max-w-[580px]": isDetail,
        "max-w-[420px]": !isDetail,
      })}
    >
      <div className="flex gap-x-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex gap-x-2">
              <span>{TICKET_ICONS[ticket.status]}</span>
              <span className="truncate">{ticket.title}</span>
            </CardTitle>

            <CardContent>
              <span
                className={clsx("whitespace-break-spaces", {
                  "line-clamp-3": !isDetail,
                })}
              >
                {ticket.content}
              </span>
            </CardContent>

            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                {ticket.deadline} by {ticket.user.username}
              </p>
              <p className="text-sm text-muted-foreground">
                {toCurrencyFromCent(ticket.bounty)}
              </p>
            </CardFooter>
          </CardHeader>
        </Card>

        <div className="flex flex-col gap-y-1">
          {isDetail ? (
            <>
              {editButton}
              {moreMenu}
            </>
          ) : (
            <>
              {detailButton}
              {editButton}
            </>
          )}
        </div>
      </div>

      {isDetail ? (
        <Comments
          ticketId={ticket.id}
          comments={(ticket as any).comments ?? []}
        />
      ) : null}
    </div>
  );
}
