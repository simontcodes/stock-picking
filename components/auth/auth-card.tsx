"use client";

import type React from "react";
import { useActionState, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { signIn, signUp, type AuthFormState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthMode = "sign-in" | "sign-up";

type AuthCardProps = {
  mode: AuthMode;
  invite?: {
    token: string;
    email: string;
  } | null;
  inviteStatus?: "required" | "invalid" | "expired" | "accepted";
};

const initialState: AuthFormState = {};

export function AuthCard({
  mode,
  invite = null,
  inviteStatus,
}: AuthCardProps) {
  const isSignUp = mode === "sign-up";
  const canSubmit = !isSignUp || Boolean(invite);
  const [showInviteOnlyNotice, setShowInviteOnlyNotice] = useState(false);
  const [state, action, pending] = useActionState(
    isSignUp ? signUp : signIn,
    initialState,
  );
  const inviteEmail = state.values?.email ?? invite?.email;
  const inviteToken = state.values?.inviteToken ?? invite?.token ?? "";

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--surface)] text-[var(--text-primary)]">
      <div className="relative flex min-h-screen items-center justify-center px-6 py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(10,188,86,0.16),transparent_30%),radial-gradient(circle_at_80%_12%,rgba(255,139,124,0.08),transparent_26%),linear-gradient(180deg,rgba(16,20,25,0.94),rgba(16,20,25,1))]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        <section className="relative grid w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/8 bg-[linear-gradient(180deg,rgba(24,28,33,0.92),rgba(13,17,23,0.96))] shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:grid-cols-[1.08fr_0.92fr]">
          <div className="hidden min-h-[650px] border-r border-white/6 bg-[radial-gradient(circle_at_top_left,rgba(10,188,86,0.14),transparent_34%),rgba(255,255,255,0.02)] p-8 lg:flex lg:items-center lg:justify-center">
            <div className="flex w-full max-w-[480px] flex-col items-center">
              <Image
                src="/logo.svg"
                alt="Tiqer"
                width={300}
                height={96}
                className="h-20 w-auto"
                priority
              />
              <MarketPulse className="mt-14 w-[min(560px,112%)] max-w-none opacity-58" />
              <p className="mt-5 max-w-[380px] text-center text-[15px] font-medium leading-6 text-white/62">
                Signal-driven stock analysis, watchlists, and alerts in one private workspace.
              </p>
            </div>
          </div>

          <div className="flex min-h-[650px] flex-col p-6 sm:p-8 lg:p-10">
            <div className="mb-10 flex items-center justify-between gap-4 lg:hidden">
              <Image
                src="/logo.svg"
                alt="Tiqer"
                width={112}
                height={38}
                className="h-10 w-auto"
                priority
              />
            </div>

            <div className="my-auto">
              <div className="mb-8">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-200/45">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
                  {isSignUp ? "Start your private workspace" : "Sign in to Tiqer"}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-white/48">
                  {isSignUp
                    ? "Create an account to keep watchlists, saved signal state, and reports isolated from other users."
                    : "Continue to your dashboard with your saved tickers and signal history."}
                </p>
              </div>

              <form action={action} className="space-y-4">
                {isSignUp ? (
                  <InviteBanner inviteStatus={inviteStatus} inviteEmail={inviteEmail} />
                ) : null}

                {isSignUp ? (
                  <Field
                    icon={<UserRound className="h-4 w-4" />}
                    id="name"
                    name="name"
                    label="Name"
                    placeholder="Simon Tang"
                    defaultValue={state.values?.name}
                    error={state.errors?.name?.[0]}
                  />
                ) : null}

                <Field
                  icon={<Mail className="h-4 w-4" />}
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  defaultValue={inviteEmail}
                  error={state.errors?.email?.[0]}
                  readOnly={Boolean(invite)}
                />

                <Field
                  icon={<LockKeyhole className="h-4 w-4" />}
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  placeholder={isSignUp ? "At least 10 characters" : "Password"}
                  error={state.errors?.password?.[0]}
                />

                {isSignUp ? (
                  <input type="hidden" name="inviteToken" value={inviteToken} />
                ) : null}

                {state.message ? (
                  <div className="rounded-[1.1rem] border border-red-400/15 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                    {state.message}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  disabled={pending || !canSubmit}
                  className="h-12 w-full rounded-2xl bg-emerald-400 font-semibold text-black shadow-[0_14px_30px_rgba(10,188,86,0.22)] hover:bg-emerald-300"
                >
                  {pending
                    ? isSignUp
                      ? "Creating..."
                      : "Signing in..."
                    : isSignUp
                      ? "Create Account"
                      : "Sign In"}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </form>

              <div className="mt-6 rounded-[1.25rem] border border-white/8 bg-white/[0.025] px-4 py-4 text-center text-sm text-white/50">
                {isSignUp ? (
                  <>
                    Already have an account?{" "}
                    <Link
                      href="/sign-in"
                      className="font-medium text-emerald-300 transition hover:text-emerald-200"
                    >
                      Sign in
                    </Link>
                  </>
                ) : (
                  <>
                    Need an account?{" "}
                    <button
                      type="button"
                      onClick={() => setShowInviteOnlyNotice(true)}
                      className="font-medium text-emerald-300 transition hover:text-emerald-200"
                    >
                      Sign up
                    </button>
                  </>
                )}
              </div>

              {!isSignUp && showInviteOnlyNotice ? (
                <div className="mt-3 rounded-[1.25rem] border border-amber-300/12 bg-amber-300/[0.08] px-4 py-3 text-sm text-amber-100/80">
                  Registration is invite-only at the moment. Open the sign-up link from your invite email to create an account.
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function MarketPulse({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
    >
      <div className="auth-chart-grid pointer-events-none absolute inset-0 opacity-40" />
      <svg
        viewBox="0 0 460 220"
        className="relative h-auto w-full scale-[1.06]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="authChartPriceStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(72,132,83,0.12)" />
            <stop offset="45%" stopColor="rgba(10,188,86,0.55)" />
            <stop offset="100%" stopColor="rgba(255,139,124,0.42)" />
          </linearGradient>
          <linearGradient id="authChartSignalStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="50%" stopColor="rgba(166,173,183,0.34)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.12)" />
          </linearGradient>
          <linearGradient id="authChartFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(10,188,86,0.08)" />
            <stop offset="100%" stopColor="rgba(10,188,86,0)" />
          </linearGradient>
          <linearGradient id="authChartBullishMarker" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(10,188,86,0.85)" />
            <stop offset="100%" stopColor="rgba(10,188,86,0.35)" />
          </linearGradient>
          <linearGradient id="authChartBearishMarker" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,139,124,0.8)" />
            <stop offset="100%" stopColor="rgba(255,139,124,0.34)" />
          </linearGradient>
          <filter id="authChartGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d="M18 182 L58 168 L92 171 L126 148 L164 156 L204 126 L238 132 L274 108 L308 116 L344 84 L382 91 L442 44"
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M18 182 L58 168 L92 171 L126 148 L164 156 L204 126 L238 132 L274 108 L308 116 L344 84 L382 91 L442 44 L442 202 L18 202 Z"
          fill="url(#authChartFill)"
          className="auth-chart-fill"
        />
        <path
          d="M18 166 L58 172 L92 160 L126 156 L164 144 L204 134 L238 118 L274 122 L308 104 L344 96 L382 74 L442 64"
          fill="none"
          stroke="url(#authChartSignalStroke)"
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="auth-chart-signal-line"
          pathLength="100"
        />
        <path
          d="M18 182 L58 168 L92 171 L126 148 L164 156 L204 126 L238 132 L274 108 L308 116 L344 84 L382 91 L442 44"
          fill="none"
          stroke="url(#authChartPriceStroke)"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#authChartGlow)"
          className="auth-chart-line"
          pathLength="100"
        />

        <g className="auth-chart-marker auth-chart-marker-bullish">
          <rect
            x="119"
            y="149"
            width="10"
            height="10"
            rx="2"
            transform="rotate(45 124 154)"
            fill="url(#authChartBullishMarker)"
          />
        </g>
        <g className="auth-chart-marker auth-chart-marker-bearish">
          <rect
            x="268"
            y="110"
            width="10"
            height="10"
            rx="2"
            transform="rotate(45 273 115)"
            fill="url(#authChartBearishMarker)"
          />
        </g>
        <g className="auth-chart-marker auth-chart-marker-bullish">
          <rect
            x="377"
            y="78"
            width="10"
            height="10"
            rx="2"
            transform="rotate(45 382 83)"
            fill="url(#authChartBullishMarker)"
          />
        </g>

        <g className="auth-chart-fade">
          <circle cx="126" cy="148" r="2.5" fill="rgba(245,247,250,0.24)" />
          <circle cx="204" cy="126" r="2.5" fill="rgba(245,247,250,0.24)" />
          <circle cx="344" cy="84" r="2.5" fill="rgba(245,247,250,0.24)" />
        </g>
      </svg>
    </div>
  );
}

type FieldProps = {
  icon: React.ReactNode;
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder: string;
  defaultValue?: string;
  error?: string;
  readOnly?: boolean;
};

function Field({
  icon,
  id,
  name,
  label,
  type = "text",
  placeholder,
  defaultValue,
  error,
  readOnly = false,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-white/38"
      >
        {label}
      </label>
      <div className="flex h-12 items-center rounded-2xl border border-white/8 bg-white/[0.04] px-3 transition focus-within:border-emerald-400/30 focus-within:ring-3 focus-within:ring-emerald-400/10">
        <span className="mr-3 text-white/35">{icon}</span>
        <Input
          id={id}
          name={name}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          readOnly={readOnly}
          className="h-10 border-0 bg-transparent px-0 text-sm text-white placeholder:text-white/25 focus-visible:border-0 focus-visible:ring-0"
          required
        />
      </div>
      {error ? <p className="mt-2 text-xs text-red-300">{error}</p> : null}
    </div>
  );
}

function InviteBanner({
  inviteStatus,
  inviteEmail,
}: {
  inviteStatus?: "required" | "invalid" | "expired" | "accepted";
  inviteEmail?: string;
}) {
  if (!inviteStatus && inviteEmail) {
    return (
      <div className="rounded-[1.25rem] border border-emerald-400/14 bg-emerald-400/[0.08] px-4 py-3 text-sm text-emerald-100/85">
        This invite is reserved for <span className="font-medium">{inviteEmail}</span>.
      </div>
    );
  }

  const message =
    inviteStatus === "expired"
      ? "This invite has expired. Request a fresh invite before creating your account."
      : inviteStatus === "accepted"
        ? "This invite was already used. Sign in if the account was created, or request a new invite."
        : inviteStatus === "invalid"
          ? "This invite link is invalid. Use the latest invite you received."
          : "Registration is invite-only. Open the sign-up link from your invite email to continue.";

  return (
    <div className="rounded-[1.25rem] border border-amber-300/12 bg-amber-300/[0.08] px-4 py-3 text-sm text-amber-100/80">
      {message}
    </div>
  );
}
