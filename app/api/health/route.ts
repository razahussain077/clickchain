export async function GET() {
  return Response.json({
    service: "ClickChain HVAC Job Intake Demo",
    status: "preview",
    assistantMode: process.env.GEMINI_API_KEY ? "gemini-configured" : "guided-demo",
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    aiStatusNote: "Key presence only; each assistant response reports the engine actually used.",
    mode: "browser-voice-demo",
    dataStorage: "browser-local-storage",
    telephonyConnected: false,
    crmConnected: false,
    schedulingConnected: false,
  }, { headers: { "Cache-Control": "no-store" } });
}
