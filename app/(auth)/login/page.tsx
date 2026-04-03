import { redirect } from 'next/navigation';
import { login, getSession } from '@/lib/auth';

export default async function LoginPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  const session = await getSession();
  if (session) {
    redirect('/');
  }

  async function loginAction(formData: FormData) {
    'use server';

    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    const result = await login(email, password);

    if (!result.ok) {
      const errorMessage = result.message ?? 'Ukjent feil ved innlogging.';
      redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
    }

    redirect('/');
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <div className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold">Maskinoversikt</h1>
        <p className="mb-6 text-sm text-slate-600">Logg inn for å fortsette.</p>
        {searchParams?.error ? (
          <p className="mb-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{searchParams.error}</p>
        ) : null}
        <form action={loginAction} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">E-post</label>
            <input name="email" type="email" required className="w-full" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Passord</label>
            <input name="password" type="password" required className="w-full" />
          </div>
          <button type="submit" className="w-full bg-brand text-white hover:bg-brand-dark">
            Logg inn
          </button>
        </form>
        <p className="mt-4 text-xs text-slate-500">
          Demo: admin@maskin.no / admin123 eller bruker@maskin.no / bruker123
        </p>
      </div>
    </main>
  );
}
