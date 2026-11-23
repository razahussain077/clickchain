# ClickChain — HVAC Job Intake Demo

A light-theme interactive preview of ClickChain's AI Job Intake Agent for HVAC maintenance and repair operators.

## What this demo does

- Browser-based customer conversation with Nora using text input.
- Optional browser voice input (SpeechRecognition) and spoken replies (SpeechSynthesis), subject to browser and microphone support.
- Gemini-powered responses when GEMINI_API_KEY is configured on the server.
- Deterministic guided-demo assistant fallback when the Gemini key is absent or the provider is unavailable.
- Extracts a service-request draft: customer name, phone, Dubai area, reported issue, service type, AMC status and priority.
- Detects safety-sensitive language such as smoke, burning smell, sparks, electrical shock, fire or gas leak, and flags it for human review.
- Operations dashboard with sample requests, search, filters, status changes, detail view, copy summary and CSV export.
- Browser-local persistence of demo tickets.

## Demo business and sample data

DesertCool HVAC is fictional. Names, telephone numbers, requests and dashboard entries are illustrative sample data. Do not enter real customer personal information.

## What is not connected

This preview does not connect to:
- a live UAE telephone number, inbound phone routing or WhatsApp Business;
- a real HVAC company, employee, dispatcher, technician or customer;
- a shared server database or multi-user workspace;
- a CRM / field-service platform, calendar, technician schedule or dispatch system;
- live customer notifications or appointment booking.

Tickets are saved in the current browser's local storage. They are not shared between devices or users and may be lost if browser data is cleared. Export the CSV when testing.

## Environment

Optional server-side variable:

- GEMINI_API_KEY — enables Gemini-generated conversation replies. Never expose this through a NEXT_PUBLIC_ variable.

Without this key, the demo runs in guided mode using deterministic field extraction and scripted prompts. This allows the sample workflow to be tested without buying API usage.

The current assistant model identifier is gemini-3.8-flash.

## Run locally

1. Install dependencies: npm install
2. Optional: set GEMINI_API_KEY in the server environment.
3. Start the app: npm run dev
4. Open http://localhost:3000.
5. Select Try the interactive demo and use either the sample scenario or text input.

## Routes

- / — light-theme product overview.
- /demo — interactive operations workspace and job-intake simulator.
- /api/assistant — Gemini or guided-demo assistant endpoint.
- /api/health — reports preview mode and actual integration flags.

## Before a real customer pilot

A production deployment still needs a shared persistent database, tenant-level authentication and access control, live UAE telephony/provider setup, a tested CRM/FSM integration, monitoring, data-retention controls and a customer-approved data-processing/recording policy. Do not treat this preview as a production phone receptionist.
