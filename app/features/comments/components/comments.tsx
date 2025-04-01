import type { Comment } from "@prisma/client";
import { CardCompact } from "~/components/card-compact";
import { CommentDeleteButton } from "./comment-delete-button";
import { CommentItem } from "./comment-item";
import { CreateCommentForm } from "./create-comment";

export function Comments({
  comments,
  ticketId,
}: {
  comments: Comment[];
  ticketId: string;
}) {
  return (
    <>
      <CardCompact
        title="Create Comment"
        description="Add a comment to this ticket"
        content={<CreateCommentForm ticketId={ticketId} />}
      />
      <div className="flex flex-col gap-y-2 ml-8">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            buttons={[<CommentDeleteButton key="0" id={comment.id} />]}
          />
        ))}
      </div>
    </>
  );
}
