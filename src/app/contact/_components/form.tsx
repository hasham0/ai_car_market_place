"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import TestDrivenForm from "@/app/cars/_components/test-driven-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactSeller } from "@/lib/actions/car-action";
import { ContactSellerSchemaTS, contactSellerSchema } from "@/lib/zod";

type Props = { carId: string };

const Form = ({ carId }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactSellerSchemaTS>({
    defaultValues: {
      carId,
      content: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
    resolver: zodResolver(contactSellerSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (formData: ContactSellerSchemaTS) => {
    try {
      setIsLoading(true);
      await contactSeller(formData);
      toast.success("Message sent successfully!");
      reset();
    } catch {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">First Name</label>
          <Input
            placeholder="Enter your first name"
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Last Name</label>
          <Input placeholder="Enter your last name" {...register("lastName")} />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          placeholder="Enter your email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Phone</label>
        <Input
          type="tel"
          placeholder="Enter your phone number"
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Message</label>
        <Textarea
          placeholder="I'm interested in this car and would like to know more about its condition and history."
          rows={4}
          {...register("content")}
        />
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Message"}
        </Button>
        <div className="flex-1">
          <TestDrivenForm carId={carId} />
        </div>
      </div>
    </form>
  );
};

export default Form;
