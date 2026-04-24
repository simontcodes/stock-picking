"use client";

import type React from "react";
import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { signIn, signUp, type AuthFormState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthMode = "sign-in" | "sign-up";

type AuthCardProps = {
  mode: AuthMode;
};

const initialState: AuthFormState = {};

export function AuthCard({ mode }: AuthCardProps) {
  const isSignUp = mode === "sign-up";
  const [state, action, pending] = useActionState(
    isSignUp ? signUp : signIn,
    initialState,
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--surface)] text-[var(--text-primary)]">
      <div className="relative flex min-h-screen items-center justify-center px-6 py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(10,188,86,0.16),transparent_30%),radial-gradient(circle_at_80%_12%,rgba(255,139,124,0.08),transparent_26%),linear-gradient(180deg,rgba(16,20,25,0.94),rgba(16,20,25,1))]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        <section className="relative grid w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/8 bg-[linear-gradient(180deg,rgba(24,28,33,0.92),rgba(13,17,23,0.96))] shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:grid-cols-[1.08fr_0.92fr]">
          <div className="hidden min-h-[650px] border-r border-white/6 bg-[radial-gradient(circle_at_top_left,rgba(10,188,86,0.14),transparent_34%),rgba(255,255,255,0.02)] p-8 lg:flex lg:flex-col">
            <Image
              src="/logo.svg"
              alt="Tiqer"
              width={132}
              height={44}
              className="h-11 w-auto"
              priority
            />

            <div className="mt-auto">
              <div className="mb-6 inline-flex rounded-full border border-emerald-400/14 bg-emerald-400/[0.08] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-emerald-200/70">
                Private Signal Desk
              </div>
              <h1 className="max-w-xl text-5xl font-semibold leading-[0.96] tracking-[-0.04em] text-white">
                Your watchlist, signals, and alert state stay tied to you.
              </h1>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {["Scoped lists", "Saved signals", "Private sessions"].map(
                  (label) => (
                    <div
                      key={label}
                      className="rounded-[1.25rem] border border-white/8 bg-white/[0.035] px-4 py-3"
                    >
                      <div className="text-[11px] uppercase tracking-[0.16em] text-white/35">
                        Tiqer
                      </div>
                      <div className="mt-2 text-sm font-medium text-white/78">
                        {label}
                      </div>
                    </div>
                  ),
                )}
              </div>
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
                  defaultValue={state.values?.email}
                  error={state.errors?.email?.[0]}
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

                {state.message ? (
                  <div className="rounded-[1.1rem] border border-red-400/15 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                    {state.message}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  disabled={pending}
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
                {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
                <Link
                  href={isSignUp ? "/sign-in" : "/sign-up"}
                  className="font-medium text-emerald-300 transition hover:text-emerald-200"
                >
                  {isSignUp ? "Sign in" : "Create one"}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
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
          className="h-10 border-0 bg-transparent px-0 text-sm text-white placeholder:text-white/25 focus-visible:border-0 focus-visible:ring-0"
          required
        />
      </div>
      {error ? <p className="mt-2 text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
