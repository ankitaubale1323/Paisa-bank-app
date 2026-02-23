// ✅ CORRECT
import fetch   from 'node-fetch';
import Account from '../models/Account.js';

const OLLAMA_URL   = process.env.OLLAMA_URL   || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

// POST /api/ai/chat
export const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    // Build customer context from DB
    const accounts   = await Account.find({ userId: req.user._id });
    const totalBal   = accounts.reduce((s, a) => s + a.balance, 0);
    const accSummary = accounts
      .map((a) => `${a.accountType} (${a.accountNumber}): $${a.balance.toFixed(2)}`)
      .join(', ');

    const systemPrompt = `You are BankBot, a smart AI banking assistant for ${req.user.name}.
Customer snapshot:
- Total balance: $${totalBal.toFixed(2)}
- Accounts: ${accSummary || 'No accounts yet'}

You help with:
- Financial advice and budgeting tips
- Explaining banking features (deposits, withdrawals, transfers)
- Account management guidance
- General financial questions

Be concise, warm, and professional. Never fabricate transaction history.`;

    const messages = [
      ...history.slice(-10),
      { role: 'user', content: message },
    ];

    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        model:   OLLAMA_MODEL,
        messages,
        system:  systemPrompt,
        stream:  false,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok)
      throw new Error(`Ollama responded with status ${response.status}`);

    const data = await response.json();
    res.json({ reply: data.message?.content || 'Sorry, I could not process that.' });

  } catch (err) {
    console.error('AI Error:', err.message);
    const isOffline =
      err.message.includes('ECONNREFUSED') || err.message.includes('fetch');

    res.status(503).json({
      reply: isOffline
        ? '⚠️ AI offline. Run: `ollama serve` then `ollama pull llama3.2`'
        : `⚠️ Error: ${err.message}`,
    });
  }
};