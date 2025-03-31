import type { Comment } from "@prisma/client";
import { CommentItem } from "./comment-item";

export function Comments({ comments }: { comments: Comment[] }) {
  return (
    <div className="flex flex-col gap-y-2 ml-8">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
