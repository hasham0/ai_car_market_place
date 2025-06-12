"use client";

import { useOptimistic } from "react";
import { HeartIcon, Share2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { bookmarkCar } from "@/lib/actions/car-action";

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy text: ", err);
    toast.error("Failed to copy text");
  }
};

type Props = {
  savedBy: {
    id: string;
  }[];
  carId: string;
  userId?: string;
};

const CoverButtons = ({ savedBy, carId, userId }: Props) => {
  const isSavedByMe = savedBy.some((user) => user.id === userId);

  const [isSaved, startTransition] = useOptimistic(
    isSavedByMe,
    (state) => !state
  );
  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <Button
        variant="default"
        size="icon"
        onClick={() => copyToClipboard(`${window.location.href}`)}
      >
        <Share2Icon className="h-5 w-5" />
      </Button>
      <form
        action={async () => {
          startTransition(true);
          await bookmarkCar(carId);
        }}
      >
        <Button variant="default" size="icon">
          {isSaved ? (
            <>
              <HeartIcon className="h-5 w-5 fill-rose-600" />
            </>
          ) : (
            <HeartIcon className="z-10 h-5 w-5 fill-none" />
          )}
        </Button>
      </form>
    </div>
  );
};

export default CoverButtons;
