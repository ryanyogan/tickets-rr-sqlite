import { useEffect, useRef } from "react";
import { useFetcher } from "react-router";
import { SubmitButton } from "~/components/form/submit-button";
import { Textarea } from "~/components/ui/textarea";

export function CreateCommentForm({ ticketId }: { ticketId: string }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fetcher = useFetcher();

  useEffect(() => {
    // When the fetcher is idle and there’s no error, clear the textarea.
    if (fetcher.state === "idle" && fetcher.data) {
      textareaRef.current && (textareaRef.current.value = "");
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <fetcher.Form method="post" className="flex flex-col space-y-2">
      <Textarea
        name="content"
        ref={textareaRef}
        placeholder="Add a comment..."
      />
      <input type="hidden" name="ticketId" value={ticketId} />

      <SubmitButton pending={fetcher.state !== "idle"} label="Comment" />
    </fetcher.Form>
  );
}
