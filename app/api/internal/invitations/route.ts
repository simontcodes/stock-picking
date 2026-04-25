import { NextRequest, NextResponse } from "next/server";
import { createInvitation } from "@/lib/auth/invitations";
import { buildAppUrl } from "@/lib/auth/app-url";
import { prisma } from "@/lib/db/prisma";
import { isAuthorizedInternalRequest } from "@/lib/api/internal-auth";

export async function POST(request: NextRequest) {
  if (!isAuthorizedInternalRequest(request)) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized.",
      },
      { status: 401 },
    );
  }

  try {
    const body = (await request.json()) as {
      email?: string;
      invitedByEmail?: string;
      expiresInDays?: number;
    };

    if (!body.email || typeof body.email !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Email is required.",
        },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email.trim().toLowerCase(),
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "That email already has an account.",
        },
        { status: 409 },
      );
    }

    let invitedById: string | null = null;

    if (body.invitedByEmail) {
      const inviter = await prisma.user.findUnique({
        where: {
          email: body.invitedByEmail.trim().toLowerCase(),
        },
        select: {
          id: true,
        },
      });

      invitedById = inviter?.id ?? null;
    }

    const invitation = await createInvitation({
      email: body.email,
      invitedById,
      expiresInDays:
        typeof body.expiresInDays === "number" ? body.expiresInDays : undefined,
    });
    const inviteUrl = buildAppUrl(invitation.invitePath, request.nextUrl.origin);

    return NextResponse.json({
      success: true,
      data: {
        id: invitation.id,
        email: invitation.email,
        expiresAt: invitation.expiresAt.toISOString(),
        invitePath: invitation.invitePath,
        inviteUrl,
      },
    });
  } catch (error) {
    console.error("POST /api/internal/invitations failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create invitation.",
      },
      { status: 500 },
    );
  }
}
