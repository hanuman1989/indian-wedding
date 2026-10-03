"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Three-dots action button with a dropdown menu.
 *
 * Usage:
 *   <ActionDropdown
 *     viewHref={`/admin/weddings/${wedding.id}`}
 *     onDelete={() => handleDelete(wedding.id)}
 *   />
 */
export default function ActionDropdown({
  viewHref,
  onDelete,
  viewLabel = "View Detail",
  deleteLabel = "Delete",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useLayoutEffect(() => {
    if (!isOpen) return;

    const positionMenu = () => {
      const trigger = buttonRef.current;
      const menu = menuRef.current;
      if (!trigger || !menu) return;

      const rect = trigger.getBoundingClientRect();
      const gap = 8;
      const width = menu.offsetWidth;
      const height = menu.offsetHeight;
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = document.documentElement.clientHeight;
      const left = Math.max(gap, Math.min(rect.right - width, viewportWidth - width - gap));
      const top = rect.bottom + gap + height <= viewportHeight - gap
        ? rect.bottom + gap
        : Math.max(gap, rect.top - height - gap);

      menu.style.left = `${left}px`;
      menu.style.top = `${top}px`;
      menu.style.visibility = "visible";
    };

    positionMenu();
    window.addEventListener("resize", positionMenu);
    window.addEventListener("scroll", positionMenu, true);
    return () => {
      window.removeEventListener("resize", positionMenu);
      window.removeEventListener("scroll", positionMenu, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target) && !buttonRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onOutsideClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onOutsideClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const toggle = (e) => {
    // Prevents the click from triggering a parent row link/handler
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const close = () => setIsOpen(false);

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    close();
    onDelete?.();
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-label="Actions"
        aria-expanded={isOpen}
        className="dropdown-toggle flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-white/5"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="5" cy="12" r="1.75" />
          <circle cx="12" cy="12" r="1.75" />
          <circle cx="19" cy="12" r="1.75" />
        </svg>
      </button>

      {isOpen && createPortal(<div
        ref={menuRef}
        style={{ visibility: "hidden", maxWidth: "calc(100vw - 16px)", maxHeight: "calc(100vh - 16px)" }}
        className="fixed z-[100] w-40 overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <ul className="flex flex-col gap-1">
          {viewHref && (
            <li>
              <Link
                href={viewHref}
                onClick={(e) => {
                  e.stopPropagation();
                  close();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
              >
                {viewLabel}
              </Link>
            </li>
          )}
          {onDelete && (
            <li>
              <button
                type="button"
                onClick={handleDelete}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                {deleteLabel}
              </button>
            </li>
          )}
        </ul>
      </div>, document.body)}
    </div>
  );
}
