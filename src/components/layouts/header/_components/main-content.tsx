import Link from "next/link";
import { Image } from "@imagekit/next";
import RemoveBookmark from "./remove-bookmark";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getBookmarkCars } from "@/lib/actions/car-action";

type Props = {};

const MainContent = async ({}: Props) => {
  const cars = await getBookmarkCars();
  if (!cars) return <p className="text-center">No cars found</p>;

  if (cars.length === 0) return <p className="text-center">No cars saved</p>;
  return cars.map((car) => (
    <Card key={car.id} className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={car.images[0]}
          alt={car.name}
          fill
          className="object-cover"
        />

        <RemoveBookmark carId={car.id} />
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
        <div className="mt-4 flex gap-2">
          <Button className="w-full" asChild>
            <Link href={`/cars/${car.id}`}>View Details</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/contact/${car.id}`}>Contact Seller</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  ));
};

export default MainContent;
