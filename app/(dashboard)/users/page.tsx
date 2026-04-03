import { UserRole } from '@prisma/client';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createUser } from '../actions';
import { roleLabel } from '@/lib/constants';

export default async function UsersPage() {
  const session = await requireSession();
  const isAdmin = session.role === UserRole.ADMIN;

  const users = await prisma.user.findMany({
    include: { _count: { select: { machines: true } } },
    orderBy: { name: 'asc' }
  });

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Brukere</h1>

      {isAdmin ? (
        <form action={createUser} className="grid gap-2 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-4">
          <input name="name" placeholder="Navn" required />
          <input name="email" placeholder="E-post" type="email" required />
          <select name="role" defaultValue="USER">
            <option value="USER">Bruker</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit" className="bg-brand text-white hover:bg-brand-dark">
            Opprett bruker
          </button>
        </form>
      ) : null}

      <div className="rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="px-3 py-2">Navn</th>
              <th className="px-3 py-2">E-post</th>
              <th className="px-3 py-2">Rolle</th>
              <th className="px-3 py-2">Ansvar for</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-100">
                <td className="px-3 py-2 font-medium">{user.name}</td>
                <td className="px-3 py-2">{user.email}</td>
                <td className="px-3 py-2">{roleLabel[user.role]}</td>
                <td className="px-3 py-2">{user._count.machines} maskiner</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
