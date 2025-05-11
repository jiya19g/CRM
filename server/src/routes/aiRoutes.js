const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/suggest-messages', async (req, res) => {
  const { objective } = req.body;
  if (!objective) return res.status(400).json({ error: 'Objective required' });

  try {
    // Use the correct model name
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `You are an expert marketing copywriter.
Write 3 short, friendly, and personalized SMS messages for a marketing campaign with this objective: "${objective}".
Each message should sound like a real offer from a business to a customer, and should encourage the customer to take action.
Include a sense of urgency or a call to action if appropriate.
Return them as a numbered list.
IMPORTANT: Use ONLY "{name}" (with curly braces) as the placeholder for the customer's name. Do NOT use [User Name], [name], [UserName], or any other format.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Parse the numbered list into an array
    const suggestions = text
  .split('\n')
  .filter(line => /^\d+\./.test(line))
  .map(line => line.replace(/^\d+\.\s*/, '').trim())
  .map(line =>
    line
      // Replace all possible name placeholders with {name}
      .replace(/\[User Name\]|\[UserName\]|\[name\]|User Name|UserName|name|<name>|\(name\)/gi, '{name}')
      // Replace all possible brand placeholders with your brand
      .replace(/\[Your Brand\]|\[Your Company Name\]/gi, 'The Cookie Shop')
      // Replace all possible link placeholders with your link
      .replace(/\[Your Website Link\]|\[Link to Website\]|\[Link\]/gi, 'https://thecookieshop.com')
  )
  .filter(Boolean);

    res.json({ suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI suggestion failed' });
  }
});

module.exports = router;