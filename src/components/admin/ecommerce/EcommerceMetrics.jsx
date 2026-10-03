"use client";
import { useEffect, useState } from 'react';
import {  CreditCardIcon, GroupIcon, WeddingIcon, ListIcon, DollarLineIcon } from "@/icons";
import APIs from '@/lib/apis';
import StateCard from './StateCard'
import DashboardStatCardSkeleton from '@/components/dashboard/DashboardStatCardSkeleton';

export const EcommerceMetrics = () => {
   const [stats, setStats] = useState();
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      let isActive = true;
  
      const loadStats = async () => {
        try {
          const response = await APIs.admin.weddingBooking.getMyBookingStats();
          if(isActive && response.data){
              const statsCards = [
                {
                  label: "Total Users",
                  value: response.data.users_count,
                  icon: GroupIcon,
                },
                {
                  label: "Total Hosts",
                  value: response.data.hosts_count,
                  icon: GroupIcon,
                },
                {
                  label: "Weddings",
                  value: response.data.registered_weddings_count,
                  icon: WeddingIcon,
                },
                {
                  label: "Wedding Bookings",
                  value: response.data.wedding_bookings_count,
                  icon: ListIcon,
                },
                {
                  label: "Total Guest",
                  value: response.data.total_travelers,
                  icon: GroupIcon,
                },
                {
                  label: "Total Amount",
                  value: `$${response.data.total_amount}`,
                  icon: DollarLineIcon,
                },
                {
                  label: "Platform Fee",
                  value: `$${response.data.total_platform_fee}`,
                  icon: CreditCardIcon,
                },
                {
                  label: "Payout Amount",
                  value: `$${response.data.total_payout_amount}`,
                  icon: DollarLineIcon,
                },
              ];
              setStats(statsCards);
          }
        } catch (error) {
          console.log(error)
          if (isActive) setStats([]);
        } finally {
          if (isActive) setIsLoading(false);
        }
      };
  
      void loadStats();
  
      return () => {
        isActive = false;
      };
    }, []);
    
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
      {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <DashboardStatCardSkeleton key={index} />
            ))
          : stats.map((stat) => (
              <StateCard key={stat.label} {...stat} />
            ))}
    </div>
  );
};
