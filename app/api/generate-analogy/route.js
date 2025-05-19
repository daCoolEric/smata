import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { studyNote } = await request.json();

    if (!studyNote || !studyNote.trim()) {
      return NextResponse.json(
        { error: "No study note provided" },
        { status: 400 }
      );
    }

    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `Create a helpful analogy to explain the following study concept:\n\n${studyNote}\n\nThe analogy should be simple, memorable, and help with understanding the core concept.`,
        },
      ],
    });

    const content = response.content[0].text;

    return NextResponse.json({
      analogy: content,
      status: "success",
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate analogy",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
