import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {};

const Loader = ({}: Props) => {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <Skeleton className="h-96 lg:col-span-2" />
      <div className="lg:col-span-1">
        <Skeleton className="h-96" />
        <Skeleton className="mt-4 h-96" />
        <Skeleton className="mt-4 h-96" />
        <Skeleton className="mt-4 h-96" />
        <Skeleton className="mt-4 h-96" />
        <Skeleton className="mt-4 h-96" />
        <Skeleton className="mt-4 h-96" />
        <Skeleton className="mt-4 h-96" />
      </div>
    </div>
  );
};

export default Loader;
