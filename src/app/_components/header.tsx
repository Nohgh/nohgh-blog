import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";

const Header = () => {
  return (
    <header className="font-gowun sticky top-0 py-2 pr-12 z-40 h-[40px] w-full flex flex-row justify-end gap-6 text-base 2xl:text-lg">
      <Link href="/" className="hover:underline">
        홈
      </Link>
      <Link href="/about" className="hover:underline">
        about
      </Link>
      <ThemeSwitcher />
    </header>
  );
};

export default Header;
