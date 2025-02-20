const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Chatbot Route (Using OpenRouter API)
app.post("/chat", async (req, res) => {
    try {
        const { userInput } = req.body;

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-3.5-turbo", // Use "gpt-4" if you have access
                messages: [{ role: "user", content: userInput }],
                max_tokens: 200,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5002",  // Use this for local testing
        "X-Title": "MyPersonalChatbot"
                },
            }
        );

        res.json({ response: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Error fetching response from OpenRouter:", error);
        res.status(500).json({ error: "Failed to fetch response" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
