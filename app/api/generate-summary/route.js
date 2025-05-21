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
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `Create a concise bullet-point summary of the key points from this study material:\n\n${studyNote}\n\nFocus on the most important concepts and keep it brief.`,
        },
      ],
    });

    const content = response.content[0].text;

    return NextResponse.json({
      summary: content,
      status: "success",
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate summary",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";

// export async function POST(request) {
//   try {
//     const { studyNote } = await request.json();

//     if (!studyNote || !studyNote.trim()) {
//       return NextResponse.json(
//         { error: "No study note provided" },
//         { status: 400 }
//       );
//     }

//     const deepseekResponse = await fetch(
//       "https://api.deepseek.com/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
//         },
//         body: JSON.stringify({
//           model: "deepseek-chat",
//           messages: [
//             {
//               role: "user",
//               content: `Create a concise bullet-point summary of the key points from this study material:\n\n${studyNote}\n\nFocus on the most important concepts and keep it brief.`,
//             },
//           ],
//           temperature: 0.7,
//           max_tokens: 2000,
//         }),
//       }
//     );

//     if (!deepseekResponse.ok) {
//       throw new Error(`DeepSeek API error: ${deepseekResponse.statusText}`);
//     }

//     const responseData = await deepseekResponse.json();
//     const content = responseData.choices[0]?.message?.content;

//     if (!content) {
//       throw new Error("No content received from DeepSeek API");
//     }

//     return NextResponse.json({
//       summary: content,
//       status: "success",
//     });
//   } catch (error) {
//     console.error("Generation error:", error);
//     return NextResponse.json(
//       {
//         error: "Failed to generate summary",
//         details:
//           process.env.NODE_ENV === "development" ? error.message : undefined,
//       },
//       { status: 500 }
//     );
//   }
// }
