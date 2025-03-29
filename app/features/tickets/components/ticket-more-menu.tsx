import type { Ticket, TicketStatus } from "@prisma/client";
import { useFetcher } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { TICKET_STATUS_LABELS } from "../constants";

type TicketMoreMenuProps = {
  ticket: Ticket;
  trigger: React.ReactElement;
};

export function TicketMoreMenu({ ticket, trigger }: TicketMoreMenuProps) {
  const statusFetcher = useFetcher();

  async function handleUpdateTicketStatus(status: string) {
    statusFetcher.submit(
      { status },
      { method: "POST", action: `/tickets/${ticket.id}/status` }
    );
  }

  // const [deleteButton, deleteDialog] = useConfirmDialog({
  //   action: deleteTicket.bind(null, ticket.id),
  //   trigger: (
  //     <DropdownMenuItem className="cursor-pointer">
  //       <LucideTrash className="size-4" />
  //       <span>Delete</span>
  //     </DropdownMenuItem>
  //   ),
  // });

  const ticketStatusRadioGroupItems = (
    <DropdownMenuRadioGroup
      onValueChange={handleUpdateTicketStatus}
      value={ticket.status}
    >
      {(Object.keys(TICKET_STATUS_LABELS) as Array<TicketStatus>).map((key) => (
        <DropdownMenuRadioItem className="cursor-pointer" key={key} value={key}>
          {TICKET_STATUS_LABELS[key]}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );

  return (
    <>
      {/* {deleteDialog} */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" side="right">
          {ticketStatusRadioGroupItems}
          <DropdownMenuSeparator />
          {/* {deleteButton} */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
