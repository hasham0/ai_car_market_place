import { Suspense } from "react";
import Link from "next/link";
import { CarIcon, Plus } from "lucide-react";
import { Image } from "@imagekit/next";
import { FeaturedCars } from "./_components/featured-cars";
import { Filters } from "./_components/filter";
import PriceRangeFilterAndSearch from "./_components/price-range-filter";
import { Button } from "@/components/ui/button";

export type SearchParams = Promise<{ type: string; page: string }>;
type Props = {
  searchParams: SearchParams;
};

const features = [
  {
    title: "Verified Dealers",
    description:
      "All our dealers are thoroughly vetted and verified to ensure quality service",
  },
  {
    title: "Secure Transactions",
    description: "Your purchases are protected with our secure payment system",
  },
  {
    title: "Quality Guarantee",
    description: "Every vehicle undergoes a rigorous inspection process",
  },
];
export default async function Home({ searchParams }: Props) {
  const searchParamsData = await searchParams;

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex h-[500px] items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/cover_8v6-5GnuW"
            alt="Hero car"
            fill
            className="object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 px-4 text-center">
          <h1 className="mb-6 text-5xl font-bold text-white">
            Find Your Perfect Car
          </h1>
          <p className="mb-8 text-xl text-white">
            Browse through thousands of quality vehicles
          </p>

          {/* Search Bar */}
          <PriceRangeFilterAndSearch />
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Featured Cars</h2>
          <div className="flex gap-2">
            <Filters />

            <Button asChild>
              <Link href="/cars/add">
                <Plus className="mr-2 h-4 w-4" /> Add Listing
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Suspense
            fallback={<div className="h-48 animate-pulse bg-gray-200"></div>}
          >
            <FeaturedCars searchParams={searchParamsData} />
          </Suspense>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-neutral-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <CarIcon className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
