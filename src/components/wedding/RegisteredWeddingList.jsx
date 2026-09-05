"use client";

import { useState } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  Calendar,
  MapPin,
  Pencil,
  Photo,
  Trash,
  Users,
} from '@/components/Icons';

const statusStyles = {
  live: 'bg-emerald-700 text-white',
  draft: 'bg-slate-600 text-white',
  ended: 'bg-stone-500 text-white',
};

function Metadata({ children, Icon, label }) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-wine-500" />
      <div className="min-w-0">
        <dt className="sr-only">{label}</dt>
        <dd className="text-xs font-medium leading-5 text-ink">{children}</dd>
      </div>
    </div>
  );
}

function RegisteredWeddingCard({ deletingWeddingId, onDelete, onEdit, wedding }) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const status = wedding.listStatus || 'live';
  const statusLabel = wedding.statusLabel || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <article className="overflow-hidden border border-gold-200/90 bg-white/80 shadow-[0_6px_18px_rgba(108,10,34,0.05)]">
      <div className="grid min-w-0 md:grid-cols-[190px_minmax(0,1fr)]">
        <div className="relative min-h-44 overflow-hidden bg-gold-100/60 md:min-h-full">
          <Image
            src={wedding.image || '/images/bg.png'}
            alt={`Wedding decor for ${wedding.couple}`}
            fill
            sizes="(min-width: 768px) 190px, 100vw"
            className="object-cover"
            style={{ objectPosition: wedding.imagePosition || '75% 70%' }}
          />
          <span className={`absolute left-3 top-3 rounded-sm px-2.5 py-1 text-xs font-semibold shadow-sm ${statusStyles[status]}`}>
            {statusLabel}
          </span>
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-sm bg-black/55 px-2 py-1 text-xs font-medium text-white">
            <Photo className="h-3.5 w-3.5" />
            {wedding.photoCount || 0} Photos
          </span>
        </div>

        <div className="min-w-0 p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="font-display text-2xl font-bold leading-tight text-wine-700">{wedding.couple}</h2>
              <p className="mt-1 text-sm italic text-ink-soft">{wedding.tagline || wedding.type}</p>
            </div>
            <p className="shrink-0 text-xs text-ink-soft">Created on {wedding.createdAt}</p>
          </div>

          <dl className="mt-5 grid gap-3 sm:grid-cols-3">
            <Metadata Icon={Calendar} label="Wedding dates">
              {wedding.dates}
              <span className="block text-[11px] font-normal text-ink-soft">{wedding.duration}</span>
            </Metadata>
            <Metadata Icon={MapPin} label="Venue">
              {wedding.venue || wedding.location}
              <span className="block text-[11px] font-normal text-ink-soft">{wedding.location}</span>
            </Metadata>
            <Metadata Icon={Users} label="Languages">
              {wedding.languages || 'Hindi, English'}
            </Metadata>
          </dl>

          {isDetailsOpen && (
            <div className="mt-4 border-t border-gold-200/70 pt-4 text-sm leading-6 text-ink-soft">
              <span className="font-medium text-ink">Wedding style:</span> {wedding.type}. The celebration runs for {wedding.duration.toLowerCase()}.
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-gold-200/70 pt-4">
            <button type="button" onClick={() => onEdit(wedding)} className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-wine-300 px-3 text-xs font-semibold text-wine-700 transition-colors hover:border-wine-500 hover:bg-wine-50">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
            <button type="button" onClick={() => onDelete(wedding)} disabled={deletingWeddingId === wedding.id} className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-rose-300 px-3 text-xs font-semibold text-rose-700 transition-colors hover:border-rose-500 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60">
              <Trash className="h-3.5 w-3.5" />
              {deletingWeddingId === wedding.id ? 'Deleting...' : 'Delete'}
            </button>
            <button
              type="button"
              onClick={() => setIsDetailsOpen((current) => !current)}
              aria-expanded={isDetailsOpen}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-md bg-wine-700 px-3.5 text-xs font-semibold text-cream-50 transition-colors hover:bg-wine-600"
            >
              {isDetailsOpen ? 'Hide Details' : 'View Details'}
              <ArrowRight className={`h-3.5 w-3.5 transition-transform ${isDetailsOpen ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function RegisteredWeddingList({ deletingWeddingId, onDelete, onEdit, weddings }) {
  if (!weddings.length) {
    return (
      <div className="border border-dashed border-gold-300 bg-white/65 px-5 py-12 text-center text-sm text-ink-soft">
        You have not registered any weddings yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {weddings.map((wedding) => (
        <RegisteredWeddingCard key={wedding.id} wedding={wedding} deletingWeddingId={deletingWeddingId} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}