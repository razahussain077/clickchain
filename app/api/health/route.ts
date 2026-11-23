export async function GET() {
  return Response.json({
    service: "ClickChain HVAC Job Intake Demo",
    status: "preview",
    assistantMode: process.env.GEMINI_API_KEY ? "gemini" : "guided-demo",
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    mode: "browser-voice-demo",
    dataStorage: "browser-local-storage",
    telephonyConnected: false,
    crmConnected: false,
    schedulingConnected: false,
  }, { headers: { "Cache-Control": "no-store" } });
}
