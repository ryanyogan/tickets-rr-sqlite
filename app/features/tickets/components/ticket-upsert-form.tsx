import type { Ticket } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { Form } from "react-router";
import {
  DatePicker,
  type ImperativeHandleFromDatePicker,
} from "~/components/date-picker";
import { SubmitButton } from "~/components/form/submit-button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { fromCent } from "~/utils/currency";

type TicketUpsertFormProps = {
  ticket?: Ticket;
  actionData?: any;
};

export function TicketUpsertForm({
  ticket,
  actionData,
}: TicketUpsertFormProps) {
  const [values, setValues] = useState({
    title: ticket?.title || "",
    content: ticket?.content || "",
    deadline: ticket?.deadline || new Date().toISOString().split("T")[0],
    bounty: ticket ? fromCent(ticket.bounty) : "",
  });

  useEffect(() => {
    if (actionData?.values) {
      setValues({
        title: actionData.values.title || values.title,
        content: actionData.values.content || values.content,
        deadline: actionData.values.deadline || values.deadline,
        bounty: actionData.values.bounty || values.bounty,
      });
    }
  }, [actionData]);

  const errors = actionData?.errors || { fieldErrors: {} };

  const datePickerImperativeHandleRef =
    useRef<ImperativeHandleFromDatePicker>(null);

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Form method="post" ref={formRef} className="flex flex-col gap-y-2">
      <Label htmlFor="title">Title</Label>
      <Input type="text" id="title" name="title" defaultValue={values.title} />

      {errors.fieldErrors.title && (
        <div className="text-red-500 text-sm">{errors.fieldErrors.title}</div>
      )}

      <Label htmlFor="content">Content</Label>
      <Textarea id="content" name="content" defaultValue={values.content} />

      {errors.fieldErrors.content && (
        <div className="text-red-500 text-sm">{errors.fieldErrors.content}</div>
      )}

      <div className="flex gap-x-2 mb-1">
        <div className="w-1/2 flex flex-col gap-y-2">
          <Label htmlFor="deadline">Deadline</Label>
          <DatePicker
            imperativeHandleRef={datePickerImperativeHandleRef}
            id="deadline"
            name="deadline"
            defaultValue={values.deadline}
          />

          {errors.fieldErrors.deadline && (
            <div className="text-red-500 text-sm">
              {errors.fieldErrors.deadline}
            </div>
          )}
        </div>

        <div className="w-1/2 flex flex-col gap-y-2">
          <Label htmlFor="bounty">Bounty ($)</Label>
          <Input
            id="bounty"
            name="bounty"
            type="number"
            step=".01"
            defaultValue={values.bounty}
          />

          {errors.fieldErrors.bounty && (
            <div className="text-red-500 text-sm">
              {errors.fieldErrors.bounty}
            </div>
          )}
        </div>
      </div>

      <SubmitButton label={ticket ? "Edit" : "Create"} />
    </Form>
  );
}
