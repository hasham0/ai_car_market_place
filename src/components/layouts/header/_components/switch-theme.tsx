"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

type Props = {};

const SwitchTheme = ({}: Props) => {
  const { theme, setTheme } = useTheme();

  return theme === "dark" ? (
    <Button
      variant={"ghost"}
      onClick={() => setTheme("light")}
      className="hover:bg-muted flex h-10 w-10 items-center justify-center rounded-full"
    >
      <SunIcon />
    </Button>
  ) : (
    <Button
      variant={"ghost"}
      onClick={() => setTheme("dark")}
      className="hover:bg-muted flex h-10 w-10 items-center justify-center rounded-full"
    >
      <MoonIcon />
    </Button>
  );
};

export default SwitchTheme;
