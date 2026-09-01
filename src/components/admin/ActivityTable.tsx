import { ScrollText } from "lucide-react";
import type { AuditRow } from "@/lib/audit";

/*
 * Read-only audit log viewer. Normal admins cannot edit or delete entries here;
 * the log is append-only (writes happen server-side via logAudit()).
 */

function when(s: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(s.replace(" ", "T")));
  } catch {
    return s;
  }
}

export function ActivityTable({ rows }: { rows: AuditRow[] }) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-dark-muted">
          <ScrollText className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <div>
          <h1 className="font-display text-2xl font-medium tracking-[-0.02em] text-white">
            Activity
          </h1>
          <p className="text-sm text-dark-faint">
            A read-only record of administrative actions.
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-white/10 px-4 py-14 text-center">
          <p className="text-sm text-dark-muted">No activity recorded yet</p>
          <p className="mt-1 text-xs text-dark-faint">
            Sign-ins, content edits and deletions will appear here.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-2">
          {rows.map((r) => (
            <li
              key={r.id}
              className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3.5"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/40" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="text-sm text-white">{r.summary ?? r.action}</p>
                  <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wide text-dark-muted">
                    {r.action}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-dark-faint">
                  {r.actor_email ?? "Unknown"} · {when(r.created_at)}
                  {r.ip ? ` · ${r.ip}` : ""}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
