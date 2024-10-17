"use server";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function generateTags(title: string, content: string) {
  const prompt = `I am building a social media application so I need tags for the posts, generate 3 relevant tags for the following content:\n\n${title}\n\nTags:, you can use ${content} as context. Only respond with the tags wihtout # and nothing else`;
  const requestData = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      requestData,
      {
        headers: {
          "Content-Type": " application/json",
        },
      }
    );
    const tags = response.data.candidates[0].content.parts[0].text;
    return tags.split(",").map((tag: string) => tag.trim());
  } catch (err) {
    console.error(err);
  }
}
