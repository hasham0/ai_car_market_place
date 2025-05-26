"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, SmileIcon } from "lucide-react";
import { toast } from "sonner";
import { string } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { findCar } from "@/lib/actions/car";

//import { findCar } from "@/lib/actions/ai-action";

type Props = {};

const AiSearch = ({}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");

  const router = useRouter();
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!description) return toast.error("Please enter some description first");

    setIsLoading(true);

    try {
      const result: "No car found" | "Error generating car search" | string =
        await findCar(description);
      const carId = string().parse(result);
      router.replace(`/cars/${carId}`);
      toast.success(`Car found with ID: ${carId}`);
      setDescription("");
      setIsOpen(false);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger className="bg-muted hover:bg-muted mr-4 ml-auto flex items-center gap-2 rounded-lg px-4 py-2">
        <SearchIcon className="h-4 w-4" /> Search with AI
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Define what type of car you like </DialogTitle>
          <DialogDescription>
            You can tell features like color, type, and model. For example: I
            like a red SUV with a sunroof.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={submitHandler}>
          <Textarea
            placeholder="Write about your dream car..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="max-h-[20rem]"
          />

          <Button disabled={isLoading} className="flex items-center gap-1">
            {isLoading ? (
              "Searching..."
            ) : (
              <>
                <SmileIcon className="h-5 w-5" /> Find my dream car
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AiSearch;
