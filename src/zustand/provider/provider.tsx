"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useStore } from "zustand";
import { createImagesStore, type ImagesStore } from "../store";

export type ImagesStoreApi = ReturnType<typeof createImagesStore>;
export const ImageStoreContext = createContext<ImagesStoreApi | undefined>(
  undefined
);

type Props = { children: ReactNode };

const ZustandProvider = ({ children }: Props) => {
  const storeRef = useRef<ImagesStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createImagesStore();
  }
  return (
    <ImageStoreContext.Provider value={storeRef.current}>
      {children}
    </ImageStoreContext.Provider>
  );
};

export default ZustandProvider;

// custom hook to use the store
export const useImagesStore = <T,>(selector: (store: ImagesStore) => T): T => {
  const imagesStoreContext = useContext(ImageStoreContext);

  if (!imagesStoreContext) {
    throw new Error(`useImagesStore must be used within ImagesStoreProvider`);
  }

  return useStore(imagesStoreContext, selector);
};
