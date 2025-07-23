require("dotenv").config({ path: "./.env" });

const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
const axios = require("axios");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  const { message, history } = req.body;

  try {
    const hfRes = await axios.post(
      "https://api-inference.huggingface.co/models/SamLowe/roberta-base-go_emotions",
      { inputs: message },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const topResult = hfRes.data[0].reduce((prev, current) =>
      prev.score > current.score ? prev : current
    );

    const label = topResult.label.toLowerCase();
    const score = topResult.score;

    const highRiskLabels = [
      "grief", "sadness", "fear", "disappointment", "remorse"
    ];

    if (highRiskLabels.includes(label) && score > 0.4) {
      return res.json({
        reply:
          "It sounds like you're going through a very difficult time. Please know you're not alone. Call **Samaritans on 116 123** if you need help. 💙",
        emotion: label,
      });
    }

    const chatHistory = Array.isArray(history) ? history : [];

    const messages = chatHistory.map((msg) => ({
      role: msg.sender === "You" ? "user" : "assistant",
      content: msg.message.trim(),
    }));

    messages.push({ role: "user", content: message.trim() });

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    const reply = chatCompletion.choices[0].message.content;
    res.json({ reply, emotion: label });
  } catch (err) {
    res.status(500).json({
      reply: "Sorry, something went wrong. Try again later.",
    });
  }
});

app.listen(port, () => {
  console.log(`✅ MindEase backend listening on http://localhost:${port}`);
});
