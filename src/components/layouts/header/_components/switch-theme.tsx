"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const SwitchTheme = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // prevent SSR mismatch

  return theme === "dark" ? (
    <Button
      variant="outline"
      onClick={() => setTheme("light")}
      className="hover:bg-muted flex h-10 w-10 items-center justify-center rounded-full"
    >
      <SunIcon />
    </Button>
  ) : (
    <Button
      variant="outline"
      onClick={() => setTheme("dark")}
      className="hover:bg-muted flex h-10 w-10 items-center justify-center rounded-full"
    >
      <MoonIcon />
    </Button>
  );
};

export default SwitchTheme;
