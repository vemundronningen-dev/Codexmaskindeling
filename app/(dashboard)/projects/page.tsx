import { UserRole } from '@prisma/client';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createProject } from '../actions';

export default async function ProjectsPage() {
  const session = await requireSession();
  const isAdmin = session.role === UserRole.ADMIN;

  const projects = await prisma.project.findMany({
    include: { _count: { select: { machines: true } } },
    orderBy: { name: 'asc' }
  });

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Prosjekter</h1>

      {isAdmin ? (
        <form action={createProject} className="grid gap-2 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-3">
          <input name="name" placeholder="Prosjektnavn" required />
          <input name="description" placeholder="Beskrivelse" />
          <button type="submit" className="bg-brand text-white hover:bg-brand-dark">
            Opprett prosjekt
          </button>
        </form>
      ) : null}

      <div className="rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="px-3 py-2">Navn</th>
              <th className="px-3 py-2">Beskrivelse</th>
              <th className="px-3 py-2">Maskiner</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t border-slate-100">
                <td className="px-3 py-2 font-medium">{project.name}</td>
                <td className="px-3 py-2">{project.description ?? '-'}</td>
                <td className="px-3 py-2">{project._count.machines}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
