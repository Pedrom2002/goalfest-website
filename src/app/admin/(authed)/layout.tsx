import { redirect } from "next/navigation";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supa = await supabaseServer();
  const {
    data: { user },
  } = await supa.auth.getUser();

  if (!user?.email) redirect("/admin/login");

  const admin = supabaseAdmin();
  const { data: isAdmin } = await admin
    .from("admins")
    .select("email")
    .eq("email", user.email)
    .maybeSingle();

  if (!isAdmin) redirect("/admin/login?err=forbidden");

  return (
    <div className="min-h-dvh bg-bg-primary text-text-primary">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-bg-primary/80 backdrop-blur-md px-6 py-3">
        <Link href="/admin" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-[#5ea63b] font-black tracking-[.22em] uppercase text-sm">GOALFEST</span>
          <span className="text-white/30 text-xs">·</span>
          <span className="text-white/50 tracking-[.18em] uppercase text-xs">admin</span>
        </Link>
        <nav className="flex items-center gap-1">
          {[
            { href: "/admin/invites", label: "Convites" },
            { href: "/admin/acreditacoes", label: "Acreditações" },
            { href: "/admin/scan", label: "Scan" },
            { href: "/admin/audit", label: "Audit" },
            { href: "/admin/account", label: "Conta" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 rounded-full text-xs tracking-[.14em] uppercase opacity-60 hover:opacity-100 hover:bg-white/5 transition-all"
            >
              {label}
            </Link>
          ))}
          <form action="/api/admin/signout" method="post">
            <button className="px-3 py-1.5 rounded-full text-xs tracking-[.14em] uppercase opacity-60 hover:opacity-100 hover:bg-white/5 transition-all">
              Sair
            </button>
          </form>
        </nav>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
