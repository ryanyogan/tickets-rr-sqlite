import { LucideTrash } from "lucide-react";
import { useConfirmDialog } from "~/components/confirm-dialog";
import { Button } from "~/components/ui/button";
import { ticketPath } from "~/paths";

type CommentDeleteButtonProps = {
  id: string;
};

export function CommentDeleteButton({ id }: CommentDeleteButtonProps) {
  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: ticketPath(id),
    intent: "deleteComment",
    entityId: id,
    trigger: (
      <Button variant="outline" size="icon" className="cursor-pointer">
        <LucideTrash className="size-4" />
      </Button>
    ),
  });

  return (
    <>
      {deleteButton}
      {deleteDialog}
    </>
  );
}
