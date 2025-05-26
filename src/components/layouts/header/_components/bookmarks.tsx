import { Suspense } from "react";
import { BookmarkIcon } from "lucide-react";
import MainContent from "./main-content";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {};

const Bookmarks = ({}: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <p className="hover:bg-muted flex cursor-pointer items-center gap-1 p-1">
          <BookmarkIcon className="h-4 w-4" /> Saved
        </p>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-1">
            Bookmarks <BookmarkIcon className="h-4 w-4" />
          </SheetTitle>
        </SheetHeader>

        <Suspense fallback={<Skeleton className="h-[calc(100vh-64px)]" />}>
          <ScrollArea className="h-[calc(100vh-64px)] p-4">
            <div className="flex flex-col gap-4">
              <MainContent />
            </div>
          </ScrollArea>
        </Suspense>
      </SheetContent>
    </Sheet>
  );
};

export default Bookmarks;
