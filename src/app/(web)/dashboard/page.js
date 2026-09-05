"use client";

import Image from 'next/image';
import Link from 'next/link';
import AccountSidebar from '@/components/common/AccountSidebar';
import Loader from '@/components/common/Loader';
import {
  ArrowRight,
  Calendar,
  Lock,
  MapPin,
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
    href: '/reset-password',
    icon: Lock,
  },
  {
    title: 'My Bookings',
    description: 'View and manage your bookings',
    href: '/my-weddings',
    icon: Calendar,
  },
];

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="font-display text-xl font-bold text-wine-700 sm:text-2xl">{children}</h2>
      <span aria-hidden="true" className="flex items-center gap-1 text-gold-500">
        <span className="h-px w-5 bg-current" />
        <span className="h-2 w-2 rotate-45 border border-current" />
        <span className="h-px w-5 bg-current" />
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const { isAuthorized } = useProtectedRoute('frontend');
  const { user } = useUserAuth();
  const displayName = user?.name?.trim() || "";
  const firstName = displayName.split(' ')[0];

  if (!isAuthorized) {
    return <Loader />;
  }

  return (
    <section className="relative isolate overflow-hidden bg-cream-50 py-8 sm:py-10 lg:py-12">
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
            <div className="grid items-center gap-6 border-b border-gold-200/80 pb-7 md:grid-cols-[minmax(0,1fr)_250px]">
              <div>
                <p className="text-sm font-medium text-gold-600">Your wedding space</p>
                <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-wine-700 sm:text-4xl">
                  Welcome back, {firstName}!
                </h1>
                <p className="mt-3 max-w-md text-sm leading-6 text-ink-soft sm:text-base">
                  Manage your bookings and account details from your dashboard.
                </p>
              </div>

              <div className="relative mx-auto h-36 w-full max-w-[250px] overflow-hidden border border-gold-200/70 bg-gold-100/40 sm:h-40">
                <Image
                  src="/images/bg.png"
                  alt="Wedding mandap decorated with flowers"
                  fill
                  sizes="(min-width: 768px) 250px, 100vw"
                  className="object-cover object-[88%_64%]"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-cream-50/60" />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <SectionTitle>Your Bookings</SectionTitle>
              <Link href="/my-weddings" className="inline-flex items-center gap-2 text-sm font-semibold text-wine-700 transition-colors hover:text-wine-500">
                View all bookings
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <article className="mt-4 grid overflow-hidden border border-gold-200/90 bg-white/80 shadow-sm md:grid-cols-[minmax(190px,0.9fr)_minmax(0,1.25fr)_148px]">
              <div className="relative min-h-48 md:min-h-full">
                <Image
                  src="/images/bg.png"
                  alt="A floral wedding mandap"
                  fill
                  sizes="(min-width: 768px) 32vw, 100vw"
                  className="object-cover object-[88%_62%]"
                />
                <span className="absolute left-3 top-3 rounded-sm bg-green-700 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                  Confirmed
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-display text-2xl font-bold text-wine-700">Amit &amp; Sneha</h3>
                <dl className="mt-4 grid gap-2 text-sm text-ink-soft">
                  <div className="flex items-center gap-2">
                    <dt className="sr-only">Date</dt>
                    <Calendar className="h-4 w-4 text-wine-500" />
                    <dd>10 Oct 2025</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <dt className="sr-only">Time</dt>
                    <span aria-hidden="true" className="grid h-4 w-4 place-items-center rounded-full border border-wine-500 text-[8px] text-wine-500">o</span>
                    <dd>07:00 PM onwards</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-wine-500" />
                    <dd>Udaipur Palace, Rajasthan</dd>
                  </div>
                </dl>
                <p className="mt-5 border-t border-gold-200/70 pt-3 text-xs font-medium text-ink-soft">
                  Booking ID: IW20251008
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-gold-200/70 bg-gold-100/35 p-5 md:flex-col md:justify-center md:border-l md:border-t-0">
                <div className="text-center text-wine-700">
                  <Users className="mx-auto h-6 w-6 text-gold-600" />
                  <p className="mt-1 text-xs font-medium text-ink-soft">2 Guests</p>
                </div>
                <Link href="/my-weddings" className="inline-flex min-h-10 items-center justify-center rounded-md bg-wine-700 px-4 text-xs font-semibold text-white transition-colors hover:bg-wine-600">
                  View details
                </Link>
              </div>
            </article>

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