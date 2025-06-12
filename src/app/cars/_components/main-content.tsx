import { notFound } from "next/navigation";
import { FaDoorOpen, FaWrench } from "react-icons/fa";
import { PiEngineFill, PiSeatFill } from "react-icons/pi";
import { Calendar, Clock, Gauge, MapPin, PenTool as Tool } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCarById } from "@/lib/actions/car-action";

type Props = { params: { id?: string } };

const MainContent = async ({ params }: Props) => {
  if (!params.id) return notFound();

  const car = await getCarById(params.id);

  if (!car) return notFound();
  return (
    <div className="lg:col-span-2">
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold">{car.name}</h1>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>Los Angeles, CA</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-primary text-3xl font-bold">
                ${car.price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Market price</p>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{car.year}</span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-gray-500" />
              <span>{car.mileage} miles</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{car.transmission}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tool className="h-4 w-4 text-gray-500" />
              <span>{car.fuelType}</span>
            </div>
          </div>

          <ScrollArea>
            <div className="flex gap-2 py-4">
              {car.features.map((feature) => (
                <Badge className="flex-none" key={feature} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

      <Tabs defaultValue="details" className="mb-8">
        <TabsList className="w-full">
          <TabsTrigger value="details" className="flex-1">
            Vehicle Details
          </TabsTrigger>
          <TabsTrigger value="features" className="flex-1">
            Features & Specs
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1">
            Vehicle History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-xl font-semibold">Description</h3>
              <p className="mb-6 text-gray-400">{car.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold">Performance</p>
                  <ul className="space-y-1 text-sm text-gray-400">
                    <li>
                      0-100km/h: {car.specification?.acceleration} seconds
                    </li>
                    <li> Top Speed: {car.specification?.topSpeed} mph</li>
                    <li> Horsepower: {car.specification?.horsepower} hp</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">Dimensions</p>
                  <ul className="space-y-1 text-sm text-gray-400">
                    <li> Length: {car.specification?.length} inches</li>
                    <li> Width: {car.specification?.width} inches</li>
                    <li> Height: {car.specification?.height} inches</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-6">
          {/* we got - engineCapacity,doors,seats,topSpeed,accelaration,horsePower,torque */}
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-xl font-semibold">Features & Specs</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold">Engine</p>
                  <ul className="text-muted-foreground space-y-1 text-sm">
                    <li className="flex items-center gap-1">
                      <PiEngineFill /> Engine Capacity:{" "}
                      {car.specification?.engineCapacity} cc
                    </li>
                    <li className="flex items-center gap-1">
                      <FaWrench />
                      Torque: {car.specification?.torque} Nm
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">Interior</p>
                  <ul className="text-muted-foreground space-y-1 text-sm">
                    <li className="flex items-center gap-1">
                      <PiSeatFill /> Seats: {car.specification?.seats}
                    </li>
                    <li className="flex items-center gap-1">
                      <FaDoorOpen /> Doors: {car.specification?.doors}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold">Safety</p>
                  <ul className="space-y-1 text-sm text-gray-400">
                    <li>Airbags: Yes</li>
                    <li>ABS: Yes</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">Warranty</p>
                  <ul className="space-y-1 text-sm text-gray-400">
                    <li>Not Applicable</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold">Colors</p>
                  <ul className="flex items-center gap-2 text-sm text-gray-400">
                    {car.colors.map((color) => (
                      <li
                        className="h-10 w-10 rounded-md"
                        key={color}
                        style={{
                          backgroundColor: color,
                        }}
                      />
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">Type</p>
                  <ul className="flex items-center gap-2 text-sm text-gray-400">
                    <li className="h-10 w-10 rounded-md">{car.type}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-xl font-semibold">Vehicle History</h3>
              <p className="text-gray-400">
                This vehicle has a clean history with no accidents reported.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add content for other tabs */}
      </Tabs>
    </div>
  );
};

export default MainContent;
