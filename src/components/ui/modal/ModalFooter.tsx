'use client';

type ModalButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  className?: string;
};

const variants = {
  primary:
    'bg-black text-white hover:bg-gray-800 focus:ring-gray-400',

  secondary:
    'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-300',

  danger:
    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-400',

  ghost:
    'text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
};

export function ModalButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  variant = 'primary',
  className = '',
}: ModalButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex
        min-w-[100px]
        items-center
        justify-center
        gap-2
        rounded-lg
        px-4
        py-2.5
        text-sm
        font-medium
        transition
        focus:outline-none
        focus:ring-2
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${className}
      `}
    >
      {loading && (
        <span
          className="
            h-4
            w-4
            animate-spin
            rounded-full
            border-2
            border-current
            border-t-transparent
          "
        />
      )}

      {children}
    </button>
  );
}