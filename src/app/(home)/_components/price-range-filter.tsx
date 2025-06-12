"use client";

import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Image } from "@imagekit/next";
import { Car } from "@prisma/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSearchCarByTextOrPrice } from "@/lib/actions/car-action";

type Props = {};

const PriceRangeFilterAndSearch = ({}: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("");
  const [cars, setCars] = useState<Car[]>([]); // Adjust type as needed
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchTerm || !priceRange) {
      toast.error("Please enter a model and select a price range.");
      return;
    }
    let result: Car[] = [];
    try {
      if (priceRange === "all") {
        result = await getSearchCarByTextOrPrice({ searchTerm });
      } else {
        result = await getSearchCarByTextOrPrice({
          searchTerm,
          priceRange,
        });
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Error finding cars");
    } finally {
      setCars(result);
      setIsDrawerOpen(true);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-4 shadow-lg dark:bg-zinc-950">
        <form
          className="grid grid-cols-1 gap-4 md:grid-cols-4"
          onSubmit={handleSubmit}
        >
          <Input
            placeholder="Search by make, model..."
            className="md:col-span-2"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <Select onValueChange={(value) => setPriceRange(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent defaultValue={"all"}>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="0-10000">$0 - $10,000</SelectItem>
              <SelectItem value="10000-20000">$10,000 - $20,000</SelectItem>
              <SelectItem value="20000-30000">$20,000 - $30,000</SelectItem>
              <SelectItem value="30000+">$30,000+</SelectItem>
            </SelectContent>
          </Select>
          <Button className="w-full" type="submit">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </form>
      </div>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Search Results</DrawerTitle>
            <div
              className={`flex items-center ${cars.length === 1 ? "justify-center" : "justify-evenly"} mt-2`}
            >
              {cars.map((car) => (
                <Card key={car.id} className="w-72 min-w-52 overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={car.images[0]}
                      alt={car.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{car.name}</h3>
                        <p className="text-sm text-gray-500">
                          {car.year} • {car.mileage} miles
                        </p>
                      </div>
                      <p className="text-primary text-xl font-bold">
                        ${car.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="mt-4 flex min-w-full flex-col items-center justify-between gap-2">
                      <Button className="w-full flex-1" asChild>
                        <Link href={`/cars/${car.id}`}>View Details</Link>
                      </Button>
                      <Button className="w-full flex-1" asChild>
                        <Link href={`/contact/${car.id}`}>Contact Seller</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PriceRangeFilterAndSearch;
