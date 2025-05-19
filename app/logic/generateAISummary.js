export const generateAIAnalogy = async (studyNote) => {
  try {
    // Set loading state if needed
    setAiResponse("Generating analogy...");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229", // or another Claude model
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: `Create a helpful analogy to explain the following study concept:\n\n${studyNote}\n\nThe analogy should be simple, memorable, and help with understanding the core concept.`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (response.ok) {
      //   return data.content[0].text;
      console.log(data.content[0].text);
    } else {
      return (
        "Error generating analogy: " + (data.error?.message || "Unknown error")
      );
    }
  } catch (error) {
    return "Failed to generate analogy: " + error.message;
  }
};

// const generateAIQuestion = async (studyNote) => {
//   try {
//     setAiResponse("Generating practice questions...");

//     const response = await fetch("https://api.anthropic.com/v1/messages", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "x-api-key": "your-anthropic-api-key",
//         "anthropic-version": "2023-06-01",
//       },
//       body: JSON.stringify({
//         model: "claude-3-opus-20240229",
//         max_tokens: 1000,
//         messages: [
//           {
//             role: "user",
//             content: `Generate 3-5 practice questions based on the following study material:\n\n${studyNote}\n\nThe questions should test understanding of key concepts and vary in difficulty. Include the answers at the end.`,
//           },
//         ],
//       }),
//     });

//     const data = await response.json();
//     setAiResponse(data.content[0].text);
//   } catch (error) {
//     setAiResponse("Failed to generate questions: " + error.message);
//   }
// };

export const generateAISummary = async (studyNote) => {
  try {
    setAiResponse("Generating key points summary...");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: `Create a concise bullet-point summary of the key points from this study material:\n\n${studyNote}\n\nFocus on the most important concepts and keep it brief.`,
          },
        ],
      }),
    });

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    return "Failed to generate summary: " + error.message;
  }
};
