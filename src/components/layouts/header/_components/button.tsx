"use client";

import { LucideX } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type Props = {};

const RemoveBookmarkButton = ({}: Props) => {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      className="hover:bg-muted absolute top-2 right-2 rounded-full bg-white p-1"
    >
      {pending ? (
        <span className="block h-5 w-5 animate-spin rounded-full border-2 border-white border-b-black" />
      ) : (
        <LucideX />
      )}
    </Button>
  );
};

export default RemoveBookmarkButton;
