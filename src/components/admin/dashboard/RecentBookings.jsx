"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import APIs from '@/lib/apis';
import TableSkeleton from '@/components/common/TableSkeleton';
import BookingStatusBadge from '@/components/myBooking/BookingStatusBadge';

export default function RecentBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
        let isActive = true;
    
        const loadWeddings = async () => {
          try {
            const params = {
              limit: 5
            }
            const response = await APIs.admin.weddingBooking.getBookings(params);
            if(isActive && response.data){
                setBookings(response.data);
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
      }, []);


  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Bookings
          </h3>
        </div>
        <Link
          href="/admin/bookings"
          className="text-sm font-bold text-[#7A1F2E] transition-colors hover:text-[#5C1622] dark:text-[#E5A0A8] dark:hover:text-white"
        >
          View All
        </Link>
      </div>
      <div className="max-w-full overflow-x-auto">
        { isLoading ? (
          <TableSkeleton columns={6} rows={5} />
        ) : (
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Oder ID
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Couple Name
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Amount
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Platform Fee
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Total Amount
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {bookings.map((booking) => (
                <TableRow key={booking.id} className="">
                  <TableCell className="py-3">
                   {booking.booking_number}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {booking.wedding.couple_name}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    ${booking.total_amount}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    ${booking.platform_fee}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    ${booking.payout_amount}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <BookingStatusBadge status={booking.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
       
      </div>
    </div>
  );
}
