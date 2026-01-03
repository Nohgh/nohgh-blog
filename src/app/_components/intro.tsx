import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["cyrillic"] });

export function Intro() {
  return (
    <section
      className={`${inter.className}flex-col md:flex-row flex items-center md:justify-between mt-16 mb-4 md:mb-12 `}
    >
      <h3 className="text-2xl md:text-3xl font-semibold tracking-tighter leading-tight dark:text-neutral-300">
        Nohgh.
      </h3>
    </section>
  );
}
