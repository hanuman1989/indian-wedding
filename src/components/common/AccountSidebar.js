"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowRight, BookHeart, Couple, Lock, Plus, Users } from '@/components/Icons';
import { useUserAuth } from '@/hooks/useUserAuth';

const accountNavigation = [
  { label: 'Dashboard', href: '/dashboard', icon: Couple },
  { label: 'My Weddings', href: '/my-weddings', icon: BookHeart, ishost: true },
  { label: 'Edit Profile', href: '/profile', icon: Users },
  { label: 'Change Password', href: '/change-password', icon: Lock },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { loading, logout, user } = useUserAuth();
  const displayName = user?.name?.trim() || 'Rahul Sharma';
  const firstName = displayName.split(' ')[0];

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <aside className="border-b border-gold-200/80 bg-white/55 p-5 sm:p-6 lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3 border-b border-gold-200/70 pb-5">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold-100 text-lg font-semibold text-wine-700 ring-4 ring-gold-100/65">
          {firstName.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-ink-soft">Hello,</p>
          <p className="truncate text-sm font-semibold text-wine-700">{displayName}</p>
        </div>
      </div>

      <nav aria-label="Account navigation" className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1">
        {accountNavigation.map(({ label, href, icon: Icon, ishost }) => {
          // Only show the "My Weddings" link if the user is a host
          if (ishost && !user.is_host) {
            return null;
          }

          const isCurrent = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={isCurrent ? 'page' : undefined}
              className={`flex min-h-11 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isCurrent
                  ? 'bg-gold-100 text-wine-700'
                  : 'text-ink-soft hover:bg-gold-100/70 hover:text-wine-700'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className="mt-5 flex min-h-11 w-full items-center gap-3 border-t border-gold-200/70 px-3 pt-5 text-left text-sm font-medium text-wine-700 transition-colors hover:text-wine-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <ArrowRight className="h-4 w-4 rotate-180" />
        {loading ? 'Logging out...' : 'Logout'}
      </button>
    </aside>
  );
}