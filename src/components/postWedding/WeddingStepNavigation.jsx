import { ArrowRight } from '@/components/Icons';

export default function WeddingStepNavigation({ isSaving, isSubmitting, onNext, onPrevious, onSubmit, step }) {
  const isFirstStep = step === 1;
  const isFinalStep = step === 5;
  const isPending = isSaving || isSubmitting;

  return (
    <div className={`flex flex-wrap gap-3 border-t border-gold-200/80 pt-5 ${isFirstStep ? 'justify-between' : 'justify-between'}`}>
      {isFirstStep ? (
        <button type="button" onClick={onPrevious} disabled={isPending} className="min-h-10 rounded-md border border-wine-300 px-5 text-sm font-semibold text-wine-700 transition-colors hover:bg-wine-50 disabled:cursor-not-allowed disabled:opacity-60">
          Cancel
        </button>
      ) : (
        <button type="button" onClick={onPrevious} disabled={isPending} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-wine-300 px-5 text-sm font-semibold text-wine-700 transition-colors hover:bg-wine-50 disabled:cursor-not-allowed disabled:opacity-60">
          <ArrowRight className="h-4 w-4 rotate-180" />
          Previous
        </button>
      )}

      {isFinalStep ? (
        <button type="button" onClick={onSubmit} disabled={isPending} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-wine-700 px-5 text-sm font-semibold text-cream-50 shadow-sm transition-colors hover:bg-wine-600 focus:outline-none focus:ring-2 focus:ring-wine-300 disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? 'Publishing...' : 'Submit Wedding'}
          <ArrowRight className="h-4 w-4" />
        </button>
      ) : (
        <button type="button" onClick={onNext} disabled={isPending} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-wine-700 px-5 text-sm font-semibold text-cream-50 shadow-sm transition-colors hover:bg-wine-600 focus:outline-none focus:ring-2 focus:ring-wine-300 disabled:cursor-not-allowed disabled:opacity-60">
          {isSaving ? 'Saving...' : 'Next'}
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}