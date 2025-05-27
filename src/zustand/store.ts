import { devtools, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

export type ImagesState = {
  images: string[];
};

export type ImagesAction = {
  setImages: (images: string[]) => void;
  addImage: (image: string) => void;
  removeImage: (image: string) => void;
  clearImages: () => void;
};

export type ImagesStore = ImagesState & ImagesAction;

export const defaultImagesState: ImagesState = {
  images: [],
};

export const createImagesStore = (
  initState: ImagesState = defaultImagesState
) => {
  return createStore<ImagesStore>()(
    devtools(
      persist(
        (set) => ({
          ...initState,
          setImages: (images) => set({ images }),
          addImage: (image) =>
            set((state) => ({ images: [...state.images, image] })),
          removeImage: (image) =>
            set((state) => ({
              images: state.images.filter((img) => img !== image),
            })),
          clearImages: () => set({ images: [] }),
        }),
        {
          name: "images-store",
          partialize: (state) => ({ images: state.images }),
        }
      )
    )
  );
};
