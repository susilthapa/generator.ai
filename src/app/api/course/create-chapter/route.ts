import { prisma } from "@/lib/db";
import { strict_output } from "@/lib/gpt";
import { getUnsplashImage } from "@/lib/unsplash";
import { createChapterSchema } from "@/validators/course";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

type outputUnits = {
  title: string;
  chapters: {
    youtube_search_query: string;
    chapter_title: string;
  }[];
}[];
export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { title, units } = createChapterSchema.parse(body);

    let output_units: outputUnits = await strict_output(
      "You are an AI capable of curating course content, coming up with relevant chapter titles, and finding relevant youtube videos for each chapter",
      new Array(units.length).fill(
        `It is your job to create a course about ${title}. The user has requested to create chapters for each of the units. Then, for each chapter, provide a detailed youtube search query that can be used to find an informative educational video for each chapter. Each query should give an educational informative course in youtube.`
      ),
      {
        title: "title of the unit",
        chapters:
          "an array of chapters, each chapter should have a youtube_search_query and a chapter_title key in the JSON object",
      }
    );

    const imageSearchTermRes = await strict_output(
      "You are an AI capable of finding the most relevant image for a course",
      `Please provide a good image search term for the title of a course about the ${title}. This search term will be fed into the unsplash API, so make sure it is a good search term that will return good search results.`,
      {
        image_search_term: "a good search term for the title of a course",
      }
    );

    const courseImage = await getUnsplashImage(
      imageSearchTermRes.image_search_term
    );

    // Create Course
    const course = await prisma.course.create({
      data: {
        name: title,
        image: courseImage,
      },
    });

    // Create units and chapters for each unit
    for (const { title, chapters } of output_units) {
      const courseUnit = await prisma.unit.create({
        data: {
          name: title,
          courseId: course.id,
        },
      });
      // Create Chapters
      await prisma.chapter.createMany({
        data: chapters.map(({ chapter_title, youtube_search_query }) => ({
          name: chapter_title,
          youtubeSearchQuery: youtube_search_query,
          unitId: courseUnit.id,
        })),
      });
    }

    return NextResponse.json({
      courseId: course.id,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: "Invalid body" }, { status: 400 });
    }
    return NextResponse.json({ message: "Error" }, { status: 400 });
  }
}
