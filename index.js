import express from "express";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json());

// 🔹 CHANGED: new Gemini client
const ai = new GoogleGenAI({});

// 🔹 CHANGED: free-tier model
const MODEL = "gemini-2.5-flash";

// 🔹 CHANGED: generate function
async function generate(question) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: "user",
        parts: [{ text: question }],
      },
    ],
  });

  return response.text;
}

app.post("/api/content", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const answer = await generate(question);
    res.json({ result: answer });

  } catch (error) {
    console.error("Gemini Error:", error.message);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
