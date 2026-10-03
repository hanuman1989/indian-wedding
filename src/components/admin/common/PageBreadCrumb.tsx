import Link from "next/link";
import React from "react";

interface BreadcrumbLink {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  pageTitle: string;
  subtitle?: string;
  links?: BreadcrumbLink[];
}

const ChevronIcon = () => (
              <svg
                className="stroke-current"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
);

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({
  pageTitle,
  subtitle,
  links,
}) => {
  return (
    <div
      className="relative mb-6 overflow-hidden rounded-md border border-[#FEF7E8] bg-white bg-cover bg-right bg-no-repeat dark:border-gray-800 dark:bg-gray-900"
      style={{
        backgroundImage: "url('/images/admin/title-header-section-bg.png')",
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6 sm:py-5">
        <div>
          <h2 className="text-xl font-bold text-[#7A1F2E] dark:text-white/90 sm:text-2xl">
            {pageTitle}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>

        {links && links.length > 0 && (
          <nav>
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                  href="/admin"
                >
                  Home
                  <ChevronIcon />
                </Link>
              </li>

              {links.map((link, index) => {
                const isLast = index === links.length - 1;

                return (
                  <li key={index} className="flex items-center gap-1.5">
                    {isLast ? (
                      <span className="text-sm text-gray-800 dark:text-white/90">
                        {link.label}
                      </span>
                    ) : (
                      <>
                        <Link
                          href={link.href}
                          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                        >
                          {link.label}
                        </Link>
                        <ChevronIcon />
                      </>
                    )}
          </li>
                );
              })}
        </ol>
      </nav>
        )}
      </div>
    </div>
  );
};

export default PageBreadcrumb;
