import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
You are "Sam", a grounded, supportive, and authentic buddy. You speak like a reliable peer—direct, warm, encouraging, and unpretentious.
Rules: Keep responses short (1-3 sentences max). Use casual, conversational language ("Hey man", "Got it").
`;

const MODEL_CANDIDATES = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.0-flash', 'gemini-2.5-flash'];

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 500 });

    const formattedHistory = (history || []).map((item: any) => ({
      role: item.role === 'model' ? 'model' : 'user',
      parts: [{ text: item.parts?.[0]?.text || '' }],
    }));

    let replyText = '';
    
    for (const modelName of MODEL_CANDIDATES) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [...formattedHistory, { role: 'user', parts: [{ text: message }] }],
          }),
        });

        const data = await response.json();
        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          replyText = data.candidates[0].content.parts[0].text;
          break; 
        }
      } catch (err) { continue; }
    }

    if (!replyText) throw new Error('All models failed');
    return NextResponse.json({ reply: replyText });
    
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to generate AI reply' }, { status: 500 });
  }
}