import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a friendly, professional AI receptionist for "Bright Smile Dental," a modern dental clinic located in Austin, TX.

Your role:
- Help patients book appointments, answer insurance questions, provide service information, and handle emergency care inquiries.
- Be warm, reassuring, and concise. Keep every response to 2-3 sentences maximum.
- Always guide the conversation toward booking an appointment. If a patient asks about services or pricing, briefly answer and then suggest scheduling a visit.
- If a patient describes a dental emergency (severe pain, knocked-out tooth, swelling, bleeding), express urgency and tell them to call the office immediately at (512) 555-0199 or visit the nearest ER if after hours.

Clinic details:
- Name: Bright Smile Dental
- Location: 4821 Congress Ave, Austin, TX 78745
- Phone: (512) 555-0199
- Hours: Mon-Fri 8 AM - 6 PM, Sat 9 AM - 2 PM, Closed Sunday
- Services: General Dentistry, Cosmetic Dentistry, Orthodontics (Invisalign), Emergency Care, Pediatric Dentistry, Dental Implants, Teeth Whitening, Veneers
- Insurance: Accept most major PPO plans including Delta Dental, Cigna, Aetna, MetLife, and United Healthcare. Offer flexible payment plans for uninsured patients.
- New patient special: Free exam + X-rays for new patients

Do NOT make up specific appointment times or dates. Instead, offer to connect them with the scheduling team or ask for their preferred day/time so the team can confirm availability.

Start by greeting the patient warmly if it is the first message.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    console.log('[ChatAPI] GEMINI_API_KEY present:', !!apiKey);
    console.log('[ChatAPI] GEMINI_API_KEY length:', apiKey?.length ?? 0);

    if (!apiKey) {
      console.error('[ChatAPI] GEMINI_API_KEY is missing from environment variables');
      return NextResponse.json(
        { error: 'Gemini API key not configured. Please set GEMINI_API_KEY in Vercel environment variables.' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const history = messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    console.log('[ChatAPI] Starting chat with', history.length, 'history messages');

    const chat = model.startChat({
      history,
      systemInstruction: SYSTEM_PROMPT,
    });

    const lastMessage = messages[messages.length - 1];
    console.log('[ChatAPI] Sending message:', lastMessage.content.substring(0, 50));

    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response.text();

    console.log('[ChatAPI] Response received, length:', response.length);

    return NextResponse.json({ message: response });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    const errStack = error instanceof Error ? error.stack : '';
    console.error('[ChatAPI] Error:', errMsg);
    console.error('[ChatAPI] Stack:', errStack);
    return NextResponse.json(
      { error: `Gemini API error: ${errMsg}` },
      { status: 500 }
    );
  }
}
