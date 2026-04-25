"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getInvitationForToken, hashInviteToken } from "@/lib/auth/invitations";
import { createAuthSession, deleteCurrentAuthSession } from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/db/prisma";

export type AuthFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    invite?: string[];
  };
  message?: string;
  values?: {
    name?: string;
    email?: string;
    inviteToken?: string;
  };
};

const signUpSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.string().trim().email("Enter a valid email address.").toLowerCase(),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters.")
    .regex(/[A-Za-z]/, "Password must include a letter.")
    .regex(/[0-9]/, "Password must include a number."),
  inviteToken: z.string().trim().min(1, "A valid invite is required."),
});

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").toLowerCase(),
  password: z.string().min(1, "Password is required."),
});

export async function signUp(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    inviteToken: formData.get("inviteToken"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      values: {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        inviteToken: String(formData.get("inviteToken") ?? ""),
      },
    };
  }

  const { name, email, password, inviteToken } = parsed.data;
  const invitation = await getInvitationForToken(inviteToken);

  if (!invitation.ok || invitation.email !== email) {
    return {
      message: "This invite is invalid or can no longer be used.",
      values: { name, email, inviteToken },
    };
  }

  try {
    const passwordHash = await hashPassword(password);

    const user = await prisma.$transaction(async (tx) => {
      const activeInvitation = await tx.invitation.findUnique({
        where: {
          tokenHash: hashInviteToken(inviteToken),
        },
        select: {
          id: true,
          email: true,
          expiresAt: true,
          acceptedAt: true,
        },
      });

      if (
        !activeInvitation ||
        activeInvitation.acceptedAt ||
        activeInvitation.expiresAt <= new Date() ||
        activeInvitation.email !== email
      ) {
        throw new Error("INVITE_INVALID");
      }

      const createdUser = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          watchlists: {
            create: {
              name: "My Watchlist",
              isDefault: true,
            },
          },
        },
        select: {
          id: true,
        },
      });

      await tx.invitation.update({
        where: {
          id: activeInvitation.id,
        },
        data: {
          acceptedAt: new Date(),
        },
      });

      return createdUser;
    });

    await createAuthSession(user.id);
  } catch (error) {
    if (error instanceof Error && error.message === "INVITE_INVALID") {
      return {
        message: "This invite is invalid or can no longer be used.",
        values: { name, email, inviteToken },
      };
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        message: "An account with this email already exists.",
        values: { name, email, inviteToken },
      };
    }

    console.error("signUp failed:", error);
    return {
      message: "Unable to create your account right now.",
      values: { name, email, inviteToken },
    };
  }

  redirect("/");
}

export async function signIn(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      values: {
        email: String(formData.get("email") ?? ""),
      },
    };
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      passwordHash: true,
    },
  });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return {
      message: "Email or password is incorrect.",
      values: { email },
    };
  }

  await createAuthSession(user.id);
  redirect("/");
}

export async function signOut(): Promise<void> {
  await deleteCurrentAuthSession();
  redirect("/sign-in");
}
