// Payment progress bar — one segment per person.
// Paid segments: hatched (dark). Unpaid: empty border.

type Props = {
  total: number   // total number of shares
  paid: number    // how many are paid
}

export default function ProgressBar({ total, paid }: Props) {
  return (
    <div className="flex gap-1.5 h-3">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 border-2 rounded-sm ${
            i < paid
              ? 'border-brand-black hatch'
              : 'border-brand-border'
          }`}
        />
      ))}
    </div>
  )
}
