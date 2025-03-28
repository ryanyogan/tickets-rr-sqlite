import { hash, verify } from "argon2";
import { z } from "zod";
import { prisma } from "./prisma";
import {
  commitSession,
  createSession,
  destroySession,
  getSession,
} from "./session.server";

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
    return {
      success: false,
      errors: { formErrors: ["Incorrect email or password"] },
      message: "Incorrect email or password",
    };
  }

  const validPassword = await verify(user.passwordHash, password);
  if (!validPassword) {
    return {
      success: false,
      errors: { formErrors: ["Incorrect email or password"] },
      message: "Incorrect email or password",
    };
  }

  // Create a new session
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY);
  const session = await createSession(user.id, expiresAt);

  return {
    success: true,
    message: "Successfully signed in",
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  };
}

export async function signUp(request: Request, formData: FormData) {
  const result = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten(),
      message: "Invalid form data",
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
    return {
      success: false,
      errors: { formErrors: ["Either email or username is already in use"] },
      message: "Either email or username is already in use",
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

  return {
    success: true,
    message: "Account created successfully",
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  };
}

export async function signOut(request: Request) {
  const session = await getSession(request);
  return {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  };
}
