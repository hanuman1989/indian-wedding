"use client";
import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import UserSearch from "./UserSearch";
import UserTable from "./UserTable";
import Pagination from '@/components/admin/tables/Pagination'
import APIs from '@/lib/apis';
  const links = [
    {
      label: "User Management",
    },
  ];
  const DEFAULT_FILTERS = {
        keyword: "",
        start_date: "",
        end_date: "",
        user_type: "",
        status: "",
    };
export default function UserList(){ 
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [pagination, setPagination] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

     useEffect(() => {
        let isActive = true;
        const loadUsers = async () => {
          try {
            const params = new URLSearchParams({ page: String(page) });
            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                params.append(key, value);
                }
            });
            const response = await APIs.admin.users.getUsers(params);
            console.log(response.data, 'response.data')
            if(isActive && response.data){
                setUsers(response.data);
                setPagination(response.pagination ?? null);
            }
          } catch (error) {
            console.log(error)
            if (isActive){
              setUsers([]);
              setPagination(null);} 
          } finally {
            if (isActive) setIsLoading(false);
          }
        };
    
        void loadUsers();
    
        return () => {
          isActive = false;
        };
      }, [filters, page]);

    const onExport = async () => {
        setIsExporting(true);
        try {
            const params = new URLSearchParams({ page: String(page) });
            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                params.append(key, value);
                }
            });
            const response = await APIs.admin.users.exportUsers(params);
            const disposition = response.headers?.['content-disposition'] || '';
            const filename = disposition.match(/filename="?([^";]+)"?/)?.[1] || `users.xlsx`;
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

    const handleStatusChange = async (id, status) => {
        const response = await APIs.admin.users.updateUserStatus(id, { status });
        if (response?.status === false) {
            throw new Error(response.message || 'Failed to update user status');
        }
        setUsers((currentUsers) => currentUsers.map((user) =>
            user.id === id ? { ...user, status } : user
        ));
        toast.success('User status updated successfully.',{position: 'bottom-center'});
    };

    const handleSearch = (newFilters) => {
        setPage(1);
        setFilters(newFilters);
    };
    const handleExport = async () =>{
        await onExport();
    }
    const handleDelete = async (userId) => {
    try {
      const response = await APIs.admin.users.deleteUser(userId);
      if(response.status){
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        toast.success('User deleted successfully.',{position: 'bottom-center'});
      }else{
        toast.error('Failed to delete user.',{position: 'bottom-center'});
      }
    } catch (error) {
      toast.error('Failed to delete user.',{position: 'bottom-center'});
      console.log('Error deleting user:', error.message);
    }
  };
    return (  
         <div className="min-w-0 w-full max-w-full">
            <PageBreadcrumb pageTitle="User Management" links={links} />
            <UserSearch onSearch={handleSearch} onExport={handleExport} />
         <div className="min-w-0 w-full max-w-full rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <UserTable
                users={users}
                isLoading={isLoading}
                onStatusChange={handleStatusChange}
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
        </div>
      )
}
