import Link from 'next/link';
import { Calendar, Leaf, MapPin, MessageCircle, Users, WineGlass } from '@/components/Icons';
import { useEffect, useState } from 'react';
import { useUserAuth } from '@/hooks/useUserAuth'
import { useModal } from '@/hooks/useModal'
import { Modal } from '@/components/ui/modal'
import LoginForm from '@/components/login/LoginForm'
import {
  getAlcoholAvailability,
  getCoupleName,
  getEventCount,
  getGeneralLocation,
  getMainLanguage,
  getWeddingDateRangeParts,
} from './weddingDetailUtils';

function SummaryStat({ Icon, primary, secondary }) {
  return (
    <div className="flex min-w-0 items-start gap-2.5 border-l border-gold-100 pl-3 first:border-l-0 first:pl-0">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-wine-500" />
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold text-ink">{primary}</span>
        {secondary && <span className="block truncate text-xs text-ink-soft">{secondary}</span>}
      </span>
    </div>
  );
}

export default function WeddingSummary({ wedding }) {
  const { isAuthenticated, user } = useUserAuth()
  const { isOpen, openModal, closeModal } = useModal()
  const [title, setTitle] = useState('You Can’t Book Your Own Wedding');
  const [description, setDescription] = useState('You’re the host of this wedding, so you don’t need to book it. Your guests can book and join your wedding from this page.');
  const [isLoginForm, setIsLoginForm] = useState(false);
  const weddingDays = wedding?.wedding_days || [];
  const firstDay = weddingDays[0];
  const food = wedding?.food_observance || 'Not specified';
  const status = wedding?.status ? String(wedding.status).replace(/_/g, ' ') : '';
  const dayCount = weddingDays.length;
  const eventCount = getEventCount(weddingDays);
  const { start, end, isRange } = getWeddingDateRangeParts(weddingDays);


  const handleBecomeHostClick = (event) => {
      if (isAuthenticated && user.id === wedding.wid) {
        event.preventDefault()
        openModal()
      }
      if (!isAuthenticated) {
        setTitle('');
        setDescription('');
        setIsLoginForm(true)
        event.preventDefault()
        openModal()
      }
    }

  return (
    <div className="relative">
      <p className="inline-flex rounded border border-wine-200 bg-wine-50 px-2.5 py-1 text-[11px] font-semibold text-wine-600">Wedding Invitation</p>
      {status && status.toLowerCase() !== 'published' && <p className="mt-3 text-xs font-semibold uppercase text-gold-600">Preview: {status}</p>}

      <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-wine-700 sm:text-md">{wedding.couple_name}</h1>
      <p className="mt-2 text-base font-semibold text-ink">Two Families, One Beautiful Journey</p>
      <p className="mt-3 max-w-xl text-sm leading-6 text-ink-soft">We warmly invite you to be a part of our special celebration and share in the joy, love, and blessings as we begin this new chapter together.</p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <SummaryStat Icon={Calendar} primary={start} secondary={isRange ? `to ${end}` : null} />
        <SummaryStat Icon={MapPin} primary={getGeneralLocation(firstDay)} secondary={firstDay?.country || 'India'} />
        <SummaryStat Icon={Users} primary={`${dayCount} ${dayCount === 1 ? 'Day' : 'Days'}`} secondary={`${eventCount} ${eventCount === 1 ? 'Event' : 'Events'}`} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-gold-100 pt-4">
        <SummaryStat Icon={Leaf} primary={food} secondary="Food" />
        <SummaryStat Icon={MessageCircle} primary={getMainLanguage(wedding)} secondary="Language" />
        <SummaryStat Icon={WineGlass} primary={getAlcoholAvailability(wedding)} secondary="Alcohol" />
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
          <Link 
            href={`/wedding/${wedding.id}/booking`} 
            onClick={handleBecomeHostClick}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-wine-700 px-6 text-sm font-semibold text-cream-50 shadow-sm transition-colors hover:bg-wine-600 focus:outline-none focus:ring-2 focus:ring-wine-300">
            <Users className="h-4 w-4" />
            Join Our Wedding
            <span aria-hidden="true">&rarr;</span>
          </Link>
        <p className="font-display text-sm italic leading-5 text-wine-400">Celebrating Love<br />Culture &amp; Togetherness</p>
      </div>
       <Modal isOpen={isOpen} onClose={closeModal} size={isLoginForm ? '3xl' : 'sm'} noPadding title={title} description={description}>
        {isLoginForm && (<LoginForm onClose={closeModal} />)}
      </Modal>
    </div>
  );
}