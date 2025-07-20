
// import OpenAI from "openai";

// const client = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: "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",
// });

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Only POST allowed" });
//   }

//   const { question } = req.body;

//   if (!question) {
//     return res.status(400).json({ message: "Question is required." });
//   }

//   try {
//     const completion = await client.chat.completions.create({
//       model: "deepseek/deepseek-chat-v3-0324:free",
//       messages: [
//         {
//           role: "user",
//           content: question,
//         },
//       ],
//       extra_headers: {
//         "HTTP-Referer": "https://your-site.com", // Optional: replace with your site
//         "X-Title": "Your Site Name",             // Optional: replace with your site title
//       },
//       extra_body: {},
//     });

//     const answer = completion.choices[0].message.content.trim();
// console.log(answer);

//     res.status(200).json({ answer });
//   } catch (error) {
//     console.error("OpenRouter API error:", error);
//     res
//       .status(500)
//       .json({ answer: "Failed to get response from OpenRouter.", details: error });
//   }
// }



import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ message: "Question is required." });
  }

  const apiKey =
    "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";

  try {
    console.log("Sending request to OpenRouter…");

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1:free",
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://your-site.com", // optional
          "X-Title": "Your Site Name",             // optional
        },
      }
    );

    const answer = response.data.choices[0].message.content.trim();
    console.log("OpenRouter answer:", answer);

    res.status(200).json({ answer });
  } catch (error) {
    console.error(
      "OpenRouter API error:",
      error?.response?.data || error.message
    );
    res.status(500).json({
      answer: "Failed to get response from OpenRouter.",
      details: error?.response?.data || error.message,
    });
  }
}
