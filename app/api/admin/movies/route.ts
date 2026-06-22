import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/auth-utils";
import pool from "@/app/lib/db";

export async function GET(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = 20;
  const offset = (page - 1) * limit;
  const query = searchParams.get("q") || "";

  try {
    const conditions: string[] = [];
    const params: any[] = [];

    if (query) {
      conditions.push("title LIKE ?");
      params.push(`%${query}%`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const [countRows]: any = await pool.execute(
      `SELECT COUNT(*) as total FROM movies ${whereClause}`,
      params,
    );
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit);

    const [movies]: any = await pool.execute(
      `SELECT id, title, release_date, vote_average
       FROM movies ${whereClause}
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    return NextResponse.json({
      results: movies,
      page,
      total_pages: totalPages,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
