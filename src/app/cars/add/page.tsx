import AddCarForm from "../_components/add-car-form";
import GenerateImage from "../_components/generate-image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {};

export default function AddCarPage({}: Props) {
  return (
    <main className="min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4">
        <Tabs defaultValue="add-car" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="add-car">Add Car</TabsTrigger>
            <TabsTrigger value="generate-image">Generate Image</TabsTrigger>
          </TabsList>

          <TabsContent value="add-car" className="w-[50rem]">
            <AddCarForm />
          </TabsContent>
          <TabsContent value="generate-image" className="w-[50rem]">
            <GenerateImage />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
