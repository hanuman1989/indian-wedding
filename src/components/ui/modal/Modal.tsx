'use client';

import { useEffect } from 'react';

type ModalSize =
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | 'full';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;

  title?: string;
  description?: string;

  children: React.ReactNode;

  /**
   * Footer action buttons
   */
  footer?: React.ReactNode;

  /**
   * Modal width
   */
  size?: ModalSize;

  /**
   * Show close button in header
   */
  showCloseButton?: boolean;

  /**
   * Close modal when clicking overlay
   */
  closeOnOverlayClick?: boolean;

  /**
   * Close modal when pressing ESC
   */
  closeOnEscape?: boolean;

  /**
   * Prevent closing modal
   */
  preventClose?: boolean;

  /**
   * Additional class for modal container
   */
  className?: string;

  /**
   * Additional class for content area
   */
  contentClassName?: string;
};

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-[95vw]',
};

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  preventClose = false,
  className = '',
  contentClassName = '',
}: ModalProps) {
  /**
   * Handle ESC key
   */
  useEffect(() => {
    if (!isOpen || !closeOnEscape || preventClose) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isOpen,
    closeOnEscape,
    preventClose,
    onClose,
  ]);

  /**
   * Prevent body scrolling while modal is open
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = () => {
    if (
      closeOnOverlayClick &&
      !preventClose
    ) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`
          relative z-10
          flex w-full
          ${sizeClasses[size]}
          max-h-[90vh]
          flex-col
          overflow-hidden
          rounded-xl
          bg-white
          shadow-2xl
          ${className}
        `}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        {(title || description || showCloseButton) && (
          <div className="flex shrink-0 items-start justify-between border-b border-gray-200 px-6 py-4">
            <div className="pr-4">
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  {title}
                </h2>
              )}

              {description && (
                <p className="mt-1 text-sm text-gray-500">
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                disabled={preventClose}
                aria-label="Close modal"
                className="
                  inline-flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-md
                  text-gray-500
                  transition
                  hover:bg-gray-100
                  hover:text-gray-700
                  focus:outline-none
                  focus:ring-2
                  focus:ring-gray-400
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div
          className={`
            min-h-0
            flex-1
            overflow-y-auto
            px-6
            py-5
            ${contentClassName}
          `}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}