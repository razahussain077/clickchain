export async function GET() {
  return Response.json({
    service: "ClickChain AI Service Desk Demo",
    status: "preview",
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    mode: "browser-voice-demo",
    dataStorage: "browser-local-storage",
  }, { headers: { "Cache-Control": "no-store" } });
}
