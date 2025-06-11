"use server";

import { unstable_cache as cache, revalidatePath } from "next/cache";
import { Car, CarType, User } from "@prisma/client";
import { auth } from "../auth";
import { prisma } from "../prisma";
import { AddCarSchemaTS } from "../zod";
import { carTypes } from "@/constant/car";

const generateImage = async (text: string, name: string) => {
  try {
    const encodedText = encodeURIComponent(text);
    const imagePath = `${name}.jpg`;

    const URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
    if (!URL_ENDPOINT) throw new Error("URL_ENDPOINT is not defined");

    const url = `${URL_ENDPOINT}/ik-genimg-prompt-${encodedText}/${imagePath}`;

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (!privateKey) throw new Error("IMAGEKIT_PRIVATE_KEY is not defined");

    const base64Key = btoa(`${privateKey}:`);
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${base64Key}`,
      },
    });
    if (!res.ok) throw new Error("Failed to generate image");

    const blob = await res.blob();
    const buffer = await blob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    return {
      base64Data: `data:image/jpeg;base64,${base64}`,
      name: imagePath,
    };
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image");
  }
};

const addNewCar = async (carData: AddCarSchemaTS) => {
  const session = await auth();
  const authUser = session?.user;

  if (!authUser) throw new Error("User not authenticated");

  const user: User | null = await prisma.user.findUnique({
    where: {
      email: authUser.email!,
    },
  });

  if (!user) throw new Error("User not found");

  await prisma.$transaction(async (tx) => {
    const {
      name,
      brand,
      type,
      year,
      mileage,
      colors,
      price,
      description,
      images,
      features,
      location,
      fuelType,
    } = carData;

    const car: Car = await tx.car.create({
      data: {
        name,
        brand,
        type,
        year,
        mileage,
        colors,
        price,
        description,
        images,
        features,
        location,
        fuelType,
        userId: user.id,
      },
    });

    const {
      sellerAddress,
      sellerCity,
      sellerCountry,
      sellerEmail,
      sellerName,
      sellerPhone,
      sellerState,
      sellerWebsite,
      sellerZip,
      sellerImage,
    } = carData;

    await tx.carSeller.create({
      data: {
        address: sellerAddress,
        city: sellerCity,
        country: sellerCountry,
        email: sellerEmail,
        name: sellerName,
        phone: sellerPhone,
        state: sellerState,
        website: sellerWebsite,
        postalCode: sellerZip,
        image: sellerImage,
        carId: car.id,
      },
    });

    const {
      engineCapacity,
      doors,
      seats,
      topSpeed,
      acceleration,
      horsepower,
      torque,
      length,
      width,
      height,
      weight,
    } = carData;

    await tx.carSpecification.create({
      data: {
        engineCapacity,
        doors,
        seats,
        topSpeed,
        acceleration,
        horsepower,
        torque,
        length,
        width,
        height,
        weight,
        carId: car.id,
      },
    });

    return car;
  });
  revalidatePath("/");
};

const getAllCars = cache(
  async () => {
    const cars = await prisma.car.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return cars;
  },
  ["cars"],
  { revalidate: 60 * 60 * 24 }
);

const getCars = cache(
  async ({ page = 1, type = "all" }: { page?: number; type?: string }) => {
    const limit = 8;
    const offset = (page - 1) * limit;
    const allowedTypes = type
      .split(",")
      .filter(Boolean)
      .map((t) => t.toUpperCase()) as [];

    const isValidType = allowedTypes.some(
      (t) => carTypes.includes(t as CarType) || t === "all"
    );
    const cars = await prisma.car.findMany({
      skip: offset,
      take: limit,
      where: {
        ...(type !== "all" &&
          isValidType && {
            type: { in: allowedTypes },
          }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return cars;
  },
  [],
  {
    revalidate: 60 * 60 * 24,
  }
);
// const findCar = async (description: string) => {};
// const bookmarkCar = async (carId: string) => {};
// const getBookmarkCars = async () => {};

export {
  addNewCar,
  getAllCars,
  getCars,
  // findCar,
  // bookmarkCar,
  // getBookmarkCars,
  generateImage,
};
