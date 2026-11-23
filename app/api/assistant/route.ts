export const runtime = "nodejs";

type Message = { role: "user" | "model"; text: string };
type Draft = {
  customerName: string;
  phone: string;
  area: string;
  issue: string;
  serviceType: string;
  amcStatus: string;
  priority: string;
  summary: string;
};

const EMPTY: Draft = {
  customerName: "",
  phone: "",
  area: "",
  issue: "",
  serviceType: "Repair",
  amcStatus: "Unknown",
  priority: "Normal",
  summary: "",
};

const SYSTEM_PROMPT = [
  "You are Nora, a professional virtual service-desk receptionist for DesertCool HVAC, a fictional business in a demonstration.",
  "Capture inbound HVAC requests and prepare structured records for a human dispatcher. Speak concise, natural English and ask one question at a time.",
  "Collect customerName, phone, area, issue, serviceType (Repair, Maintenance, AMC, General enquiry), amcStatus (Active, Inactive, Unknown), priority (Normal, Urgent, Safety escalation), and summary.",
  "Never diagnose equipment or provide repair instructions. Never quote a price, promise a technician, guarantee a time or claim an appointment is confirmed.",
  "If smoke, burning smell, sparks, electric shock, fire, exposed wiring or another immediate safety issue is mentioned, first advise the customer to move away and not touch or operate the equipment if unsafe. If there is immediate danger, they should contact local emergency services. Flag for immediate human review.",
  "Ask only for missing fields. Do not ask again for information already shared.",
  "Only set readyToCreateTicket=true when customer name, phone, area and reported issue are known. Do not invent or infer missing personal details.",
  "This is only a demo. Do not claim a real company, phone line, technician, dispatcher or operations team has been contacted.",
  "Return ONLY valid JSON with this exact shape:",
  "{\"reply\":\"string\",\"ticketDraft\":{\"customerName\":\"string\",\"phone\":\"string\",\"area\":\"string\",\"issue\":\"string\",\"serviceType\":\"string\",\"amcStatus\":\"string\",\"priority\":\"string\",\"summary\":\"string\"},\"readyToCreateTicket\":false,\"needsHuman\":false,\"escalationReason\":\"string or empty\"}",
].join("\n");

const AREAS = [
  "Jumeirah Lake Towers", "Dubai Marina", "Business Bay", "Downtown Dubai",
  "Palm Jumeirah", "Jumeirah", "Al Barsha", "Arabian Ranches",
  "Dubai Silicon Oasis", "Silicon Oasis", "Deira", "Bur Dubai",
  "Dubai Sports City", "Sports City", "Motor City", "Mirdif",
  "Discovery Gardens", "International City", "Dubai Hills", "JVC",
  "Jumeirah Village Circle", "Al Furjan", "DIFC", "City Walk",
];

const SAFETY_TERMS = [
  "smoke", "burning smell", "burning odour", "burning odor", "sparks",
  "electric shock", "electrical shock", "exposed wire", "exposed wiring",
  "fire", "flames", "gas leak",
];

function safeString(value: unknown, max = 240): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function normalisePhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return "";
  return value.trim().replace(/[().-]/g, "").replace(/\s+/g, " ");
}

function findName(text: string): string {
  const match = text.match(/(?:my name is|this is|i am|i'm|name is)\s+([a-z][a-z .'-]{1,55})/i);
  if (!match) return "";
  const name = match[1]
    .split(/\b(?:my phone|phone number|i live|i am in|i'm in|we are|from|and my|my ac|the ac)\b/i)[0]
    .replace(/[.,;:!?]+$/g, "")
    .trim();
  return name.split(/\s+/).slice(0, 4).join(" ").replace(/\b[a-z]/g, (letter) => letter.toUpperCase()).slice(0, 70);
}

function findPhone(text: string): string {
  const matches = text.match(/(?:\+?\d[\d\s().-]{6,}\d)/g) || [];
  for (const candidate of matches) {
    const normalised = normalisePhone(candidate);
    if (normalised) return normalised;
  }
  return "";
}

function findArea(text: string): string {
  const lower = text.toLowerCase();
  return AREAS.find((area) => lower.includes(area.toLowerCase())) || "";
}

function findIssue(text: string): string {
  const sentences = text.split(/(?<=[.!?])\s+|\n+/).map((part) => part.trim()).filter(Boolean);
  const keywords = [
    "not cooling", "not cool", "cooling", "leaking", "water leak", "leak",
    "burning smell", "smoke", "sparks", "noise", "rattling", "making a sound",
    "maintenance", "service", "not turning on", "not working", "no air",
  ];
  const found = sentences.find((sentence) => keywords.some((word) => sentence.toLowerCase().includes(word)));
  if (found) return found.replace(/^i have\s+/i, "").slice(0, 220);
  const fallback = sentences.find((sentence) => /\b(ac|air conditioner|aircon|hvac|cooler)\b/i.test(sentence));
  return fallback ? fallback.slice(0, 220) : "";
}

function guidedResponse(messages: Message[]) {
  const userText = messages.filter((message) => message.role === "user").map((message) => message.text).join("\n");
  const draft: Draft = { ...EMPTY };
  draft.customerName = findName(userText);
  draft.phone = findPhone(userText);
  draft.area = findArea(userText);
  draft.issue = findIssue(userText);

  const lower = userText.toLowerCase();
  if (/\b(amc|annual maintenance contract)\b/.test(lower)) draft.serviceType = "AMC";
  else if (/\b(maintenance|servicing|service visit|routine service)\b/.test(lower)) draft.serviceType = "Maintenance";
  else if (/\b(general question|general enquiry|general inquiry|information)\b/.test(lower)) draft.serviceType = "General enquiry";
  else if (/\b(repair|not cooling|not working|leak|noise|smoke|burning|sparks)\b/.test(lower)) draft.serviceType = "Repair";

  if (/\b(active amc|amc is active|have an active amc)\b/.test(lower)) draft.amcStatus = "Active";
  else if (/\b(no amc|without amc|amc expired|inactive amc)\b/.test(lower)) draft.amcStatus = "Inactive";

  const safetyTerm = SAFETY_TERMS.find((term) => lower.includes(term));
  const needsHuman = Boolean(safetyTerm);
  const urgent = /\b(urgent|as soon as possible|emergency|immediately|today)\b/.test(lower);
  draft.priority = needsHuman ? "Safety escalation" : urgent ? "Urgent" : "Normal";
  draft.summary = draft.issue
    ? draft.serviceType + " request: " + draft.issue + (draft.area ? " Location: " + draft.area + "." : "")
    : "";

  const missing: string[] = [];
  if (!draft.customerName) missing.push("your name");
  if (!draft.phone) missing.push("best contact number");
  if (!draft.area) missing.push("Dubai area or community");
  if (!draft.issue) missing.push("what is happening with the AC");

  let reply = "";
  let readyToCreateTicket = missing.length === 0;
  if (needsHuman) {
    const warning = "This may be a safety concern. Please move away from the unit and do not touch or operate it if it may be unsafe. If there is immediate danger, contact local emergency services.";
    if (readyToCreateTicket) {
      reply = warning + " I have prepared a safety-escalation request for a human coordinator to review. No technician has been contacted and no visit is booked in this demo.";
    } else {
      readyToCreateTicket = false;
      reply = warning + " Once you are safe, I can prepare a human-review request. The details still needed are " + missing.join(", ") + ".";
    }
  } else if (readyToCreateTicket) {
    reply = "Thank you, " + draft.customerName + ". I have prepared your " + draft.serviceType.toLowerCase() + " request for " + draft.area + ". A human coordinator must review it and confirm availability, pricing and any appointment. Nothing has been booked in this demo.";
  } else {
    const prompts: Record<string, string> = {
      "your name": "May I have your name, please?",
      "best contact number": "What is the best contact number for the service team to use?",
      "Dubai area or community": "Which Dubai area or community is the property in?",
      "what is happening with the AC": "Could you briefly describe what is happening with the AC?",
    };
    reply = prompts[missing[0]] || "Could you share a little more about the service request?";
  }

  return {
    reply,
    ticketDraft: draft,
    readyToCreateTicket,
    needsHuman,
    escalationReason: needsHuman ? "Safety keyword detected: " + safetyTerm + ". Route to a human before ordinary scheduling." : "",
    mode: "guided-demo" as const,
  };
}

function normaliseAiResult(parsed: any, messages: Message[]) {
  const draft = parsed?.ticketDraft || {};
  const safeDraft: Draft = {
    customerName: safeString(draft.customerName, 70),
    phone: normalisePhone(safeString(draft.phone, 40)),
    area: safeString(draft.area, 100),
    issue: safeString(draft.issue, 220),
    serviceType: ["Repair", "Maintenance", "AMC", "General enquiry"].includes(draft.serviceType) ? draft.serviceType : "Repair",
    amcStatus: ["Active", "Inactive", "Unknown"].includes(draft.amcStatus) ? draft.amcStatus : "Unknown",
    priority: ["Normal", "Urgent", "Safety escalation"].includes(draft.priority) ? draft.priority : "Normal",
    summary: safeString(draft.summary, 300),
  };
  const source = messages.filter((message) => message.role === "user").map((message) => message.text).join(" ").toLowerCase();
  const safetyTerm = SAFETY_TERMS.find((term) => source.includes(term));
  const needsHuman = Boolean(parsed?.needsHuman || safetyTerm);
  if (safetyTerm) safeDraft.priority = "Safety escalation";
  const complete = Boolean(safeDraft.customerName && safeDraft.phone && safeDraft.area && safeDraft.issue);
  const readyToCreateTicket = Boolean(parsed?.readyToCreateTicket && complete);
  const safetyReply = safetyTerm
    ? "This may be a safety concern. Please move away from the unit and do not touch or operate it if it may be unsafe. If there is immediate danger, contact local emergency services. I am flagging this for human review."
    : "";
  return {
    reply: safetyReply || safeString(parsed?.reply, 800) || "Thank you. Could you tell me a little more about the request?",
    ticketDraft: safeDraft,
    readyToCreateTicket,
    needsHuman,
    escalationReason: needsHuman ? safeString(parsed?.escalationReason, 240) || (safetyTerm ? "Safety keyword detected: " + safetyTerm + "." : "Human review requested.") : "",
    mode: "gemini" as const,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const incoming = Array.isArray(body?.messages) ? body.messages.slice(-12) : [];
    if (incoming.length === 0) {
      return Response.json({ error: "Send a short conversation to continue the demo." }, { status: 400 });
    }

    const messages: Message[] = incoming.map((message: any) => ({
      role: message?.role === "model" ? "model" : "user",
      text: safeString(message?.text, 700),
    })).filter((message: Message) => message.text.length > 0);

    if (messages.length === 0) {
      return Response.json({ error: "The conversation did not contain any text." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const contents = messages.map((message) => ({
          role: message.role === "model" ? "model" : "user",
          parts: [{ text: message.text }],
        }));
        const upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents,
            generationConfig: { temperature: 0.2, maxOutputTokens: 650, responseMimeType: "application/json" },
          }),
          signal: AbortSignal.timeout(18000),
          cache: "no-store",
        });

        if (upstream.ok) {
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
          return Response.json(normaliseAiResult(parsed, messages), { headers: { "Cache-Control": "no-store" } });
        }
      } catch (error) {
        console.warn("Gemini unavailable; using guided demo assistant.", error instanceof Error ? error.message : "unknown error");
      }
    }

    return Response.json(guidedResponse(messages), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "The demo assistant could not read this request. Please try again." }, { status: 400 });
  }
}
