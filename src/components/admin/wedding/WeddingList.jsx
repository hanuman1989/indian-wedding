"use client";
import toast, { Toaster } from 'react-hot-toast';

import { useCallback, useEffect, useState } from "react";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import WeddingSearch from "./WeddingSearch";
import WeddingTable from "./WeddingTable";
import Pagination from '@/components/admin/tables/Pagination'

import APIs from '@/lib/apis';

const DEFAULT_FILTERS = {
  keyword: "",
  start_date: "",
  end_date: "",
  status: "",
};

export default function WeddingList() {
  const [weddings, setWeddings] = useState([]);
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
        const loadWeddings = async () => {
          try {
            const params = new URLSearchParams({ page: String(page) });
            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                params.append(key, value);
                }
            });
            const response = await APIs.admin.weddingBooking.getWeddings(params);
            if(isActive && response.data){
                setWeddings(response.data);
                setPagination(response.pagination ?? null);
            }
          } catch (error) {
            console.log(error)
            if (isActive) setWeddings([]);
          } finally {
            if (isActive) setIsLoading(false);
          }
        };
    
        void loadWeddings();
    
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
        const disposition = response.headers?.['content-disposition'] || '';
        const filename = disposition.match(/filename="?([^";]+)"?/)?.[1] || `wedding.xlsx`;
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

  const handleDelete = async (weddingId) => {
    try {
      const response = await APIs.admin.weddingBooking.deleteWedding(weddingId);
      if(response.status){
        setWeddings((prevWeddings) => prevWeddings.filter((wedding) => wedding.id !== weddingId));
        toast.success('Wedding deleted successfully.',{position: 'bottom-center'});
      }else{
        toast.error('Failed to delete wedding.',{position: 'bottom-center'});
      }
    } catch (error) {
      toast.error('Failed to delete wedding.',{position: 'bottom-center'});
      console.log('Error deleting wedding:', error.message);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Weddings" links={links} />
      <WeddingSearch onSearch={handleSearch} onExport={handleExport} />
      <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <WeddingTable
        weddings={weddings}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
        handleDelete={handleDelete}
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
      <Toaster toastOptions={{
        success: {
          style: {
            background: 'green',
            color: '#FFF',
          },
        },
          error: {
            style: {
              background: 'red',
              color: '#FFF',
            },
          },
        }} />
    </>
  );
}
