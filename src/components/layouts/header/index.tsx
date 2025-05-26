import Link from "next/link";
import AiSearch from "./_components/ai-search";
import HeaderAuth from "./_components/header-auth";
import SwitchTheme from "./_components/switch-theme";

type Props = {};

const Header = ({}: Props) => {
  return (
    <header className="flex h-16 items-center border-b bg-white px-4 dark:bg-black dark:text-white">
      <Link href="/" className="flex items-center gap-2 px-4 text-lg">
        Logo
      </Link>
      <AiSearch />
      <SwitchTheme />
      <HeaderAuth />
    </header>
  );
};

export default Header;
