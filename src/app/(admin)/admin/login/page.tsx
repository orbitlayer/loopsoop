"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions";
import { Button, Field, TextInput } from "@/components/admin/ui";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-logo text-2xl font-bold tracking-[-0.02em] text-white">
            Loopsoop
          </p>
          <p className="mt-2 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-dark-muted">
            Admin Panel
          </p>
        </div>

        <form
          action={action}
          className="rounded-[20px] border border-white/10 bg-dark-surface p-6 shadow-2xl shadow-black/40 sm:p-7"
        >
          <h1 className="font-display text-xl font-medium tracking-[-0.02em] text-white">
            Sign in
          </h1>
          <p className="mt-1 text-sm text-dark-muted">
            Manage the Loopsoop website.
          </p>

          <div className="mt-6 space-y-4">
            <Field label="Email">
              <TextInput
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Password">
              <TextInput
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </Field>
          </div>

          {state?.error && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
            >
              {state.error}
            </p>
          )}

          <Button type="submit" disabled={pending} className="mt-6 w-full">
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-dark-faint">
          Protected area · authorised administrators only
        </p>
      </div>
    </div>
  );
}
