"use client";

import { useCallback, useEffect, useState } from "react";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import BookingSearch from "./BookingSearch";
import BookingTable from "./BookingTable";
import BookingStats from "./BookingStats";
import Pagination from '@/components/admin/tables/Pagination'

import APIs from '@/lib/apis';

const DEFAULT_FILTERS = {
  keyword: "",
  start_date: "",
  end_date: "",
  booking_status: "",
  payment_status: "",
};

const DEFAULT_STATS = {
  total_bookings: 2,
  pending: 1,
  confirmed: 1,
  cancelled: 0,
  total_revenue: 600,
  wedding_bookings_count: 2,
  total_travelers: 6,
  total_amount: 900,
  total_platform_fee: 240,
  total_payout_amount: 360,
  bookings_by_status: {
    confirmed: 1,
    pending_payment: 1,
  },
};

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const links = [
    {
      label: "Bookings",
    },
  ];

  useEffect(() => {
        let isActive = true;
        const loadBookings = async () => {
          try {
            const params = new URLSearchParams({ page: String(page) });
            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                params.append(key, value);
                }
            });
            const response = await APIs.admin.weddingBooking.getBookings(params);
            console.log(response.data, 'response.data')
            if(isActive && response.data){
                setBookings(response.data);
                setPagination(response.pagination ?? null);
                setStats({ ...DEFAULT_STATS, ...response.stats });
            }
          } catch (error) {
            console.log(error)
            if (isActive){
              setBookings([]);
              setStats(DEFAULT_STATS);
            } 
          } finally {
            if (isActive) setIsLoading(false);
          }
        };
    
        void loadBookings();
    
        return () => {
          isActive = false;
        };
      }, [filters, page]);

  const handleSearch = (newFilters) => {
    setPage(1);
    setFilters(newFilters);
  };

  const onExport = async () => {
    setIsExporting(true);
    try {
        const params = new URLSearchParams({ page: String(page) });
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
            params.append(key, value);
            }
        });
        const response = await APIs.admin.weddingBooking.exportBookingToExcel(params);
        const disposition = response.headers?.['content-disposition'] || '';
        const filename = disposition.match(/filename="?([^";]+)"?/)?.[1] || `bookings.xlsx`;
        console.log(filename, 'filename---')
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
        setIsExporting(false);
    }
  }


  const handleExport = async () =>{
    await onExport();
  }

  return (
    <div className="min-w-0 w-full max-w-full">
      <PageBreadcrumb pageTitle="Bookings" links={links} />
      <BookingSearch onSearch={handleSearch} onExport={handleExport} />
      <BookingStats stats={stats} />
      <div className="min-w-0 w-full max-w-full rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <BookingTable
        bookings={bookings}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
      />
       {pagination && pagination.last_page > 1 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {pagination.from}–{pagination.to} of {pagination.total}
          </p>

            <Pagination
            currentPage={pagination.current_page}
            totalPages={pagination.last_page}
            onPageChange={setPage}
            />
        </div>
        )}
      </div>
      
    </div>
  );
}
