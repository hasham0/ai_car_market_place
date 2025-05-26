"use server";

const getCars = async ({}) => {};

const findCar = async (description: string) => {};
const bookmarkCar = async (carId: string) => {};
const getBookmarkCars = async () => {
  const cars = await getCars({});
};
export { getCars, findCar, bookmarkCar, getBookmarkCars };
