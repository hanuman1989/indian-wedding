"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";
import Image from "next/image";
import TableSkeleton from '@/components/common/TableSkeleton';

const STATUS_STYLES = {
  draft: "bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400",
  submitted: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  published: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
};

function StatusBadge({ status }) {
  const styles = STATUS_STYLES[status] || STATUS_STYLES.draft;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${styles}`}
    >
      {status}
    </span>
  );
}

export default function WeddingTable({
  weddings = [],
  isLoading = false,
  pagination = null,
  onPageChange,
}) {
    console.log(weddings)
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center gap-6 border-b border-gray-100 px-6 py-4 text-sm font-medium text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <div className="min-w-[180px] flex-1">Couple Name</div>
        <div className="flex-1">Wedding Dates</div>
        <div className="flex-1">Wedding Schedule</div>
        <div className="flex-1">Venue &amp; Location</div>
        <div className="flex-1">Status</div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} columns={5} />
      ) : weddings.length > 0 ? (
        <div className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
          No weddings found.
        </div>
      ) : (
        weddings.map((wedding) => {
          const firstDay = wedding.days?.[0];
          const lastDay = wedding.days?.[wedding.days.length - 1];

          return (
            <Link
              key={wedding.id}
              href={`/admin/weddings/${wedding.id}`}
              className="flex items-center gap-6 border-b border-gray-100 px-6 py-4 last:border-b-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5"
            >
              <div className="flex min-w-[180px] flex-1 items-center gap-3">
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                  {wedding.thumbnail?.url && (
                    <Image
                      src={wedding.thumbnail.url}
                      alt={`${wedding.first_name} & ${wedding.last_name}`}
                      width={44}
                      height={44}
                      className="h-11 w-11 object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {wedding.first_name} {wedding.last_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {wedding.email}
                  </p>
                </div>
              </div>

              <div className="flex-1 text-sm text-gray-600 dark:text-gray-400">
                {firstDay && lastDay
                  ? `${firstDay.wedding_day_date} to ${lastDay.wedding_day_date}`
                  : "—"}
              </div>

              <div className="flex-1 text-sm text-gray-600 dark:text-gray-400">
                {wedding.total_days} · {wedding.total_events}
              </div>

              <div className="flex-1 text-sm text-gray-600 dark:text-gray-400">
                {firstDay?.city || "—"}
              </div>

              <div className="flex-1">
                <StatusBadge status={wedding.status} />
              </div>
            </Link>
          );
        })
      )}

      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {pagination.from}–{pagination.to} of {pagination.total}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!pagination.prev_page_url}
              onClick={() => onPageChange?.(pagination.current_page - 1)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={!pagination.next_page_url}
              onClick={() => onPageChange?.(pagination.current_page + 1)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
