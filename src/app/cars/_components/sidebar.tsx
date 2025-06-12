import Link from "next/link";
import { notFound } from "next/navigation";
import { Shield } from "lucide-react";
import { Image } from "@imagekit/next";
import TestDrivenForm from "./test-driven-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSellerInfo } from "@/lib/actions/car-action";

type Props = { params: { id?: string } };

const Sidebar = async ({ params }: Props) => {
  if (!params.id) return notFound();

  const seller = await getSellerInfo(params.id);
  if (!seller) return notFound();

  return (
    <Card className="sticky top-4">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="relative h-16 w-16">
            <Image
              src={"/cars/profile.png"}
              alt="Dealer"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold">{seller.name}</h3>
            <p className="text-sm text-gray-500">Verified Dealer</p>
            <div className="text-primary flex items-center gap-1 text-sm">
              <Shield className="h-4 w-4" />
              <span>Premium Seller</span>
            </div>
          </div>
        </div>
        <Link href={`/contact/${seller.carId}`}>
          <Button className="mb-3 w-full">Contact Seller</Button>{" "}
        </Link>
        <TestDrivenForm carId={params.id} />
      </CardContent>
    </Card>
  );
};

export default Sidebar;
