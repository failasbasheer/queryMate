



// import axios from "axios";

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Only POST allowed" });
//   }

//   const { question } = req.body;

//   if (!question) {
//     return res.status(400).json({ message: "Question is required." });
//   }

//   const apiKey =
//     "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";

//   try {
//     console.log("Sending request to OpenRouter…");

//     const response = await axios.post(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         model: "deepseek/deepseek-r1:free",
//         messages: [
//           {
//             role: "user",
//             content: question,
//           },
//         ],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//           "Content-Type": "application/json",
//           "HTTP-Referer": "https://your-site.com", // optional
//           "X-Title": "Your Site Name",             // optional
//         },
//       }
//     );

//     const answer = response.data.choices[0].message.content.trim();
//     console.log("OpenRouter answer:", answer);

//     res.status(200).json({ answer });
//   } catch (error) {
//     console.error(
//       "OpenRouter API error:",
//       error?.response?.data || error.message
//     );
//     res.status(500).json({
//       answer: "Failed to get response from OpenRouter.",
//       details: error?.response?.data || error.message,
//     });
//   }
// }


import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { question } = req.body;

  if (!question || typeof question !== "string") {
    return res.status(400).json({ message: "Question is required." });
  }

  const apiKey =
    "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";

  try {
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
        },
      }
    );

    const answer =
      response.data?.choices?.[0]?.message?.content?.trim() ||
      "No answer received.";

    return res.status(200).json({ answer });
  } catch (error) {
    const details = error?.response?.data || error?.message || "Unknown error";
    return res.status(500).json({
      message: "Failed to get response from OpenRouter.",
      details,
    });
  }
}
