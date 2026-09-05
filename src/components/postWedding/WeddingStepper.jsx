import { Check } from '@/components/Icons';

const steps = [
  'Your Details',
  "Partner's Details",
  'Your Story',
  'Wedding Details',
  'Wedding Photos',
];

export default function WeddingStepper({ currentStep, highestAvailableStep, onStepChange }) {
  return (
    <ol aria-label="Wedding publishing progress" className="flex min-w-max items-start px-1 sm:min-w-0">
      {steps.map((label, index) => {
        const step = index + 1;
        const isComplete = step < currentStep;
        const isCurrent = step === currentStep;
        const isAvailable = step <= highestAvailableStep;

        return (
          <li key={label} className="relative flex min-w-28 flex-1 flex-col items-center text-center sm:min-w-0">
            {index > 0 && <span aria-hidden="true" className={`absolute right-1/2 top-4 h-px w-full ${isComplete || isCurrent ? 'bg-wine-500' : 'bg-gold-200'}`} />}
            <button
              type="button"
              onClick={() => isAvailable && onStepChange(step)}
              disabled={!isAvailable}
              aria-current={isCurrent ? 'step' : undefined}
              className={`relative z-10 grid h-8 w-8 place-items-center rounded-full border text-xs font-semibold transition-colors ${
                isComplete
                  ? 'border-wine-700 bg-wine-700 text-cream-50'
                  : isCurrent
                    ? 'border-wine-700 bg-wine-700 text-cream-50 ring-4 ring-wine-100'
                    : 'border-gold-300 bg-cream-50 text-ink-soft'
              } ${isAvailable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            >
              {isComplete ? <Check className="h-4 w-4" /> : step}
            </button>
            <span className={`mt-2 text-[11px] font-medium leading-4 ${isCurrent ? 'text-wine-700' : 'text-ink-soft'}`}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}