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

export default function WeddingTable({
  weddings = [],
  isLoading = false,
  handleDelete
}) {
  return (
     <div className="max-w-full">
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
              {weddings.map((wedding) => (
                <TableRow key={wedding.id} className="">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                        <Image
                          width={50}
                          height={50}
                          unoptimized
                          src={wedding.cover_image || '/images/bg.png'}
                          alt={`Wedding decor for ${wedding.couple_name}`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {wedding.couple_name}
                        </p>
                        {wedding.food_observance && (
                            <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                                Food Type: {wedding.food_observance}
                            </span>
                        )}
                        
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
                  <TableCell>
                    <ActionDropdown
                        viewHref={`/admin/weddings/${wedding.id}`}
                        onDelete={() => handleDelete(wedding.id)}
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
