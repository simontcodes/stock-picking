import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/db/prisma";

const DEFAULT_INVITE_EXPIRY_DAYS = 7;

export type InviteLookupResult =
  | {
      ok: true;
      email: string;
      invitationId: string;
    }
  | {
      ok: false;
      reason: "missing" | "invalid" | "expired" | "accepted";
    };

export function hashInviteToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function getInvitationForToken(
  rawToken: string | null | undefined,
): Promise<InviteLookupResult> {
  const token = rawToken?.trim();

  if (!token) {
    return { ok: false, reason: "missing" };
  }

  const invitation = await prisma.invitation.findUnique({
    where: {
      tokenHash: hashInviteToken(token),
    },
    select: {
      id: true,
      email: true,
      expiresAt: true,
      acceptedAt: true,
    },
  });

  if (!invitation) {
    return { ok: false, reason: "invalid" };
  }

  if (invitation.acceptedAt) {
    return { ok: false, reason: "accepted" };
  }

  if (invitation.expiresAt <= new Date()) {
    return { ok: false, reason: "expired" };
  }

  return {
    ok: true,
    email: invitation.email,
    invitationId: invitation.id,
  };
}

export async function createInvitation(input: {
  email: string;
  invitedById?: string | null;
  expiresInDays?: number;
}) {
  const email = normalizeEmail(input.email);
  const expiresInDays = Math.max(1, Math.min(input.expiresInDays ?? DEFAULT_INVITE_EXPIRY_DAYS, 30));
  const rawToken = randomBytes(32).toString("base64url");
  const invitePath = `/sign-up?invite=${encodeURIComponent(rawToken)}`;
  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

  const invitation = await prisma.invitation.create({
    data: {
      email,
      invitedById: input.invitedById ?? null,
      tokenHash: hashInviteToken(rawToken),
      expiresAt,
    },
    select: {
      id: true,
      email: true,
      expiresAt: true,
      createdAt: true,
    },
  });

  return {
    ...invitation,
    rawToken,
    invitePath,
  };
}
