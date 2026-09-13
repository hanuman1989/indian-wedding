"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Share } from '@/components/Icons';
import { getCoupleName } from './weddingDetailUtils';

export default function WeddingBreadcrumb({ wedding }) {
  const [shareStatus, setShareStatus] = useState('');
  const coupleName = getCoupleName(wedding);

  const shareWedding = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: `${coupleName} - Wedding Invitation`, url: window.location.href });
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      setShareStatus('Link copied!');
    } catch {
      // User cancelled the share sheet or denied clipboard access; nothing to report.
    } finally {
      setTimeout(() => setShareStatus(''), 2000);
    }
  };

  return (
    <nav aria-label="Breadcrumb" className="shell flex flex-wrap items-center justify-between gap-3 pt-6 sm:pt-8">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ink-soft">
        <li><Link href="/" className="transition-colors hover:text-wine-700">Home</Link></li>
        <li><ChevronRight className="h-3.5 w-3.5" /></li>
        <li><Link href="/weddings" className="transition-colors hover:text-wine-700">Weddings</Link></li>
        <li><ChevronRight className="h-3.5 w-3.5" /></li>
        <li aria-current="page" className="font-semibold text-wine-700">{coupleName}</li>
      </ol>
      <div className="flex items-center gap-2">
        {shareStatus && <span className="text-xs font-medium text-wine-600">{shareStatus}</span>}
        <button type="button" onClick={shareWedding} className="inline-flex min-h-8 items-center gap-1.5 rounded-md border border-wine-200 bg-white px-3 text-xs font-semibold text-wine-700 transition-colors hover:bg-wine-50 focus:outline-none focus:ring-2 focus:ring-wine-300">
          <Share className="h-3.5 w-3.5" />
          Share
        </button>
      </div>
    </nav>
  );
}