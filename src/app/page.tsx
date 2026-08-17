import { strings } from '@/lib/strings'

// Root page: shown if someone visits the domain root without a table QR.
// In production this path is rarely hit — QR codes point to /table/[id].
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-surface-off px-6">
      <div className="text-center">
        <p className="text-lg text-brand-grey-mid">{strings.app.tagline}</p>
        <p className="mt-2 text-sm text-brand-grey-light">
          Lütfen masanızdaki QR kodu okutun.
        </p>
      </div>
    </div>
  )
}
