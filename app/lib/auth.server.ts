import { hash, verify } from "argon2";
import { z } from "zod";
import { prisma } from "./prisma";
import {
  commitSession,
  createSession,
  destroySession,
  getSession,
} from "./session.server";
import { createToast } from "./toast.server";

// Validation schemas
export const signInSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).max(191).email(),
  password: z.string().min(6).max(191),
});

export const signUpSchema = z
  .object({
    username: z
      .string()
      .min(1)
      .max(191)
      .refine(
        (value) => !value.includes(" "),
        "Username cannot contain spaces"
      ),
    email: z.string().min(1, { message: "Email is required" }).max(191).email(),
    password: z.string().min(6).max(191),
    confirmPassword: z.string().min(6).max(191),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

// Session expiry time (30 days)
const SESSION_EXPIRY = 1000 * 60 * 60 * 24 * 30;

// Authentication functions
export async function signIn(request: Request, formData: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten(),
      message: "Invalid form data",
    };
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const toastCookie = await createToast("Invalid email or password", "error");

    return {
      success: false,
      errors: { formErrors: ["Incorrect email or password"] },
      message: "Incorrect email or password",
      headers: {
        "Set-Cookie": toastCookie,
      },
    };
  }

  const validPassword = await verify(user.passwordHash, password);
  if (!validPassword) {
    const toastCookie = await createToast("Invalid email or password", "error");

    return {
      success: false,
      errors: { formErrors: ["Incorrect email or password"] },
      message: "Incorrect email or password",
      headers: {
        "Set-Cookie": toastCookie,
      },
    };
  }

  // Create a new session
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY);
  const session = await createSession(user.id, expiresAt);

  const toastCookie = await createToast(
    `Welcome back, ${user.username}!`,
    "success"
  );

  const cookieHeader = await commitSession(session);

  const headers = new Headers();
  headers.append("Set-Cookie", cookieHeader);
  headers.append("Set-Cookie", toastCookie);

  return {
    success: true,
    message: "Successfully signed in",
    headers,
  };
}

export async function signUp(request: Request, formData: FormData) {
  const result = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    const toastCookie = await createToast(
      "Please check your registration details",
      "error"
    );

    return {
      success: false,
      errors: result.error.flatten(),
      message: "Invalid form data",
      headers: {
        "Set-Cookie": toastCookie,
      },
    };
  }

  const { username, email, password } = result.data;

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (existingUser) {
    const toastCookie = await createToast(
      "Username or email already in use",
      "error"
    );

    return {
      success: false,
      errors: { formErrors: ["Either email or username is already in use"] },
      message: "Either email or username is already in use",
      headers: {
        "Set-Cookie": toastCookie,
      },
    };
  }

  // Create user
  const passwordHash = await hash(password);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
    },
  });

  // Create a new session
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY);
  const session = await createSession(user.id, expiresAt);

  const toastCookie = await createToast(
    `Welcome, ${username}! Your account has been created.`,
    "success"
  );

  const cookieHeader = await commitSession(session);
  const headers = new Headers();
  headers.append("Set-Cookie", cookieHeader);
  headers.append("Set-Cookie", toastCookie);

  return {
    success: true,
    message: "Account created successfully",
    headers,
  };
}

export async function signOut(request: Request) {
  const session = await getSession(request);
  const toastCookie = await createToast("You have been signed out", "info");

  const headers = new Headers();
  headers.append("Set-Cookie", await destroySession(session));
  headers.append("Set-Cookie", toastCookie);

  return {
    headers,
  };
}
