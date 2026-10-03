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
import Badge from "../ui/badge/Badge";
import ActionDropdown from '@/components/common/ActionDropdown'

export default function BookingTable({
  bookings = [],
  isLoading = false,
  handleDelete
}) {
  return (
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
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {bookings.map((booking) => (
                <TableRow key={booking.id} className="">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                        <Image
                          width={50}
                          height={50}
                          unoptimized
                          src={booking.cover_image || '/images/bg.png'}
                          alt={`Wedding decor for ${booking.couple_name}`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {booking.couple_name}
                        </p>
                        {booking.food_observance && (
                            <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                                Food Type: {booking.food_observance}
                            </span>
                        )}
                        
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {booking.wedding_dates}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {booking.total_days} {booking.total_events}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {booking.locations}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        booking.status === "published"
                          ? "success"
                          : booking.status === "draft"
                          ? "warning"
                          : "error"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ActionDropdown
                        viewHref={`/admin/bookings/${booking.id}`}
                        onDelete={() => handleDelete(booking.id)}
                        />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
  );
}
