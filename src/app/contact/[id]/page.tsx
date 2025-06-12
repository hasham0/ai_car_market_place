import { Suspense } from "react";
import Loader from "../_components/loader";
import MainContent from "../_components/main-content";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ContactPage({ params }: Props) {
  const resolvesParams = await params;
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <Suspense fallback={<Loader />}>
          <MainContent params={resolvesParams} />
        </Suspense>
      </div>
    </main>
  );
}
