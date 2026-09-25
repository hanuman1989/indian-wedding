
"use client";
import Link from 'next/link';
import { ArrowRight } from '@/components/Icons';
import BookingListCard from '@/components/myBooking/BookingListCard';
import SectionTitle from '@/components/common/SectionTitle';

import { useEffect, useState } from 'react';
import APIs from '@/lib/apis';
import BookingCard from '@/components/myBooking/BookingCard';
import BookingBlankCard from '@/components/myBooking/BookingBlankCard';
import BookingCardSkeleton from '@/components/myBooking/BookingCardSkeleton';
import Pagination from '@/components/common/Pagination'

const PER_PAGE = 15;

export default function MyBookingList({ isHost, limit, hideHeading }) {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: PER_PAGE,
    total: 0,
  })

  useEffect(() => {
    let isActive = true;

    const loadBookings = async () => {
      setIsLoading(true);
      try {
        const parms = {
          is_host: isHost,
          page: currentPage,
          per_page: PER_PAGE,
        }

        if(limit){
          parms.limit = limit;
        }
        const response = await APIs.account.myBookings.getMyBookings(parms);
        if (isActive){
          setBookings(Array.isArray(response?.data) ? response.data : []);
          setPagination(response?.pagination || { 
            current_page: 1,
            last_page: 1,
            per_page: PER_PAGE, 
            total: 0,
          })
        } 
      } catch (error) {
        if (isActive) setBookings([]);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadBookings();

    return () => {
      isActive = false;
    };
  }, [isHost, limit, currentPage]);

  if (isLoading) {
    return Array.from({ length: 1 }, (_, index) => <BookingCardSkeleton key={index} />);
  }

  // No bookings yet: render an empty-state card instead of the mock defaults.

  return (
    <>
     {!hideHeading && (bookings.length ? (
       <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
         <SectionTitle> {isHost ? "Latest Booking" : "Your Booking"} </SectionTitle>
         <Link href="/bookings" className="inline-flex items-center gap-2 text-sm font-semibold text-wine-700 transition-colors hover:text-wine-500">
           View all bookings
           <ArrowRight className="h-4 w-4" />
         </Link>
       </div>
     ) : (
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <SectionTitle> {isHost ? "Latest Booking" : "Your Booking"} </SectionTitle>
      </div>
     ))}
      
      {bookings.length > 0 ? (
          bookings.map((booking) => (
            isHost ? <BookingListCard isHost={isHost} key={booking.id} booking={booking} /> : <BookingCard isHost={isHost} key={booking.id} booking={booking} />
          ))
      ) : (
        <BookingBlankCard isHost={isHost} />
      ) }

      {(pagination.total ?? 0) > (pagination.per_page ?? 0) && (
          <Pagination
            currentPage={pagination.current_page}
            totalPages={pagination.last_page || 1}
            onPageChange={setCurrentPage}
          />
        )}
      
      
    </>
  );

}


