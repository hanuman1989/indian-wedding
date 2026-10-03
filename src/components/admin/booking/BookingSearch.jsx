"use client";

import { useState } from "react";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending_payment", label: "Pending Payment" },
  { value: "confirmed", label: "Confirmed" },
  { value: "payment_failed", label: "Payment Failed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "expired", label: "Expired" },
  { value: "completed", label: "Completed" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "", label: "All Payment Statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "succeeded", label: "Succeeded" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
];

const DEFAULT_FILTERS = {
  keyword: "",
  start_date: "",
  end_date: "",
  booking_status: "",
  payment_status: "",
};

export default function BookingSearch({ onSearch, onExport, isExporting = false }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(filters);
  };

   const handleExport = (e) => {
    e.preventDefault();
    onExport?.();
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    onSearch?.(DEFAULT_FILTERS);
  };

  const openPicker = (e) => {
    try {
        e.currentTarget.showPicker();
    } catch {}
    };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Keyword
          </label>
          <input
            type="text"
            name="keyword"
            value={filters.keyword}
            onChange={handleChange}
            placeholder="Booking Id, Name, Email..."
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Start Date
          </label>
          <input
            type="date"
            name="start_date"
            value={filters.start_date}
            onChange={handleChange}
            onClick={openPicker}
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            End Date
          </label>
          <input
            type="date"
            name="end_date"
            value={filters.end_date}
            onChange={handleChange}
            onClick={openPicker}
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Booking Status
          </label>
          <select
            name="booking_status"
            value={filters.booking_status}
            onChange={handleChange}
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="payment_status"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Payment Status
          </label>
          <select
            id="payment_status"
            name="payment_status"
            value={filters.payment_status}
            onChange={handleChange}
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
          >
            {PAYMENT_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

       <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-[#7A1F2E] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#5C1622]"
          >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          Search
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 12a9 9 0 1 0 3-6.7" />
            <path d="M3 4v5h5" />
          </svg>
          Reset
        </button>
        </div>

        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
            <path d="M14 3v5h5" />
            <path d="M9.5 12.5l5 5M14.5 12.5l-5 5" />
          </svg>
          {isExporting ? "Exporting..." : "Export to Excel"}
        </button>
      </div>
    </form>
  );
}
