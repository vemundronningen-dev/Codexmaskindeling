import { MachineStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { statusLabel } from '@/lib/constants';

export default async function HomePage() {
  const [machineCount, userCount, projectCount, availableCount] = await Promise.all([
    prisma.machine.count(),
    prisma.user.count(),
    prisma.project.count(),
    prisma.machine.count({ where: { status: MachineStatus.LEDIG } })
  ]);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Oversikt</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Maskiner" value={machineCount} />
        <StatCard title="Brukere" value={userCount} />
        <StatCard title="Prosjekter" value={projectCount} />
        <StatCard title={statusLabel.LEDIG} value={availableCount} />
      </div>
      <p className="text-sm text-slate-600">
        MVP-løsning med enkel innlogging, rollebasert tilgang og oppfølging av maskinstatus.
      </p>
    </section>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-600">{title}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
