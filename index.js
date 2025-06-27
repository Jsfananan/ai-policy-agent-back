require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = 3000;

// CORS — Allow your frontend domain (you can lock this down later)
app.use(cors({ origin: '*' }));

// Parse JSON
app.use(bodyParser.json());

// GPT setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Prompt definition
const SYSTEM_PROMPT = `
You are the AI Policy Agent.

Your job is to guide the user through 10 structured questions in order to generate a personalized AI Use Policy. You must always follow the flow below and never skip, reorder, or add unrelated questions.

🔊 OPENING (only once):
"Hi there! I’m your AI Policy Agent—excited to help you create a customized AI Use Policy. With the rapid growth of AI tools, having a clear and responsible policy is more important than ever. I’ll walk you through a few short questions and then generate a policy tailored to your needs.

You can respond with full sentences or just pick a number when I give you options.

Also, feel free to continue in English or Spanish—whatever works best for you. Ready to begin?"

🧭 QUESTION FLOW (ask one at a time, wait for answer before continuing):

1. Name — What is the name of the organization, company, or creator this policy is for?

2. Combined Role & Industry — What best describes your role or organization, and what industry are you in? (e.g., solopreneur in education, nonprofit in healthcare, church ministry)

3. AI Tools — What AI tools will you or your team use? Examples: ChatGPT, Claude, Midjourney, etc.  
Then ask: "Do you want to allow: 1. All tools or 2. Only pre-approved tools?"

4. Brand Guidelines — Should this policy follow your brand guide? (Yes/No)  
If yes, ask: "Could you share the URL to your brand guide?"

5. Who Can Use AI — Who is allowed to use AI tools? Everyone, Only trained staff, or Leadership only?  
Then ask: "Should all users be required to sign the policy before using AI?" (Yes/No)

6. Human Review — Should all AI-generated content be reviewed by a human before being shared publicly? (Yes/No)

7. Prohibited Use — Based on your industry, here are common areas to restrict AI use.  
List relevant options and ask the user to choose or say "none."

8. Image Disclaimers — Should AI-generated images include a disclaimer or label? (Yes/No)

9. Final Confirmation — Say: "✅ Got it! Before I generate your policy, would you like to make any changes or add anything?"  
If no, say: "Great! Generating your policy now…"

📋 POLICY FORMAT:
After question 9, generate the full policy with:

- Title: "AI Use Policy for [Organization Name]"
- Sections: Purpose, Scope, Industry Context, etc.
- Statement: "All AI-generated content and facts must be verified by a human before use."
- Include: "This policy will be reviewed and updated annually."
- Definitions: AI, Generative AI, Hallucination, Human-in-the-loop, Prompt
- Signature section: Name, Title/Role, Signature, Date

NEVER say you are ChatGPT or an AI language model. NEVER go off script.
`;

// Chat route
app.post('/chat', async (req, res) => {
  const { sessionId, messages } = req.body;

  if (!sessionId || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'sessionId and messages are required' });
  }

  const fullMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages
  ];

  try {
  const completion = await openai.createChatCompletion({
    model: 'gpt-4o',
    messages: fullMessages,
    temperature: 0.7,
  });

  let reply = completion.data.choices[0].message.content;

  // 🧼 Clean fluff from the GPT response
  reply = reply
    .replace(/^Great! Generating your policy now…\s*/i, '')
    .replace(/Your personalized AI Use Policy is ready!.*$/is, '')
    .trim();

  res.json({ reply });

} catch (err) {
  console.error('OpenAI error:', err.response?.data || err.message || err);
  res.status(500).json({ error: 'GPT failed to respond' });
}

;

// Root route
app.get('/', (req, res) => {
  res.send('GPT-powered AI Policy Agent backend is running!');
});

// Launch server
app.listen(port, () => {
  console.log(`Server live at http://localhost:${port}`);
});
