import localFont from 'next/font/local'

export const Gowun = localFont({
  src: [
    {
      path: '../../public/fonts/GowunBatang-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GowunBatang-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-gowun',
})
