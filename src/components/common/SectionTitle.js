export default function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="font-display text-xl font-bold text-wine-700 sm:text-2xl">{children}</h2>
      <span aria-hidden="true" className="flex items-center gap-1 text-gold-500">
        <span className="h-px w-5 bg-current" />
        <span className="h-2 w-2 rotate-45 border border-current" />
        <span className="h-px w-5 bg-current" />
      </span>
    </div>
  );
}