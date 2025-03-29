import { data, redirect } from "react-router";
import { z } from "zod";
import { prisma } from "~/lib/prisma";
import { requireUser } from "~/lib/session.server";
import { toCent } from "~/utils/currency";

// Validation schema for tickets
const ticketSchema = z.object({
  title: z.string({ message: "Is Required" }).min(1).max(200),
  content: z.string().min(1).max(1024),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Is required"),
  bounty: z.coerce.number().positive(),
});

export async function upsertTicket(request: Request, ticketId?: string) {
  const user = await requireUser(request);
  const formData = await request.formData();

  // Validate form data
  const result = ticketSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return data(
      {
        success: false,
        errors: result.error.flatten(),
        values: Object.fromEntries(formData),
      },
      { status: 400 }
    );
  }

  const { title, content, deadline, bounty } = result.data;

  // Check if ticket exists and user owns it (for updates)
  if (ticketId) {
    const existingTicket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!existingTicket || existingTicket.userId !== user.id) {
      return data(
        {
          success: false,
          errors: { formErrors: ["Not authorized to edit this ticket"] },
          values: Object.fromEntries(formData),
        },
        { status: 403 }
      );
    }
  }

  // Prepare data for database
  const ticketData = {
    title,
    content,
    deadline,
    bounty: toCent(bounty),
    userId: user.id,
  };

  // Upsert ticket
  const ticket = await prisma.ticket.upsert({
    where: { id: ticketId || "" },
    update: ticketData,
    create: ticketData,
  });

  // Set success toast message
  // const toastCookie = await createToast(
  //   ticketId ? "Ticket updated successfully" : "Ticket created successfully"
  // );

  // Redirect based on operation
  return redirect(ticketId ? `/tickets/${ticket.id}` : "/tickets", {
    // headers: { "Set-Cookie": toastCookie },
  });
}
