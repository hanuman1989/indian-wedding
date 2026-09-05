"use client";

import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  full: 'max-w-[95vw]',
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
        fill="currentColor"
      />
    </svg>
  )
}

/**
 * Reusable TailAdmin-styled modal built on headlessui's Dialog.
 * Pass `title`/`description` for the header, `children` for the body
 * sections, and `footer` for action buttons. Set `scrollable` when the
 * body content can exceed the viewport so only the body scrolls while
 * the header/footer stay fixed.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  scrollable = false,
  closeOnOverlayClick = true,
  noPadding = false,
  className = '',
  bodyClassName = '',
}) {
  const handleClose = () => {
    if (closeOnOverlayClick) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog static open={isOpen} onClose={handleClose} className="relative z-99999">
          <DialogBackdrop
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-400/50 backdrop-blur-[32px] dark:bg-gray-900/50"
          />

          <div className="fixed inset-0 flex w-screen items-center justify-center overflow-y-auto p-4">
            <DialogPanel
              as={motion.div}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(event) => event.stopPropagation()}
              className={`relative flex w-full ${sizeClasses[size]} flex-col overflow-hidden rounded-3xl bg-white dark:bg-gray-900 ${scrollable ? 'max-h-[85vh]' : ''} ${className}`}
            >
              {showCloseButton && (
                <button
                  onClick={onClose}
                  type="button"
                  aria-label="Close"
                  className="absolute right-3 top-3 z-10 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
                >
                  <CloseIcon />
                </button>
              )}

              {title && (
                <div className="shrink-0 px-6 pt-6 lg:px-10 lg:pt-10">
                  <DialogTitle className="pr-10 text-title-sm font-semibold text-gray-800 dark:text-white/90">
                    {title}
                  </DialogTitle>
                </div>
              )}

              <div
                className={`${noPadding ? '' : `px-6 lg:px-10 ${title ? 'pt-4' : 'pt-6 lg:pt-10'} ${footer ? 'pb-4' : 'pb-6 lg:pb-10'}`} ${scrollable ? 'flex-1 overflow-y-auto' : ''} ${bodyClassName}`}
              >
                {description && (
                  <Description className="mb-4 whitespace-pre-line break-words text-sm text-gray-500 dark:text-gray-400">
                    {description}
                  </Description>
                )}
                {children}
              </div>

              {footer && (
                <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800 lg:px-10">
                  {footer}
                </div>
              )}
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
