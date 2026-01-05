import localFont from 'next/font/local'

export const Gowun = localFont({
  src: [
    {
      path: '../../public/fonts/GowunBatang-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GowunBatang-Bold.woff',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-gowun',
  display: 'swap',
})
