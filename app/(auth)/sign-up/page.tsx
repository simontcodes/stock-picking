import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { getInvitationForToken } from "@/lib/auth/invitations";
import { getCurrentUser } from "@/lib/auth/session";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  const { invite } = await searchParams;
  const invitation = await getInvitationForToken(invite);

  if (!invitation.ok) {
    return (
      <AuthCard
        mode="sign-up"
        inviteStatus={
          invitation.reason === "missing" ? "required" : invitation.reason
        }
      />
    );
  }

  return (
    <AuthCard
      mode="sign-up"
      invite={{
        token: invite!,
        email: invitation.email,
      }}
    />
  );
}
