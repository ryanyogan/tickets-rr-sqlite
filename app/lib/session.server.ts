import { createCookieSessionStorage, redirect } from "react-router";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "./prisma";

// Configure cookie session storage
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET || "s3cr3t"],
    secure: process.env.NODE_ENV === "production",
  },
});

// Custom session storage that persists to the database
export const createPrismaSessionStorage = () => {
  return {
    async getSession(request: Request) {
      const cookieSession = await sessionStorage.getSession(
        request.headers.get("Cookie")
      );

      const sessionId = cookieSession.get("sessionId");
      if (!sessionId) return cookieSession;

      const dbSession = await prisma.session.findUnique({
        where: { id: sessionId },
        include: { user: true },
      });

      if (!dbSession || new Date(dbSession.expiresAt) < new Date()) {
        // Session expired or not found
        if (dbSession) {
          // Clean up expired session
          await prisma.session.delete({ where: { id: sessionId } });
        }
        cookieSession.unset("sessionId");
        return cookieSession;
      }

      // Set userId in the cookie session
      cookieSession.set("userId", dbSession.userId);

      return cookieSession;
    },

    async commitSession(session: any): Promise<string> {
      return sessionStorage.commitSession(session);
    },

    async destroySession(session: any) {
      const sessionId = session.get("sessionId");
      if (sessionId) {
        // Remove from database
        await prisma.session
          .delete({
            where: { id: sessionId },
          })
          .catch(() => {
            // Ignore errors if session doesn't exist
          });
      }

      return sessionStorage.destroySession(session);
    },

    // Create a new session in the database
    async createSession(userId: string, expiresAt: Date) {
      const sessionId = uuidv4();

      await prisma.session.create({
        data: {
          id: sessionId,
          userId,
          expiresAt,
        },
      });

      const session = await sessionStorage.getSession();
      session.set("sessionId", sessionId);
      session.set("userId", userId);

      return session;
    },
  };
};

// Create and export the session storage
export const { getSession, commitSession, destroySession, createSession } =
  createPrismaSessionStorage();

// Helper to get the current user
export async function getUserFromSession(request: Request) {
  const session = await getSession(request);
  const userId = session.get("userId");

  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });
}

// Helper to check if the user is logged in
export async function isUserLoggedIn(request: Request): Promise<boolean> {
  const session = await getSession(request);
  const userId = session.get("userId");

  return Boolean(userId);
}

// Require authentication or redirect
export async function requireUser(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const user = await getUserFromSession(request);

  if (!user) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/sign-in?${searchParams}`);
  }

  return user;
}
