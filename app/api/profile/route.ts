import { NextResponse } from "next/server";
import { auth } from "@/auth";
import pool from "@/app/lib/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9._ -]+$/;

interface DuplicateUserRow extends RowDataPacket {
  username: string;
  email: string;
}

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Silakan login terlebih dahulu" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const username = String(body.username ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();

    if (username.length < 3 || username.length > 50) {
      return NextResponse.json(
        { error: "Username harus terdiri dari 3 sampai 50 karakter" },
        { status: 400 }
      );
    }

    if (!USERNAME_PATTERN.test(username)) {
      return NextResponse.json(
        { error: "Username mengandung karakter yang tidak diperbolehkan" },
        { status: 400 }
      );
    }

    if (email.length > 100 || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    const [duplicateRows] = await pool.execute<DuplicateUserRow[]>(
      `SELECT username, email
       FROM users
       WHERE id <> ? AND (LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?))
       LIMIT 1`,
      [session.user.id, username, email]
    );

    if (duplicateRows.length > 0) {
      if (duplicateRows[0].username.toLowerCase() === username.toLowerCase()) {
        return NextResponse.json(
          { error: "Username sudah digunakan pengguna lain" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Email sudah digunakan pengguna lain" },
        { status: 409 }
      );
    }

    const [result] = await pool.execute<ResultSetHeader>(
      "UPDATE users SET username = ?, email = ? WHERE id = ?",
      [username, email, session.user.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: { name: username, email },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui profil" },
      { status: 500 }
    );
  }
}
