import Link from "next/link";
import { Image } from "@imagekit/next";
import { LogOutIcon } from "lucide-react";
import Bookmarks from "./bookmarks";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { auth, signOut } from "@/lib/auth";

// import { Bookmarks } from "./bookmarks";

type Props = {};
const logout = async () => {
  "use server";
  await signOut();
};

const HeaderAuth = async ({}: Props) => {
  const session = await auth();
  const user = session?.user;
  return (
    <div className="mx-2 flex items-center gap-4">
      {user ? (
        <Popover>
          <PopoverTrigger>
            <div className="flex items-center gap-2">
              <Image
                src={user.image!}
                alt="User Avatar"
                className="h-8 w-8 rounded-full"
                width={32}
                height={32}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-full px-0 py-2">
            <p className="p-2 font-bold">My Profile</p>
            <Separator />

            <Bookmarks />
            <form action={logout}>
              <button
                className="hover:bg-muted flex w-full items-center gap-1 p-1"
                type="submit"
              >
                <LogOutIcon className="h-4 w-4" />
                Logout
              </button>
            </form>
          </PopoverContent>
        </Popover>
      ) : (
        <Link href="/api/auth/signin" className="btn btn-primary">
          <Button>Login</Button>
        </Link>
      )}
    </div>
  );
};

export default HeaderAuth;
