"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

type Props = {};

const SwitchTheme = ({}: Props) => {
  const { theme, setTheme } = useTheme();

  return theme === "dark" ? (
    <button
      onClick={() => setTheme("light")}
      className="hover:bg-muted flex h-10 w-10 items-center justify-center rounded-full"
    >
      <SunIcon />
    </button>
  ) : (
    <button
      onClick={() => setTheme("dark")}
      className="hover:bg-muted flex h-10 w-10 items-center justify-center rounded-full"
    >
      <MoonIcon />
    </button>
  );
};

export default SwitchTheme;
