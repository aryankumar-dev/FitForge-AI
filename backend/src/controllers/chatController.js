const SYSTEM_PROMPT =
  "You are a friendly fitness & health assistant for a gym app. Answer ONLY questions related to health, fitness, nutrition, exercise, diet, gym, weight management, and wellbeing, concisely and helpfully. If the user asks something unrelated to health/fitness, do NOT answer it — instead reply with a short, funny, light-hearted one-liner redirecting them back to health/fitness topics.";

// @desc    AI health & fitness chatbot
// @route   POST /api/users/chat
// @access  Private
export const chat = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ message: "A 'message' field is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        reply: "AI chat isn't configured yet — ask your admin to add an API key!",
      });
    }

    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [{ role: "user", parts: [{ text: message }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 400 },
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error("Gemini API error:", response.status, errText);
        return res.status(200).json({
          reply: "Sorry, our AI assistant is having trouble responding right now. Please try again in a bit!",
        });
      }

      const data = await response.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "Sorry, I couldn't come up with a response. Could you rephrase your question?";

      res.status(200).json({ reply });
    } catch (fetchError) {
      console.error("Error calling Gemini API:", fetchError.message);
      res.status(200).json({
        reply: "Sorry, our AI assistant is temporarily unavailable. Please try again later!",
      });
    }
  } catch (error) {
    next(error);
  }
};
