"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions";
import { Button, Field, TextInput } from "@/components/admin/ui";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-logo text-2xl font-bold tracking-tight text-white">
            Loopsoop
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-neutral-500">
            Admin Panel
          </p>
        </div>

        <form
          action={action}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl"
        >
          <h1 className="font-display text-xl font-medium text-white">Sign in</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Manage the Loopsoop portfolio.
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
              className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
            >
              {state.error}
            </p>
          )}

          <Button type="submit" disabled={pending} className="mt-6 w-full">
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
