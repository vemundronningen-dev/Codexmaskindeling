import Link from 'next/link';
import { UserRole } from '@prisma/client';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { statusColor, statusLabel } from '@/lib/constants';
import { updateMachineAssignment } from '../actions';
import { MachineKanban } from '@/components/machine-kanban';

export default async function MachinesPage({
  searchParams
}: {
  searchParams?: { view?: string };
}) {
  const session = await requireSession();
  const isAdmin = session.role === UserRole.ADMIN;
  const view = searchParams?.view === 'kanban' ? 'kanban' : 'table';

  const [machines, users, projects] = await Promise.all([
    prisma.machine.findMany({
      include: {
        project: { select: { name: true } },
        responsibleUser: { select: { id: true, name: true } }
      },
      orderBy: { name: 'asc' }
    }),
    prisma.user.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.project.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } })
  ]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Maskiner</h1>
        <div className="space-x-2">
          <Link
            href="/machines"
            className={`rounded-md px-3 py-2 text-sm ${view === 'table' ? 'bg-brand text-white' : 'bg-white border border-slate-300'}`}
          >
            Tabell
          </Link>
          <Link
            href="/machines?view=kanban"
            className={`rounded-md px-3 py-2 text-sm ${view === 'kanban' ? 'bg-brand text-white' : 'bg-white border border-slate-300'}`}
          >
            Kanban
          </Link>
        </div>
      </div>

      {view === 'kanban' ? (
        <MachineKanban machines={machines} />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left text-slate-700">
              <tr>
                <th className="px-3 py-2">Maskin</th>
                <th className="px-3 py-2">Serienummer</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Prosjekt</th>
                <th className="px-3 py-2">Ansvarlig</th>
                {isAdmin ? <th className="px-3 py-2">Handling</th> : null}
              </tr>
            </thead>
            <tbody>
              {machines.map((machine) => (
                <tr key={machine.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-medium">{machine.name}</td>
                  <td className="px-3 py-2">{machine.serialNumber}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-1 text-xs ${statusColor[machine.status]}`}>
                      {statusLabel[machine.status]}
                    </span>
                  </td>
                  <td className="px-3 py-2">{machine.project?.name ?? 'Ingen'}</td>
                  <td className="px-3 py-2">{machine.responsibleUser?.name ?? 'Ingen'}</td>
                  {isAdmin ? (
                    <td className="px-3 py-2">
                      <form action={updateMachineAssignment} className="flex flex-wrap items-center gap-2">
                        <input type="hidden" name="machineId" value={machine.id} />
                        <select name="status" defaultValue={machine.status}>
                          {Object.entries(statusLabel).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                        <select name="projectId" defaultValue={machine.projectId ?? ''}>
                          <option value="">Ingen prosjekt</option>
                          {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                              {project.name}
                            </option>
                          ))}
                        </select>
                        <select name="responsibleUserId" defaultValue={machine.responsibleUserId ?? ''}>
                          <option value="">Ingen ansvarlig</option>
                          {users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                        <button type="submit" className="bg-brand text-white hover:bg-brand-dark">
                          Lagre
                        </button>
                      </form>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
