import Link from 'next/link';
import { UserRole } from '@prisma/client';
import { requireSession, logout } from '@/lib/auth';
import { NavLink } from '@/components/nav-link';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();

  async function logoutAction() {
    'use server';
    await logout();
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div>
            <Link href="/" className="text-lg font-semibold">
              Maskinoversikt
            </Link>
            <p className="text-xs text-slate-500">Innlogget som {session.name}</p>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            <NavLink href="/" label="Hjem" active={false} />
            <NavLink href="/machines" label="Maskiner" active={false} />
            <NavLink href="/machines/available" label="Ledige maskiner" active={false} />
            <NavLink href="/projects" label="Prosjekter" active={false} />
            <NavLink href="/users" label="Brukere" active={false} />
            {session.role === UserRole.ADMIN ? (
              <span className="rounded-md bg-blue-100 px-2 py-1 text-xs text-blue-700">Admin</span>
            ) : null}
            <form action={logoutAction}>
              <button type="submit" className="border border-slate-300 text-slate-700 hover:bg-slate-100">
                Logg ut
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
