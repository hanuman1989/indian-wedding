"use client";

import { useCallback, useEffect, useState } from "react";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import BookingSearch from "./BookingSearch";
import BookingTable from "./BookingTable";
import Pagination from '@/components/admin/tables/Pagination'

import APIs from '@/lib/apis';

const DEFAULT_FILTERS = {
  keyword: "",
  start_date: "",
  end_date: "",
  status: "",
};

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const links = [
    {
      label: "Weddings",
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
            }
          } catch (error) {
            console.log(error)
            if (isActive) setBookings([]);
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
        const response = await APIs.admin.weddingBooking.exportWeddingToExcel(params);
        console.log(response, 'response-----------')
        const disposition = response.headers?.['content-disposition'] || '';
        const filename = disposition.match(/filename="?([^";]+)"?/)?.[1] || `wedding.xlsx`;
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
    <>
      <PageBreadcrumb pageTitle="Weddings" links={links} />
      <BookingSearch onSearch={handleSearch} onExport={handleExport} />
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
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
      
    </>
  );
}
