import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// TEMPORARY diagnostic — remove after the DB connection is confirmed.
export const dynamic = "force-dynamic";

const CANDIDATE_HOSTS = [
  process.env.DB_HOST,
  "localhost",
  "127.0.0.1",
  "srv2201.hstgr.io",
  "auth-db2201.hstgr.io",
];

export async function GET() {
  const hosts = [
    ...new Set(CANDIDATE_HOSTS.filter((h): h is string => Boolean(h))),
  ];

  const results = [];
  for (const host of hosts) {
    try {
      const conn = await mysql.createConnection({
        host,
        port: Number(process.env.DB_PORT ?? 3306),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectTimeout: 5000,
      });
      const [rows] = await conn.query(
        "SELECT COUNT(*) AS n FROM portfolio_items",
      );
      await conn.end();
      const n = (rows as { n: number }[])[0]?.n;
      results.push({ host, ok: true, portfolio_count: n });
    } catch (e) {
      const err = e as { code?: string; errno?: number; message?: string };
      results.push({
        host,
        ok: false,
        code: err.code,
        errno: err.errno,
        message: (err.message ?? "").slice(0, 200),
      });
    }
  }

  return NextResponse.json({
    env: {
      DB_HOST: process.env.DB_HOST ?? null,
      DB_PORT: process.env.DB_PORT ?? null,
      DB_USER: process.env.DB_USER ?? null,
      DB_NAME: process.env.DB_NAME ?? null,
      DB_PASSWORD_set: Boolean(process.env.DB_PASSWORD),
      SESSION_SECRET_set: Boolean(process.env.SESSION_SECRET),
    },
    results,
  });
}
