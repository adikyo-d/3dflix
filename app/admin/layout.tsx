import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: "fa-chart-pie" },
  { label: "Film", href: "/admin/movies", icon: "fa-film" },
  { label: "Reviews", href: "/admin/reviews", icon: "fa-comments" },
  { label: "Users", href: "/admin/users", icon: "fa-users" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#0c1014] text-white">
      <div className="flex">
        {/* Admin Sidebar */}
        <aside className="w-56 min-h-screen bg-[#14181c] border-r border-[#2c3440] p-4 flex flex-col gap-1">
          <div className="px-3 py-4 mb-4 border-b border-[#2c3440]">
            <h2 className="text-sm font-bold tracking-widest text-[#00e054]">
              ADMIN PANEL
            </h2>
          </div>
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#9ab] hover:text-white hover:bg-[#1c2228] transition-all"
            >
              <i className={`fa-solid ${item.icon} w-4`} />
              {item.label}
            </Link>
          ))}
          <div className="mt-auto pt-4 border-t border-[#2c3440]">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#9ab] hover:text-white transition-all"
            >
              <i className="fa-solid fa-arrow-left text-xs w-4" />
              Kembali ke Site
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 bg-[#0c1014]">{children}</main>
      </div>
    </div>
  );
}
