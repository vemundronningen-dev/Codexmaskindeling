import bcrypt from 'bcryptjs';
import { MachineStatus, PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('bruker123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@maskin.no' },
    update: {},
    create: {
      email: 'admin@maskin.no',
      name: 'Admin Bruker',
      passwordHash: adminPassword,
      role: UserRole.ADMIN
    }
  });

  const user = await prisma.user.upsert({
    where: { email: 'bruker@maskin.no' },
    update: {},
    create: {
      email: 'bruker@maskin.no',
      name: 'Ola Nordmann',
      passwordHash: userPassword,
      role: UserRole.USER
    }
  });

  const projectA = await prisma.project.upsert({
    where: { id: 'proj-a' },
    update: {},
    create: {
      id: 'proj-a',
      name: 'Byggeplass A',
      description: 'Midlertidig prosjekt for bygningsarbeid.'
    }
  });

  const projectB = await prisma.project.upsert({
    where: { id: 'proj-b' },
    update: {},
    create: {
      id: 'proj-b',
      name: 'Tunnelprosjekt B',
      description: 'Langvarig tunnel- og infrastrukturprosjekt.'
    }
  });

  await prisma.machine.upsert({
    where: { serialNumber: 'GRV-1001' },
    update: {},
    create: {
      name: 'Gravemaskin 01',
      serialNumber: 'GRV-1001',
      status: MachineStatus.TILDELT,
      projectId: projectA.id,
      responsibleUserId: user.id,
      notes: 'Klar for daglig drift.'
    }
  });

  await prisma.machine.upsert({
    where: { serialNumber: 'KRN-2201' },
    update: {},
    create: {
      name: 'Kran 02',
      serialNumber: 'KRN-2201',
      status: MachineStatus.SERVICE,
      projectId: projectB.id,
      notes: 'Planlagt service denne uken.'
    }
  });

  await prisma.machine.upsert({
    where: { serialNumber: 'TRK-3001' },
    update: {},
    create: {
      name: 'Truck 03',
      serialNumber: 'TRK-3001',
      status: MachineStatus.LEDIG,
      notes: 'Ledig for tildeling.'
    }
  });

  await prisma.machine.upsert({
    where: { serialNumber: 'BRT-4040' },
    update: {},
    create: {
      name: 'Borerigg 04',
      serialNumber: 'BRT-4040',
      status: MachineStatus.UTE_AV_DRIFT,
      notes: 'Avventer reservedeler.'
    }
  });

  console.log('Seed fullført ✅');
  console.log('Admin innlogging: admin@maskin.no / admin123');
  console.log('Bruker innlogging: bruker@maskin.no / bruker123');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
