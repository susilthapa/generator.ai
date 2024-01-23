import CreateCourseForm from "@/components/ThemeProvider/CreateCourseForm";
import { getAuthSession } from "@/lib/auth";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

const CreatePage = async () => {
  const session = await getAuthSession();
  if (!session?.user) return redirect("/gallery");

  return (
    <div className="flex flex-col items-center max-w-xl px-8 mx-auto my-16 sm:px-0">
      <h1 className="self-center text-3xl font-bold text-center sm:text-4xl">
        Learning Journey
      </h1>
      <div className="flex gap-3 p-4 mt-5 border-none rounded-lg bg-secondary shadow-lg dark:shadow-gray-500 shadow-gray-600">
        <InfoIcon className="w-14 h-14 text-blue-400" />
        <div>
          Enter a course title, or what you want to learn about. Then enter a
          list of units which are the specifics you want to learn. And our AI
          will generate a course for you!
        </div>
      </div>
      <CreateCourseForm />
    </div>
  );
};

export default CreatePage;
