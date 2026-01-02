import localFont from "next/font/local";

export const Gowun = localFont({
  src: [
    {
      path: "../../public/fonts/GowunBatang-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GowunBatang-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-gowun",
  display: "swap",
});
