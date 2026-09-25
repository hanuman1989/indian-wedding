import { BookHeart } from '@/components/Icons';
import SectionHeader from './SectionHeader';
import DownloadInvitationButton from '@/components/common/DownloadInvitationButton';

export default function InvitationCard({ wedding, bookingId, invoiceId }) {
  if (!wedding) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-gold-200/80 bg-white shadow-sm">
      <SectionHeader icon={BookHeart} title="Invitation Card" />
      <div className="flex flex-col items-center gap-5 p-5 sm:flex-row sm:p-6">
        <div
          className="flex h-55 w-50 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-gold-300 bg-cover bg-center text-center"
          style={{ backgroundImage: "url('/images/invitation-thumb.png')" }}
        >
          <span className="font-display text-md font-bold leading-tight text-wine-700">{wedding.bride_name}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-gold-600">&amp;</span>
          <span className="font-display text-md font-bold leading-tight text-wine-700">{wedding.groom_name}</span>
        </div>

        <div className="min-w-0 flex-1 text-center sm:text-left pl-5">
          <h3 className="text-2xl font-bold text-wine-700">Download Wedding Invitation</h3>
          <p className="mt-2 text-md leading-5 text-ink-soft">Share this beautiful invitation card with your family and friends.</p>
          <DownloadInvitationButton bookingId={bookingId} invoiceId={invoiceId} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-md bg-wine-700 px-4 text-xs font-semibold text-white transition-colors hover:bg-wine-600 disabled:cursor-not-allowed disabled:opacity-60" />
        </div>
      </div>
    </div>
  );
}

