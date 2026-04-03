import { Machine, MachineStatus } from '@prisma/client';
import { statusColor, statusLabel } from '@/lib/constants';

type MachineCard = Machine & {
  project: { name: string } | null;
  responsibleUser: { name: string } | null;
};

export function MachineKanban({ machines }: { machines: MachineCard[] }) {
  const columns: MachineStatus[] = ['LEDIG', 'TILDELT', 'SERVICE', 'UTE_AV_DRIFT'];

  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {columns.map((status) => (
        <div key={status} className="rounded-lg border border-slate-200 bg-white p-3">
          <h2 className="mb-3 text-sm font-semibold">{statusLabel[status]}</h2>
          <div className="space-y-2">
            {machines
              .filter((machine) => machine.status === status)
              .map((machine) => (
                <article key={machine.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <p className="font-medium">{machine.name}</p>
                  <p className="text-xs text-slate-500">{machine.serialNumber}</p>
                  <p className="mt-1 text-xs">Prosjekt: {machine.project?.name ?? 'Ingen'}</p>
                  <p className="text-xs">Ansvarlig: {machine.responsibleUser?.name ?? 'Ingen'}</p>
                  <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs ${statusColor[machine.status]}`}>
                    {statusLabel[machine.status]}
                  </span>
                </article>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
