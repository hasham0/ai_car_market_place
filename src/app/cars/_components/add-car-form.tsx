"use client";

import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "@imagekit/next";
import { LucideWandSparkles, LucideX } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CarFuelType, CarType, carTypes } from "@/constant/car";
import { autoGenerateCar } from "@/lib/actions/ai-action";
import { addNewCar } from "@/lib/actions/car-action";
import { AddCarSchemaTS, addCarSchema } from "@/lib/zod";
import { useImagesStore } from "@/zustand/provider/provider";

type Props = {};

const AddCarForm = ({}: Props) => {
  const STORAGE_KEY = "new-car-details";
  const { images, removeImage, addImage, clearImages } = useImagesStore(
    useShallow((state) => state)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<AddCarSchemaTS>({
    resolver: zodResolver(addCarSchema),
    defaultValues: {
      name: "",
      brand: "",
      type: undefined,
      year: new Date().getFullYear(),
      mileage: 0,
      colors: [],
      price: 0,
      description: "",
      images: [],
      transmission: "AUTOMATIC",
      features: [],
      location: "",
      fuelType: undefined,
      engineCapacity: undefined,
      doors: undefined,
      seats: undefined,
      topSpeed: undefined,
      acceleration: undefined,
      horsepower: undefined,
      torque: undefined,
      length: undefined,
      width: undefined,
      height: undefined,
      weight: undefined,
      // Seller details
      sellerName: "",
      sellerImage: "",
      sellerPhone: "",
      sellerEmail: "",
      sellerAddress: "",
      sellerCity: "",
      sellerState: "",
      sellerZip: "",
      sellerCountry: "",
      sellerWebsite: "",
    },
  });
  const [isGenerateAILoading, setIsGenerateAILoading] = useState(false);
  const [submitHandlerLoading, setSubmitHandlerLoading] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [feature, setFeature] = useState<string>("");
  const [colors, setColors] = useState<string[]>([]);
  const [color, setColor] = useState<string>("");

  const addColor = useCallback(() => {
    if (!color || color.trim() === "" || colors.includes(color)) return;

    const newColors = [...colors, color];
    setColors(newColors);
    setValue("colors", newColors);
    setColor("");
  }, [color, colors, setValue]);

  const removeColor = useCallback(
    (colorToRemove: string) => {
      const newColors = colors.filter((c) => c !== colorToRemove);
      setColors(newColors);
      setValue("colors", newColors);
    },
    [colors, setValue]
  );

  const addFeatures = useCallback(() => {
    if (!feature || feature.trim() === "" || features.includes(feature)) return;

    const newFeatures = [...features, feature];
    setFeatures(newFeatures);
    setValue("features", newFeatures);
    setFeature("");
  }, [feature, features, setValue]);

  const removeFeature = useCallback(
    (featureToRemove: string) => {
      const newFeatures = features.filter((f) => f !== featureToRemove);
      setFeatures(newFeatures);
      setValue("features", newFeatures);
    },
    [features, setValue]
  );

  const resetState = useCallback(() => {
    clearImages();
    setColors([]);
    setFeatures([]);
    reset();
    localStorage.removeItem(STORAGE_KEY);
  }, [clearImages, reset]);

  const onSubmit = useCallback(
    async (data: AddCarSchemaTS) => {
      const toastId = toast.loading("Adding new car listing...");

      try {
        setSubmitHandlerLoading(true);
        await addNewCar(data);
        toast.success("Car listing added successfully", {
          id: toastId,
        });

        resetState();
      } catch (error) {
        if (error instanceof Error)
          toast.error(error.message, {
            id: toastId,
          });
        else
          toast.error("Error adding car listing", {
            id: toastId,
          });
      } finally {
        setSubmitHandlerLoading(false);
      }
    },
    [resetState, setSubmitHandlerLoading]
  );

  const autoGenerateHandler = useCallback(async () => {
    try {
      if (!watch("name"))
        return toast.error("Please enter a car name to generate images");
      setIsGenerateAILoading(true);
      // Generate Info
      const result = await autoGenerateCar(watch("name"));
      if (!result) {
        toast.error("Failed to generate car details");
        return;
      }
      setColors(result.colors);
      setFeatures(result.features);
      // set generated data to form state
      Object.entries(result).forEach(([key, value]) => {
        if (key === "images") return;
        if (key === "sellerImage") {
          setValue("sellerImage", "/profile.png");
          return;
        }
        setValue(key as keyof AddCarSchemaTS, value as string);
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
      toast.success("Car details generated successfully");
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Failed to generate car details");
    } finally {
      setIsGenerateAILoading(false);
    }
  }, [watch, setValue]);

  useEffect(() => {
    setValue("images", images);

    const savedCarDetails = localStorage.getItem(STORAGE_KEY);

    if (!savedCarDetails) return;
    const parsedDetails = JSON.parse(savedCarDetails) as AddCarSchemaTS;

    setColors(parsedDetails.colors);
    setFeatures(parsedDetails.features);

    Object.entries(parsedDetails).forEach(([key, value]) => {
      setValue(key as keyof AddCarSchemaTS, value as string);
    });
  }, [images, setValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <p>Add New Car Listing</p>
          <Button
            variant="ghost"
            onClick={autoGenerateHandler}
            disabled={isGenerateAILoading}
          >
            {isGenerateAILoading ? (
              <LucideWandSparkles className="direction-alternate animate-ping duration-300 ease-out" />
            ) : (
              <LucideWandSparkles />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Car Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., BMW M4 Competition"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">
                    {errors.name.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  placeholder="e.g., BMW, Tesla, Porsche"
                  {...register("brand")}
                />
                {errors.brand && (
                  <p className="text-sm text-red-500">
                    {errors.brand.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Car Type</Label>
                <Select
                  onValueChange={(value) => setValue("type", value as CarType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select car type" />
                  </SelectTrigger>
                  <SelectContent>
                    {carTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0) + type.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500">
                    {errors.type.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="e.g., 2023"
                  {...register("year")}
                />
                {errors.year && (
                  <p className="text-sm text-red-500">
                    {errors.year.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  id="mileage"
                  type="number"
                  placeholder="e.g., 1200"
                  {...register("mileage")}
                />
                {errors.mileage && (
                  <p className="text-sm text-red-500">
                    {errors.mileage.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g., 50000"
                  {...register("price")}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">
                    {errors.price.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("transmission", value as "MANUAL" | "AUTOMATIC")
                  }
                  defaultValue={"AUTOMATIC"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AUTOMATIC">Automatic</SelectItem>
                    <SelectItem value="MANUAL">Manual</SelectItem>
                  </SelectContent>
                </Select>
                {errors.transmission && (
                  <p className="text-sm text-red-500">
                    {errors.transmission.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("fuelType", value as CarFuelType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent defaultValue={"GASOLINE"}>
                    <SelectItem value="GASOLINE">Gasoline</SelectItem>
                    <SelectItem value="PETROL">Petrol</SelectItem>
                    <SelectItem value="DIESEL">Diesel</SelectItem>
                    <SelectItem value="ELECTRIC">Electric</SelectItem>
                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
                {errors.fuelType && (
                  <p className="text-sm text-red-500">
                    {errors.fuelType.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Los Angeles, CA"
                  {...register("location")}
                />
                {errors.location && (
                  <p className="text-sm text-red-500">
                    {errors.location.message as string}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Colors</h3>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Add a color..."
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <Button type="button" onClick={addColor}>
                Add
              </Button>
            </div>
            {errors.colors && (
              <p className="text-sm text-red-500">
                {errors.colors.message as string}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {colors.map((c, idx) => (
                <Badge key={idx} className="flex items-center gap-1">
                  {c}
                  <LucideX
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeColor(c)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Features</h3>
            <div className="flex items-center gap-2">
              <Input
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
                placeholder="Add a feature..."
              />
              <Button onClick={addFeatures} type="button">
                Add
              </Button>
            </div>
            {errors.features && (
              <p className="text-sm text-red-500">
                {errors.features.message as string}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {features.map((f, idx) => (
                <Badge key={idx} className="flex items-center gap-1">
                  {f}
                  <LucideX
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeFeature(f)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Car Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Car Specifications (Optional)
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="engineCapacity">Engine Capacity (cc)</Label>
                <Input
                  id="engineCapacity"
                  type="number"
                  placeholder="e.g., 2998"
                  {...register("engineCapacity")}
                />
                {errors.engineCapacity && (
                  <p className="text-sm text-red-500">
                    {errors.engineCapacity.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="horsepower">Horsepower</Label>
                <Input
                  id="horsepower"
                  type="number"
                  placeholder="e.g., 503"
                  {...register("horsepower")}
                />
                {errors.horsepower && (
                  <p className="text-sm text-red-500">
                    {errors.horsepower.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="torque">Torque (Nm)</Label>
                <Input
                  id="torque"
                  type="number"
                  placeholder="e.g., 650"
                  {...register("torque")}
                />
                {errors.torque && (
                  <p className="text-sm text-red-500">
                    {errors.torque.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="acceleration">0-60 mph (seconds)</Label>
                <Input
                  id="acceleration"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 3.2"
                  {...register("acceleration")}
                />
                {errors.acceleration && (
                  <p className="text-sm text-red-500">
                    {errors.acceleration.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="topSpeed">Top Speed (mph)</Label>
                <Input
                  id="topSpeed"
                  type="number"
                  placeholder="e.g., 155"
                  {...register("topSpeed")}
                />
                {errors.topSpeed && (
                  <p className="text-sm text-red-500">
                    {errors.topSpeed.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="doors">Doors</Label>
                <Input
                  id="doors"
                  type="number"
                  placeholder="e.g., 4"
                  {...register("doors")}
                />
                {errors.doors && (
                  <p className="text-sm text-red-500">
                    {errors.doors.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="seats">Seats</Label>
                <Input
                  id="seats"
                  type="number"
                  placeholder="e.g., 5"
                  {...register("seats")}
                />
                {errors.seats && (
                  <p className="text-sm text-red-500">
                    {errors.seats.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="length">Length (mm)</Label>
                <Input
                  id="length"
                  type="number"
                  placeholder="e.g., 4794"
                  {...register("length")}
                />
                {errors.length && (
                  <p className="text-sm text-red-500">
                    {errors.length.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="width">Width (mm)</Label>
                <Input
                  id="width"
                  type="number"
                  placeholder="e.g., 1887"
                  {...register("width")}
                />
                {errors.width && (
                  <p className="text-sm text-red-500">
                    {errors.width.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height (mm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="e.g., 1393"
                  {...register("height")}
                />
                {errors.height && (
                  <p className="text-sm text-red-500">
                    {errors.height.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="e.g., 1800"
                  {...register("weight")}
                />
                {errors.weight && (
                  <p className="text-sm text-red-500">
                    {errors.weight.message as string}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Description</h3>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of the vehicle..."
                rows={6}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Images</h3>
            <div className="space-y-2">
              <Label htmlFor="mainImage">Image URL</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="mainImage"
                  placeholder="Enter the URL of the image (direct link image path)"
                />
                <Button
                  type="button"
                  onClick={() =>
                    addImage(
                      "cars/7f5079f1-9a92-4afb-978e-7d040791720c_REwBhP4DL.jpg"
                    )
                  }
                >
                  Add
                </Button>
              </div>
              {errors.images && (
                <p className="text-sm text-red-500">
                  {errors.images.message as string}
                </p>
              )}
            </div>

            {images.length > 0 && (
              <Carousel>
                <CarouselContent>
                  {images.map((item, idx) => (
                    <CarouselItem key={idx} className="relative">
                      <Image
                        src={item}
                        width={1000}
                        height={500}
                        alt={`Image-${idx}`}
                        className="h-96 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(item)}
                        className="bg-primary text-secondary absolute top-2 right-2 rounded-full p-1"
                      >
                        <LucideX className="h-5 w-5" />
                      </button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
          </div>

          {/* Seller Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Seller Details</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sellerName">Seller Name</Label>
                <Input
                  id="sellerName"
                  placeholder="e.g., John Doe"
                  {...register("sellerName")}
                />
                {errors.sellerName && (
                  <p className="text-sm text-red-500">
                    {errors.sellerName.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellerPhone">Phone</Label>
                <Input
                  id="sellerPhone"
                  placeholder="e.g., +1 (555) 123-4567"
                  {...register("sellerPhone")}
                />
                {errors.sellerPhone && (
                  <p className="text-sm text-red-500">
                    {errors.sellerPhone.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellerEmail">Email</Label>
                <Input
                  id="sellerEmail"
                  type="email"
                  placeholder="e.g., john@example.com"
                  {...register("sellerEmail")}
                />
                {errors.sellerEmail && (
                  <p className="text-sm text-red-500">
                    {errors.sellerEmail.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellerWebsite">Website</Label>
                <Input
                  id="sellerWebsite"
                  placeholder="e.g., https://example.com"
                  {...register("sellerWebsite")}
                />
                {errors.sellerWebsite && (
                  <p className="text-sm text-red-500">
                    {errors.sellerWebsite.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellerImage">Profile Image URL</Label>
                <Input
                  id="sellerImage"
                  placeholder="e.g., https://example.com/profile.jpg"
                  {...register("sellerImage")}
                />
                {errors.sellerImage && (
                  <p className="text-sm text-red-500">
                    {errors.sellerImage.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellerAddress">Address</Label>
                <Input
                  id="sellerAddress"
                  placeholder="e.g., 123 Main St"
                  {...register("sellerAddress")}
                />
                {errors.sellerAddress && (
                  <p className="text-sm text-red-500">
                    {errors.sellerAddress.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellerCity">City</Label>
                <Input
                  id="sellerCity"
                  placeholder="e.g., Los Angeles"
                  {...register("sellerCity")}
                />
                {errors.sellerCity && (
                  <p className="text-sm text-red-500">
                    {errors.sellerCity.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellerState">State</Label>
                <Input
                  id="sellerState"
                  placeholder="e.g., CA"
                  {...register("sellerState")}
                />
                {errors.sellerState && (
                  <p className="text-sm text-red-500">
                    {errors.sellerState.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellerZip">Zip Code</Label>
                <Input
                  id="sellerZip"
                  placeholder="e.g., 90001"
                  {...register("sellerZip")}
                />
                {errors.sellerZip && (
                  <p className="text-sm text-red-500">
                    {errors.sellerZip.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellerCountry">Country</Label>
                <Input
                  id="sellerCountry"
                  placeholder="e.g., USA"
                  {...register("sellerCountry")}
                />
                {errors.sellerCountry && (
                  <p className="text-sm text-red-500">
                    {errors.sellerCountry.message as string}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4">
            <Button type="submit" disabled={submitHandlerLoading}>
              Add Listing
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddCarForm;
