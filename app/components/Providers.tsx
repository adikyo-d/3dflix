"use client";

import { SessionProvider } from "next-auth/react";

// Wrapper ini diperlukan karena SessionProvider adalah Client Component
// tapi layout.tsx adalah Server Component di Next.js App Router
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
