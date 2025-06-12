import { notFound } from "next/navigation";
import { Image } from "@imagekit/next";
import CoverButtons from "./cover-buttons";
import { getCarById } from "@/lib/actions/car-action";
import { getMyProfile } from "@/lib/actions/user-actions";
import { auth } from "@/lib/auth";

type Props = { params: { id?: string } };

const Cover = async ({ params }: Props) => {
  if (!params.id) return notFound();

  const car = await getCarById(params.id);
  if (!car) return notFound();

  const session = await auth();
  const user = await getMyProfile(session?.user?.email);

  return car.images.length > 0 ? (
    <>
      <Image
        src={car.images[0]}
        alt="Car Image"
        fill
        className="object-cover"
      />
      <CoverButtons carId={params.id} userId={user?.id} savedBy={car.savedBy} />
    </>
  ) : (
    <div className="h-full bg-gray-200"></div>
  );
};

export default Cover;
