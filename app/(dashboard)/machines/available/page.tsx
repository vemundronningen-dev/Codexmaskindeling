import { MachineStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export default async function AvailableMachinesPage() {
  const machines = await prisma.machine.findMany({
    where: { status: MachineStatus.LEDIG },
    include: { project: true },
    orderBy: { name: 'asc' }
  });

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Ledige maskiner</h1>
      <div className="rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="px-3 py-2">Maskin</th>
              <th className="px-3 py-2">Serienummer</th>
              <th className="px-3 py-2">Notat</th>
            </tr>
          </thead>
          <tbody>
            {machines.map((machine) => (
              <tr key={machine.id} className="border-t border-slate-100">
                <td className="px-3 py-2 font-medium">{machine.name}</td>
                <td className="px-3 py-2">{machine.serialNumber}</td>
                <td className="px-3 py-2">{machine.notes ?? '-'}</td>
              </tr>
            ))}
            {machines.length === 0 ? (
              <tr>
                <td className="px-3 py-4 text-slate-500" colSpan={3}>
                  Ingen ledige maskiner akkurat nå.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
