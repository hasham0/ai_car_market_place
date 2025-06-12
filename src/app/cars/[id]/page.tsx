import React, { Suspense } from "react";
import Cover from "../_components/cover";
import MainContent from "../_components/main-content";
import Sidebar from "../_components/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllCars } from "@/lib/actions/car-action";

export async function generateStaticParams() {
  const cars = await getAllCars();
  return cars.map((car) => ({
    id: car.id.toString(),
  }));
}

type Props = { params: Promise<{ id?: string }> };

export default async function CarPage({ params }: Props) {
  const resolvesParams = await params;
  return (
    <div className="container mx-auto py-10">
      <main className="min-h-screen bg-white pb-16 dark:bg-zinc-900">
        {/* Image Gallery */}
        <div className="relative h-[60vh] bg-black">
          <Suspense fallback={<Skeleton className="h-full w-full" />}>
            <Cover params={resolvesParams} />
          </Suspense>
        </div>

        <div className="relative z-10 mx-auto -mt-16 max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content */}

            <Suspense
              fallback={
                <div className="lg:col-span-2">
                  <Skeleton className="h-96 w-full" />
                </div>
              }
            >
              <MainContent params={resolvesParams} />
            </Suspense>

            {/* Sidebar */}
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <Sidebar params={resolvesParams} />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
