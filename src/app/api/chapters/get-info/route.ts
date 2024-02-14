import { z } from "zod";
import { getQuestionsFromTranscript, getTranscript } from "@/lib/youtube";
import { searchYoutube } from "@/lib/searchYoutube";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { strict_output } from "@/lib/gpt";

const bodyParser = z.object({
  chapterId: z.string(),
});

const TRANSCRIPT_MAX_LENGTH = 500;

/**
 * Generates question, answer and options for a chapter
 *
 */
export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { chapterId } = bodyParser.parse(body);
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
    });
    if (!chapter) {
      return NextResponse.json(
        {
          success: false,
          error: "Chapter not found",
        },
        { status: 404 }
      );
    }
    const videoId = await searchYoutube(chapter.youtubeSearchQuery);
    let transcript = videoId ? await getTranscript(videoId) : "";
    transcript = transcript
      .split(" ")
      .slice(0, TRANSCRIPT_MAX_LENGTH)
      .join(" ");

    const { summary }: { summary: string } = await strict_output(
      "You are an AI capable of summarizing a youtube transcript",
      "summarize in 250 words or less and do not talk of the sponsors or anything unrelated to the main topic, also do not introduce what the summary is about.\n" +
        transcript,
      { summary: "summary of the transcript" }
    );

    const questions = await getQuestionsFromTranscript(
      transcript,
      chapter.name
    );

    await prisma.question.createMany({
      data: questions.map((question) => {
        let options = [
          question.answer,
          question.option1,
          question.option2,
          question.option3,
        ];
        // randomize options
        options = options.sort(() => Math.random() - 0.5);
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          chapterId: chapterId,
        };
      }),
    });

    await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        videoId: videoId,
        summary: summary,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid body",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "unknown",
        },
        { status: 500 }
      );
    }
  }
}
