import type { Comment } from "@prisma/client";
import { Card } from "~/components/ui/card";

export function CommentItem({
  comment,
}: {
  comment: Comment & { user?: { username: string } };
}) {
  return (
    <Card className="p-4 flex-1 flex flex-col gap-y-1">
      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          {comment.user?.username ?? "Delete User"}
        </p>
        <p className="text-sm text-muted-foreground">
          {comment.createdAt.toLocaleString()}
        </p>
      </div>
      <p className="whitespace-pre-line">{comment.content}</p>
    </Card>
  );
}
