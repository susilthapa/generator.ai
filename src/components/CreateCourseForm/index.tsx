"use client";

import React from "react";
import { z } from "zod";
import { Plus, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";

import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { createChapterSchema } from "@/validators/course";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

type ChapterFormInputType = z.infer<typeof createChapterSchema>;

const CreateCourseForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: createChapters, isPending } = useMutation({
    mutationFn: async (payload: ChapterFormInputType) => {
      const response = await axios.post("/api/course/create-chapter", payload);
      return response.data;
    },
  });
  const form = useForm<ChapterFormInputType>({
    resolver: zodResolver(createChapterSchema),
    defaultValues: {
      title: "",
      units: ["", "", ""],
    },
  });

  const onSubmit = (values: ChapterFormInputType) => {
    if (values.units.some((unit) => unit.trim() === "")) {
      toast({
        title: "Error",
        description: "Please fill all the units",
        variant: "destructive",
      });
    }
    createChapters(values, {
      onSuccess: (data: { courseId: string; name: string }) => {
        toast({
          title: "Success",
          description: "Course created successfully",
          variant: "destructive",
        });

        router.push(`/create/${data.courseId}`);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row">
                <FormLabel className="flex-[1] text-lg">Title</FormLabel>
                <FormControl className="flex-[6]">
                  <Input
                    placeholder="Enter the main title of the course"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <AnimatePresence>
            {form.watch("units").map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                // transition={{
                //   opacity: {
                //     duration: 0.2,
                //   },
                //   height: {
                //     duration: 0.2,
                //   },
                // }}
              >
                <FormField
                  control={form.control}
                  name={`units.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row">
                      <FormLabel className="flex-[1] text-lg">
                        Unit {index + 1}
                      </FormLabel>
                      <FormControl className="flex-[6]">
                        <Input
                          placeholder="Enter subtopics of the course"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex items-center justify-center mt-4">
            <Separator className="flex-[1] bg-gray-500" />
            <div className="mx-4 flex gap-2">
              <Button
                type="button"
                variant="secondary"
                color=""
                className="font-semibold"
                onClick={() => {
                  form.setValue("units", [...form.watch("units"), ""]);
                }}
              >
                Add Unit
                <Plus className="w-4 h-4 ml-2 text-green-500" />
              </Button>

              {form.watch("units").length > 0 && (
                <Button
                  type="button"
                  variant="secondary"
                  className="font-semibold"
                  onClick={() => {
                    form.setValue("units", form.watch("units").slice(0, -1));
                  }}
                >
                  Remove Unit
                  <Trash className="w-4 h-4 ml-2 text-red-500" />
                </Button>
              )}
            </div>
            <Separator className="flex-[1] bg-gray-500" />
          </div>

          <Button
            disabled={isPending}
            type="submit"
            className="w-full mt-6"
            size="lg"
          >
            Lets Go!
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateCourseForm;
