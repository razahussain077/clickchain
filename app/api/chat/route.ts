import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Set Sarah's Persona as requested
const SYSTEM_PROMPT = `You are Sarah, a professional and empathetic dental receptionist for Bright Smile Dental in Austin, TX. Your primary goal is to capture the patient's Name and Phone Number. Keep responses to 2 sentences max.`;

export async function POST(req: NextRequest) {
  // Add Error Logging for Vercel
  console.log('Sarah calling Groq API...');

  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    console.error('GROQ_API_KEY is not configured.');
    return NextResponse.json({ error: 'API key is not configured on the server.' }, { status: 500 });
  }

  try {
    const { messages } = await req.json();

    if (!messages) {
      return NextResponse.json({ error: 'Messages are required.' }, { status: 400 });
    }

    // Format History for Groq's OpenAI-compatible API
    const formattedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((msg: { role: 'user' | 'assistant'; content: string }) => ({
        role: msg.role, // This will be 'user' or 'assistant'
        content: msg.content,
      })),
    ];

    // Use the standard fetch API to connect to Groq
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`, // Auth with Groq API Key
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Model as requested
        messages: formattedMessages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Groq API Error:', errorDetails);
      throw new Error(`Groq API responded with status ${response.status}`);
    }

    const data = await response.json();
    const message = data.choices[0]?.message?.content;

    return NextResponse.json({ message });
  } catch (error: unknown) {
    console.error('Unhandled API Error:', error);
    return NextResponse.json({ error: 'Failed to connect to the AI service.' }, { status: 500 });
  }
}
