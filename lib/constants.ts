import { MachineStatus, UserRole } from '@prisma/client';

export const statusLabel: Record<MachineStatus, string> = {
  LEDIG: 'Ledig',
  TILDELT: 'Tildelt',
  SERVICE: 'Service',
  UTE_AV_DRIFT: 'Ute av drift'
};

export const roleLabel: Record<UserRole, string> = {
  ADMIN: 'Admin',
  USER: 'Bruker'
};

export const statusColor: Record<MachineStatus, string> = {
  LEDIG: 'bg-emerald-100 text-emerald-800',
  TILDELT: 'bg-blue-100 text-blue-800',
  SERVICE: 'bg-amber-100 text-amber-800',
  UTE_AV_DRIFT: 'bg-rose-100 text-rose-800'
};
