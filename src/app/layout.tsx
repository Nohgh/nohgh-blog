import "./globals.css";
import { HOME_OG_IMAGE_URL } from "@/lib/constants";
import type { Metadata } from "next";
import cn from "classnames";
import { Gowun } from "./fonts";
import Header from "./_components/header";

export const metadata: Metadata = {
  title: `Nohgh Blog`,
  description: `안녕하세요. 노기훈의 블로그입니다.`,
  openGraph: {
    images: [HOME_OG_IMAGE_URL],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(Gowun.variable)}>
      <body
        className={cn(
          "flex min-h-screen flex-col dark:bg-zinc-900 dark:text-neutral-400 bg-[#FFF9F4]"
        )}
      >
        <Header />
        <div className="flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
