# ClickChain — HVAC AI Service Desk Demo

A preview prototype for ClickChain's AI Job Intake Agent for HVAC and field-service companies.

## Included
- Browser-based English voice demo using browser speech recognition and speech synthesis.
- Server-side Gemini-powered conversational service-desk assistant.
- Structured service-request draft capture.
- Human escalation flags for safety-sensitive or uncertain cases.
- Local browser dashboard for demo tickets.

## Demo limitations
- DesertCool HVAC is fictional.
- This prototype does not connect to a live telephone number, WhatsApp Business account, real CRM/FSM, dispatch schedule or technician.
- Tickets are saved only in the current browser's local storage.
- Use sample details only. Do not enter real customer personal data.
- Live UAE telephony, shared persistent storage, carrier agreement, data-processing review and production monitoring are separate implementation steps.

## Environment
Set GEMINI_API_KEY as a server-side environment variable. Never expose it through a NEXT_PUBLIC_ variable.
Preview model: gemini-3.8-flash.

## Run locally
1. Install dependencies with npm install.
2. Set GEMINI_API_KEY in the local server environment.
3. Run npm run dev.
4. Open http://localhost:3000 and use the Interactive Demo link.

## Routes
- / — ClickChain product overview.
- /demo — interactive AI service-desk prototype.
- /api/assistant — server-side Gemini conversation endpoint.
- /api/health — preview health information.
