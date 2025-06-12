import { notFound } from "next/navigation";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Image } from "@imagekit/next";
import { format } from "date-fns";
import { getSellerInfo } from "@/lib/actions/car-action";

type Props = { id: string };

const SellerInfo = async ({ id }: Props) => {
  const seller = await getSellerInfo(id);

  if (!seller) return notFound();
  return (
    <>
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16">
          <Image
            src={seller?.image || "/cars/profile.png"}
            alt="Dealer"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold">{seller.name}</h3>
          <p className="text-sm text-gray-500">
            Verified Dealer since{" "}
            {format(new Date(seller.createdAt), "MMMM yyyy")}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-gray-500" />
          <div>
            <p className="font-medium">Location</p>
            <p className="text-sm text-gray-500">
              {seller.address} {seller.city}, {seller.state}, {seller.country}{" "}
              {seller.postalCode}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-gray-500" />
          <div>
            <p className="font-medium">Phone</p>
            <p className="text-sm text-gray-500">{seller.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-gray-500" />
          <div>
            <p className="font-medium">Email</p>
            <p className="text-sm text-gray-500">{seller.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-gray-500" />
          <div>
            <p className="font-medium">Business Hours</p>
            <p className="text-sm text-gray-500">
              Mon - Sat: 9:00 AM - 7:00 PM
            </p>
            <p className="text-sm text-gray-500">Sun: 10:00 AM - 5:00 PM</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerInfo;
