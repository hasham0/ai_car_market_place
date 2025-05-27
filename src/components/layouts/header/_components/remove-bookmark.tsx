import RemoveBookmarkButton from "./button";
import { bookmarkCar } from "@/lib/actions/car-action";

type Props = {
  carId: string;
};

const RemoveBookmark = async ({ carId }: Props) => {
  return (
    <form
      action={async () => {
        await bookmarkCar(carId);
      }}
    >
      <RemoveBookmarkButton />
    </form>
  );
};

export default RemoveBookmark;
