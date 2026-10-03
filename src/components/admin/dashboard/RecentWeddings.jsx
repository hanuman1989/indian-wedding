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

export default function RecentWeddings() {
  const [weddings, setWeddings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
        let isActive = true;
    
        const loadWeddings = async () => {
          try {
            const params = {
              limit: 5
            }
            const response = await APIs.admin.weddingBooking.getWeddings(params);
            if(isActive && response.data){
               
                setWeddings(response.data);
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
            Recent Weddings
          </h3>
        </div>
       <Link
          href="/admin/weddings"
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
                  Couple Name
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Wedding dates
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Wedding Schedule
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Venue & Location
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
              {weddings.map((wedding) => (
                <TableRow key={wedding.id} className="">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-13 w-13 overflow-hidden rounded-md">
                        <Image
                          width={50}
                          height={50}
                          unoptimized
                          src={wedding.cover_image || '/images/bg.png'}
                          className="h-13 w-13"
                          alt={`Wedding decor for ${wedding.couple_name}`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {wedding.couple_name}
                        </p>
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                         Food Type: {wedding.food_observance}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {wedding.wedding_dates}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {wedding.total_days} {wedding.total_events}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {wedding.locations}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        wedding.status === "published"
                          ? "success"
                          : wedding.status === "draft"
                          ? "warning"
                          : "error"
                      }
                    >
                      {wedding.status}
                    </Badge>
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
