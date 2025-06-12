"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Filter } from "lucide-react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { carTypes } from "@/constant/car";

export const Filters = () => {
  const router = useRouter();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleCheckChange = (type: string, change: CheckedState) => {
    if (!type) return;
    const newTypes = change
      ? [...activeFilters, type]
      : activeFilters.filter((t) => t !== type);
    setActiveFilters(newTypes);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const types = params.get("type")?.split(",") || [];
    setActiveFilters(types.map((t) => t.toUpperCase()));
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);

      if (activeFilters.length > 0) {
        params.set("type", activeFilters.join(","));
      } else {
        params.delete("type");
      }

      router.push(`?${params.toString()}`);
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [activeFilters, router]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <h5 className="font-bold">Car Type</h5>
        <div className="flex flex-col gap-1 p-2">
          {carTypes.map((i) => (
            <div key={i} className="flex items-center space-x-2">
              <Checkbox
                id={i}
                onCheckedChange={(change) => handleCheckChange(i, change)}
                checked={activeFilters?.includes(i)}
              />
              <label
                htmlFor={i}
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {i}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
