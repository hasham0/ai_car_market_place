"use server";

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
    console.log("Image generated successfully");

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
const getCars = async ({}) => {};
const findCar = async (description: string) => {};
const bookmarkCar = async (carId: string) => {};
const getBookmarkCars = async () => {};

export { getCars, findCar, bookmarkCar, getBookmarkCars, generateImage };
