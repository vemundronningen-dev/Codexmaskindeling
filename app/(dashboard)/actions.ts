'use server';

import { UserRole, MachineStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { requireAdmin, requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function updateMachineAssignment(formData: FormData) {
  const session = await requireSession();
  if (session.role !== UserRole.ADMIN) {
    return;
  }

  const machineId = String(formData.get('machineId'));
  const responsibleUserId = String(formData.get('responsibleUserId') ?? '');
  const projectId = String(formData.get('projectId') ?? '');
  const status = String(formData.get('status')) as MachineStatus;

  await prisma.machine.update({
    where: { id: machineId },
    data: {
      status,
      projectId: projectId || null,
      responsibleUserId: responsibleUserId || null
    }
  });

  revalidatePath('/machines');
  revalidatePath('/machines/available');
}

export async function createProject(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get('name') ?? '');
  const description = String(formData.get('description') ?? '');

  if (!name.trim()) return;

  await prisma.project.create({
    data: { name: name.trim(), description: description.trim() || null }
  });

  revalidatePath('/projects');
}

export async function createUser(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get('name') ?? '');
  const email = String(formData.get('email') ?? '');
  const role = String(formData.get('role') ?? 'USER') as UserRole;

  if (!name.trim() || !email.trim()) return;

  await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      passwordHash: '$2a$10$5n7ATJ5mRrU2C2SM0f6OwuqQYwW8lm2Sleqrs9jwELyhl725LLJoK'
    }
  });

  revalidatePath('/users');
}
