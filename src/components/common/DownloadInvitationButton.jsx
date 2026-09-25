'use client';

import { useState } from 'react';
import { Download } from '@/components/Icons';
import APIs from '@/lib/apis';

const DEFAULT_BUTTON_CLASSNAME =
  'inline-flex min-h-10 items-center gap-2 rounded-md bg-wine-700 px-4 text-xs font-semibold text-white transition-colors hover:bg-wine-600 disabled:cursor-not-allowed disabled:opacity-60';

// Shared download-invitation action; button styling is customizable per usage site via `className`.
export default function DownloadInvitationButton({
  invoiceId,
  bookingId,
  label = 'Download Invitation Card',
  downloadingLabel = 'Downloading...',
  className = DEFAULT_BUTTON_CLASSNAME,
  icon: Icon = Download,
  iconClassName = 'h-4 w-4',
  showError = true,
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  const handleDownload = async () => {
    if (!bookingId || isDownloading) return;

    setIsDownloading(true);
    setDownloadError('');

    try {
      const response = await APIs.account.myBookings.downloadInvitationCard(bookingId);
      const disposition = response.headers?.['content-disposition'] || '';
      const filename = disposition.match(/filename="?([^";]+)"?/)?.[1] || `wedding-invitation-${invoiceId || bookingId}.pdf`;

      const blobUrl = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      setDownloadError(error?.message || 'Unable to download the invitation card. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {showError && downloadError && (
        <p className="mt-2 text-xs font-semibold text-red-600">{downloadError}</p>
      )}
      <button
        type="button"
        onClick={handleDownload}
        disabled={!bookingId || isDownloading}
        title={bookingId ? undefined : 'Invitation download will be available soon.'}
        className={className}
      >
        <Icon className={iconClassName} />
        {isDownloading ? downloadingLabel : label}
      </button>
    </>
  );
}
