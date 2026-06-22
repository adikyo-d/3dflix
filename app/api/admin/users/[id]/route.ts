import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/auth-utils";
import pool from "@/app/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const isBanned = body.is_banned ? 1 : 0;

    await pool.execute("UPDATE users SET is_banned = ? WHERE id = ?", [
      isBanned,
      id,
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const { id } = await params;

  try {
    await pool.execute("DELETE FROM reviews WHERE user_id = ?", [id]);
    await pool.execute("DELETE FROM likes WHERE user_id = ?", [id]);
    await pool.execute("DELETE FROM watchlists WHERE user_id = ?", [id]);
    await pool.execute("DELETE FROM users WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
