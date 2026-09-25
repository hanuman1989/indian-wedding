"use client";

import Image from 'next/image';
import Link from 'next/link';
import AccountSidebar from '@/components/common/AccountSidebar';
import Loader from '@/components/common/Loader';
import DashboardWidgets from '@/components/dashboard/DashboardWidgets';
import MyBookingList from '@/components/myBooking/MyBookingList';
import SectionTitle from '@/components/common/SectionTitle';
import {
  ArrowRight,
  Calendar,
  Lock,
  Users,
} from '@/components/Icons';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useUserAuth } from '@/hooks/useUserAuth';

const quickActions = [
  {
    title: 'Edit Profile',
    description: 'Update your personal information',
    href: '/profile',
    icon: Users,
  },
  {
    title: 'Change Password',
    description: 'Update your account password',
    href: '/change-password',
    icon: Lock,
  },
  {
    title: 'My Bookings',
    description: 'View and manage your bookings',
    href: '/bookings',
    icon: Calendar,
  },
];

export default function DashboardPage() {
  const { isAuthorized } = useProtectedRoute('frontend');
  const { user } = useUserAuth();
  const displayName = user?.name?.trim() || "";
  const firstName = displayName.split(' ')[0];

  if (!isAuthorized) {
    return <Loader />;
  }

  return (
    <section className="relative bg-cream-50 py-8 sm:py-10 lg:py-12">
      <Image
        src="/images/bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-center opacity-20"
      />

      <div className="shell">
        <div className="grid overflow-hidden border border-gold-200/90 bg-cream-50/95 shadow-[0_16px_48px_rgba(108,10,34,0.12)] lg:grid-cols-[230px_minmax(0,1fr)]">
          <AccountSidebar />

          <div className="min-w-0 p-5 sm:p-7 lg:p-9">
            <div className="grid items-center gap-6 border-b border-gold-200/80 pb-7 md:grid-cols-[minmax(0,1fr)_250px] mb-7">
              <div>
                <p className="text-sm font-medium text-gold-600">Your wedding space</p>
                <h1 className="mt-2 font-display text-2xl font-bold leading-tight text-wine-700 sm:text-3xl">
                  Welcome back, {firstName}!
                </h1>
                <p className="mt-1 text-sm leading-6 text-ink-soft sm:text-base">
                  Manage your bookings and account details from your dashboard.
                </p>
              </div>

            </div>
            {user.is_host && (<DashboardWidgets />)}

            <MyBookingList isHost={user.is_host} limit={3} />

            <section aria-labelledby="quick-actions-heading" className="mt-8">
              <div id="quick-actions-heading">
                <SectionTitle>Quick Actions</SectionTitle>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {quickActions.map(({ title, description, href, icon: Icon }) => (
                  <Link
                    key={title}
                    href={href}
                    className="group flex min-h-28 items-center gap-3 border border-gold-200/90 bg-white/70 p-4 transition-colors hover:border-gold-400 hover:bg-gold-100/45"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-100 text-wine-700 transition-colors group-hover:bg-wine-700 group-hover:text-gold-100">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-wine-700">{title}</span>
                      <span className="mt-1 block text-xs leading-5 text-ink-soft">{description}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}