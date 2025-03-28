import { hash } from "@node-rs/argon2";
import { PrismaClient, type Ticket, type User } from "@prisma/client";

const prisma = new PrismaClient();

const users: Pick<User, "username" | "email">[] = [
  {
    username: "admin",
    email: "admin@admin.com",
  },
  {
    username: "ryan",
    email: "ryan@jk.com",
  },
];

const password = "asdasd";

const tickets: Pick<
  Ticket,
  "title" | "content" | "status" | "deadline" | "bounty"
>[] = [
  {
    title: "Ticket 1",
    content: "This is the first ticket",
    status: "DONE" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 499,
  },
  {
    title: "Ticket 2",
    content: "This is the second ticket",
    status: "OPEN" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 399,
  },
  {
    title: "Ticket 3",
    content: "This is the third ticket",
    status: "IN_PROGRESS" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 299,
  },
];

async function seed() {
  const start = performance.now();
  console.log("DB Seed: Started...");

  await prisma.user.deleteMany();
  await prisma.ticket.deleteMany();

  const passwordHash = await hash(password);
  const dbUsers = await prisma.user.createManyAndReturn({
    data: users.map((user) => ({
      ...user,
      passwordHash,
    })),
  });

  await prisma.ticket.createMany({
    data: tickets.map((ticket) => ({
      ...ticket,
      userId: dbUsers[0].id,
    })),
  });

  const end = performance.now();
  console.log(`DB Seed: Completed in ${end - start}ms`);
}

seed();
