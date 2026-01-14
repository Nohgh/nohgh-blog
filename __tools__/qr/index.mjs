import { exec } from 'child_process'
import localIpUrl from 'local-ip-url'
import qr from 'qrcode-terminal'

export function startDevServerWithQR() {
  const port = Number(process.env.PORT) || 3000
  const ip = localIpUrl('public')

  const url = `http://${ip}:${port}`
  console.log(`\n Local Network URL: ${url}\n`)

  qr.generate(url, { small: true })

  const nextDev = exec(`next dev --turbopack -p ${port}`)

  nextDev.stdout.pipe(process.stdout)
  nextDev.stderr.pipe(process.stderr)
}
