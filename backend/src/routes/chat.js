const express = require('express');
const OpenAI = require('openai');
const rateLimit = require('express-rate-limit');
const ChatLog = require('../models/ChatLog');
const Workshop = require('../models/Workshop');
const Product = require('../models/Product');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_BASE_URL,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Aerix AI"
  }
});

// Strict rate limit for chat (prevent abuse)
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15,
  message: { error: 'Too many messages. Please wait a moment.' }
});

// Build AERIX system prompt with live data injected
const buildSystemPrompt = (workshops, products) => {
  const workshopList = workshops.map(w =>
    `- ${w.title} (${w.duration}, ${w.targetAudience}, ₹${w.price})`
  ).join('\n');

  const productList = products.map(p =>
    `- ${p.name} [${p.badge}]: ${p.shortDesc} (${p.priceRange})`
  ).join('\n');

  return `You are AERIX AI Assistant — the official intelligent assistant of AERIX AI, an aerospace & AI solutions company based in India.

YOUR KNOWLEDGE:
PRODUCTS:
${productList}

WORKSHOPS:
${workshopList}

COMPANY INFO:
- Founded to bring AI & aerospace education to Indian schools
- Contact: aerixteam@gmail.com | +91 9358855881
- Location: India — Serving schools nationwide
- Team: Dr. Kamal Sharma (Founder), Ajay Pratap Devra (Senior Dev), Aditya (Junior Dev), Raghav (Full Stack), Karan Singh (Tech)

RULES:
- Always answer enthusiastically, professionally, and helpfully
- Direct users to book workshops or request product demos
- Never invent products, prices, or features not listed above
- Keep responses concise (2-4 sentences max unless asked for detail)
- Use emojis occasionally to stay engaging (🚀✨📚🛡️)
- For booking: direct to the Workshops page or the booking form
- For products: direct to the Products/Innovations page
- If unsure, say "Contact our team at aerixteam@gmail.com for more details!"`;
};

// POST /api/chat  (send message, optional auth)
router.post('/', chatLimiter, optionalAuth, async (req, res) => {
  try {
    const { message, sessionId, conversationHistory = [] } = req.body;
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }
    if (message.length > 1000) {
      return res.status(400).json({ error: 'Message too long (max 1000 characters).' });
    }

    // Fetch live data to inject into context
    const [workshops, products] = await Promise.all([
      Workshop.find({ isActive: true }).select('title duration targetAudience price'),
      Product.find({ isActive: true }).select('name badge shortDesc priceRange')
    ]);

    const systemPrompt = buildSystemPrompt(workshops, products);

    // Build messages array with conversation history (max last 10 messages)
    const recentHistory = conversationHistory.slice(-10);
    const messages = [
      { role: 'system', content: systemPrompt },
      ...recentHistory,
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages,
      max_tokens: 400,
      temperature: 0.7
    });

    const reply = completion.choices[0].message.content;
    const tokensUsed = completion.usage?.total_tokens || 0;

    // Log the chat
    await ChatLog.create({
      userId: req.user?._id || null,
      sessionId: sessionId || 'anonymous',
      message,
      reply,
      tokensUsed
    });

    res.json({ reply, tokensUsed });
  } catch (err) {
    console.error('Chat error:', err.message);
    if (err.code === 'insufficient_quota') {
      return res.status(503).json({ error: 'AI service temporarily unavailable. Contact aerixteam@gmail.com' });
    }
    res.status(500).json({ error: 'Failed to get AI response. Please try again.' });
  }
});

// GET /api/chat/logs  (admin - view all chat logs)
router.get('/logs', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const logs = await ChatLog.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await ChatLog.countDocuments();
    res.json({ logs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/chat/logs/my  (customer's own chat history)
router.get('/logs/my', protect, async (req, res) => {
  try {
    const logs = await ChatLog.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
