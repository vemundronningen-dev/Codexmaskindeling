import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

const SESSION_COOKIE = 'maskin_session';

type SessionPayload = {
  userId: string;
  role: UserRole;
  name: string;
};

function decodeSession(value: string | undefined): SessionPayload | null {
  if (!value) return null;

  try {
    const raw = Buffer.from(value, 'base64url').toString('utf8');
    return JSON.parse(raw) as SessionPayload;
  } catch {
    return null;
  }
}

function encodeSession(payload: SessionPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { ok: false, message: 'Fant ikke bruker.' };
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return { ok: false, message: 'Feil passord.' };
  }

  const payload: SessionPayload = {
    userId: user.id,
    role: user.role,
    name: user.name
  };

  cookies().set(SESSION_COOKIE, encodeSession(payload), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 12
  });

  return { ok: true };
}

export async function logout() {
  cookies().delete(SESSION_COOKIE);
}

export async function getSession() {
  const store = cookies();
  const cookie = store.get(SESSION_COOKIE)?.value;
  return decodeSession(cookie);
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireSession();
  if (session.role !== UserRole.ADMIN) {
    redirect('/');
  }
  return session;
}
