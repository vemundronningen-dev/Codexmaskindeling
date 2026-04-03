import Link from 'next/link';
import { clsx } from 'clsx';

export function NavLink({
  href,
  label,
  active
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        'rounded-md px-3 py-2 text-sm font-medium',
        active ? 'bg-brand text-white' : 'text-slate-700 hover:bg-slate-100'
      )}
    >
      {label}
    </Link>
  );
}
