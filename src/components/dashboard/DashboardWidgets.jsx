
"use client";
import { useEffect, useState } from 'react';
import APIs from '@/lib/apis';
import { Couple, Ticket, Users, Wallet } from '@/components/Icons';
import DashboardStatCard from '@/components/dashboard/DashboardStatCard';
import DashboardStatCardSkeleton from '@/components/dashboard/DashboardStatCardSkeleton';

const SKELETON_COUNT = 4;

export default function DashboardWidgets() {

  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadStats = async () => {
      try {
        const parms = {
          is_host: true,
        }
        const response = await APIs.account.myBookings.getMyBookingStats(parms);
        if(isActive && response.data){
            const data = [
                { label: 'Total Weddings', value: response.data.registered_weddings_count, icon: Couple, iconBgClass: 'bg-orange-100', iconColorClass: 'text-orange-600' },
                { label: 'Total Bookings', value: response.data.wedding_bookings_count, icon: Ticket, iconBgClass: 'bg-pink-100', iconColorClass: 'text-pink-600' },
                { label: 'Total Guests', value: response.data.total_travelers, icon: Users, iconBgClass: 'bg-gold-100', iconColorClass: 'text-gold-600' },
                { label: 'Total Revenue', value: `$${response.data.total_payout_amount}`, icon: Wallet, iconBgClass: 'bg-wine-100', iconColorClass: 'text-wine-600' },
            ]
            setStats(data);
        }
      } catch (error) {
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
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {isLoading
        ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <DashboardStatCardSkeleton key={index} />
          ))
        : stats.map((stat) => (
            <DashboardStatCard key={stat.label} {...stat} />
          ))}
    </div>
  );
}
