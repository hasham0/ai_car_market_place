import { Suspense } from "react";
import { Image } from "@imagekit/next";
import ContactSellerForm from "./form";
import SellerInfo from "./seller-info";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getCarById } from "@/lib/actions/car-action";

type Props = { params: { id: string } };

const MainContent = async ({ params }: Props) => {
  const car = await getCarById(params.id);

  if (!car) {
    return <div className="text-center">Car not found</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Contact Form */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Seller</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-primary/5 flex items-center gap-4 rounded-lg p-4">
              <div className="relative h-20 w-32 flex-shrink-0">
                <Image
                  src={car.images[0]}
                  alt={car.name}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              <div>
                <h2 className="font-semibold">{car.name}</h2>
                <p className="text-sm text-gray-500">
                  {car.year} • {car.mileage} miles
                </p>
                <p className="text-primary mt-1 text-lg font-bold">
                  ${car.price.toLocaleString()}
                </p>
              </div>
            </div>
            <ContactSellerForm carId={car.id.toString()} />
          </CardContent>
        </Card>
      </div>

      {/* Dealer Information */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Dealer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Suspense fallback={<Skeleton className="h-16 w-16" />}>
              <SellerInfo id={params.id} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MainContent;
