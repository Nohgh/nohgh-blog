import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics as VercelAnalytics } from '@vercel/analytics/next'

export function Analytics() {
  return (
    <>
      <VercelAnalytics />
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GAID!} />
    </>
  )
}
