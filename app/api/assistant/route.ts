export const runtime = "nodejs";

type Message = { role: "user" | "model"; text: string };

const SYSTEM_PROMPT = [
  "You are Nora, a professional virtual service-desk receptionist for DesertCool HVAC, a fictional HVAC company used only in a product demonstration.",
  "Your job is to capture an inbound AC or HVAC service request and prepare a structured draft for a human dispatcher.",
  "Speak in concise, natural, polite English. Ask one question at a time.",
  "Collect customerName, phone, area, issue, serviceType (Repair, Maintenance, AMC, General enquiry), amcStatus (Active, Inactive, Unknown), priority (Normal, Urgent, Safety escalation), and summary.",
  "Do not diagnose or instruct the customer to repair electrical, refrigerant, compressor, wiring or other technical equipment. Do not quote prices, promise a technician, guarantee a time, or claim an appointment is confirmed.",
  "If the user mentions smoke, burning smell, sparks, electric shock, exposed wiring, fire, or another immediate safety concern, calmly advise them not to touch or operate the equipment if unsafe, flag the case for immediate human review, and do not continue ordinary booking questions.",
  "If the customer asks for a live technician, explain that the operations team must confirm availability. Never invent a technician or schedule.",
  "Ask only for missing details. Do not ask again for information already supplied in prior messages.",
  "Only set readyToCreateTicket=true when customer name, phone, area and issue are all known. If a caller does not want to share a phone number, respect that and do not create a ticket.",
  "This is a demo. Do not claim that a real company, phone line, technician or dispatch team has been contacted.",
  "Return ONLY valid JSON with this exact shape:",
  "{\"reply\":\"string\",\"ticketDraft\":{\"customerName\":\"string\",\"phone\":\"string\",\"area\":\"string\",\"issue\":\"string\",\"serviceType\":\"string\",\"amcStatus\":\"string\",\"priority\":\"string\",\"summary\":\"string\"},\"readyToCreateTicket\":false,\"needsHuman\":false,\"escalationReason\":\"string or empty\"}",
].join("\n");

function safeString(value: unknown, max = 240): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return Response.json({ error: "AI endpoint is not configured for this deployment." }, { status: 503 });

  try {
    const body = await request.json();
    const incoming = Array.isArray(body?.messages) ? body.messages.slice(-12) : [];
    if (incoming.length === 0) return Response.json({ error: "Send a short conversation to continue the demo." }, { status: 400 });
    const contents = incoming.map((message: Message) => ({
      role: message.role === "model" ? "model" : "user",
      parts: [{ text: safeString(message.text, 700) }],
    })).filter((item: { parts: { text: string }[] }) => item.parts[0].text.length > 0);

    const upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.25, maxOutputTokens: 650, responseMimeType: "application/json" },
      }),
      signal: AbortSignal.timeout(25000),
      cache: "no-store",
    });

    if (!upstream.ok) {
      const errorBody = await upstream.text();
      console.error("Gemini request failed:", upstream.status, errorBody.slice(0, 500));
      return Response.json({ error: "The AI assistant could not respond right now. Please try again." }, { status: 502 });
    }

    const result = await upstream.json();
    const raw = result?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("") || "";
    let parsed: any;
    try { parsed = JSON.parse(raw); }
    catch {
      const first = raw.indexOf("{");
      const last = raw.lastIndexOf("}");
      if (first < 0 || last <= first) throw new Error("Invalid assistant response");
      parsed = JSON.parse(raw.slice(first, last + 1));
    }

    const draft = parsed?.ticketDraft || {};
    return Response.json({
      reply: safeString(parsed?.reply, 800) || "Thank you. Could you tell me a little more about the request?",
      ticketDraft: {
        customerName: safeString(draft.customerName, 100),
        phone: safeString(draft.phone, 40),
        area: safeString(draft.area, 120),
        issue: safeString(draft.issue, 240),
        serviceType: safeString(draft.serviceType, 40) || "Repair",
        amcStatus: safeString(draft.amcStatus, 40) || "Unknown",
        priority: safeString(draft.priority, 40) || "Normal",
        summary: safeString(draft.summary, 300),
      },
      readyToCreateTicket: Boolean(parsed?.readyToCreateTicket),
      needsHuman: Boolean(parsed?.needsHuman),
      escalationReason: safeString(parsed?.escalationReason, 240),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Assistant route error:", error instanceof Error ? error.message : "Unknown error");
    return Response.json({ error: "The demo assistant is temporarily unavailable. Please try again." }, { status: 500 });
  }
}
