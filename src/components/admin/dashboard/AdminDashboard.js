import { EcommerceMetrics } from "@/components/admin/ecommerce/EcommerceMetrics";
import RecentWeddings from "./RecentWeddings";
import RecentBookings from "./RecentBookings";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";

export default function AdminDashboard() {
    return (
        <>
        <PageBreadcrumb pageTitle="Dashboard" />
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 ">
                <EcommerceMetrics />
            </div>
            <div className="col-span-12 xl:col-span-12">
                <RecentWeddings />
            </div>
        
            <div className="col-span-12 xl:col-span-12">
             <RecentBookings />
            </div>
        </div>
        </>
    );
}