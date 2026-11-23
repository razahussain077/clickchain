"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Bot, ClipboardList, Link2, LoaderCircle, Mic, MicOff, RefreshCw, ShieldAlert, UserRound, Volume2, Wrench } from "lucide-react";

type ChatMessage = { role: "user" | "model"; text: string };
type TicketDraft = { customerName: string; phone: string; area: string; issue: string; serviceType: string; amcStatus: string; priority: string; summary: string };
type Ticket = TicketDraft & { id: string; createdAt: string; status: string; demo: true };
type SpeechEvent = { results: ArrayLike<ArrayLike<{ transcript: string }>> };
type SpeechError = { error: string };
type Recognition = { lang: string; continuous: boolean; interimResults: boolean; onresult: ((event: SpeechEvent) => void) | null; onerror: ((event: SpeechError) => void) | null; onend: (() => void) | null; start: () => void; stop: () => void };
type SpeechWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };

const STORAGE_KEY = "clickchain-hvac-demo-tickets-v1";
const GREETING: ChatMessage = { role: "model", text: "Thanks for calling DesertCool HVAC. My name is Nora, the virtual service desk assistant. How can I help with your AC or maintenance request today?" };
const EMPTY: TicketDraft = { customerName: "", phone: "", area: "", issue: "", serviceType: "Repair", amcStatus: "Unknown", priority: "Normal", summary: "" };

function Mark() { return <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white"><Link2 size={19}/></span>; }
function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.98;
  const voice = window.speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("en"));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

export default function DemoPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [draft, setDraft] = useState<TicketDraft>(EMPTY);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [escalated, setEscalated] = useState(false);
  const [ticketCreated, setTicketCreated] = useState(false);
  const [aiReady, setAiReady] = useState(true);
  const [showTickets, setShowTickets] = useState(false);
  const recognitionRef = useRef<Recognition | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try { const stored = localStorage.getItem(STORAGE_KEY); if (stored) setTickets(JSON.parse(stored) as Ticket[]); } catch { setTickets([]); }
    const speechWindow = window as SpeechWindow;
    setVoiceSupported(Boolean(speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition));
  }, []);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, loading]);

  const saveTicket = useCallback((ticket: Ticket) => {
    setTickets((previous) => {
      const next = [ticket, ...previous].slice(0, 30);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* optional local demo storage */ }
      return next;
    });
  }, []);

  const sendMessage = useCallback(async (value: string) => {
    const clean = value.trim().slice(0, 600);
    if (!clean || loading || ticketCreated) return;
    setError(""); setNotice(""); setLoading(true); setText("");
    const next = [...messages, { role: "user" as const, text: clean }];
    setMessages(next);
    try {
      const response = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next.slice(-12) }) });
      const payload = await response.json();
      if (!response.ok) { setAiReady(false); throw new Error(payload.error || "The AI assistant is temporarily unavailable."); }
      setAiReady(true);
      const answer = String(payload.reply || "Thank you. Could you tell me a little more about the request?");
      setMessages((previous) => [...previous, { role: "model", text: answer }]);
      const ticketDraft = { ...EMPTY, ...(payload.ticketDraft || {}) } as TicketDraft;
      setDraft(ticketDraft);
      setEscalated(Boolean(payload.needsHuman));
      speak(answer);
      const complete = Boolean(ticketDraft.customerName && ticketDraft.phone && ticketDraft.area && ticketDraft.issue);
      if (payload.readyToCreateTicket && complete && !ticketCreated) {
        const ticket: Ticket = {
          ...ticketDraft,
          id: "CC-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
          createdAt: new Date().toISOString(),
          status: payload.needsHuman ? "Needs human review" : "New",
          demo: true,
        };
        saveTicket(ticket);
        setTicketCreated(true);
        setNotice("Service request created in this browser demo. It has not been sent to a real HVAC company.");
        setShowTickets(true);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally { setLoading(false); }
  }, [loading, messages, saveTicket, ticketCreated]);

  const startListening = () => {
    setError("");
    const speechWindow = window as SpeechWindow;
    const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) { setVoiceSupported(false); setError("Voice input is not available in this browser. Use the text box below."); return; }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results).map((result) => result[0]?.transcript || "").join(" ").trim();
        if (transcript) void sendMessage(transcript);
      };
      recognition.onerror = (event) => { setError(event.error === "not-allowed" ? "Microphone permission was blocked. Allow access or use text mode." : "Voice input stopped. Please try again."); setListening(false); };
      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
      recognition.start();
      setListening(true);
    } catch { setError("The microphone could not start. Try Chrome or use text mode."); setListening(false); }
  };
  const stopListening = () => { recognitionRef.current?.stop(); setListening(false); };
  const reset = () => {
    recognitionRef.current?.stop();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setMessages([GREETING]); setDraft(EMPTY); setTicketCreated(false); setEscalated(false); setError(""); setNotice(""); setShowTickets(false); setAiReady(true);
  };
  const addSample = () => {
    const ticket: Ticket = { ...EMPTY, customerName: "Ahmed Rahman", phone: "+971 50 123 4567", area: "Dubai Marina", issue: "AC is running but not cooling", serviceType: "Repair", amcStatus: "Unknown", priority: "Normal", summary: "Customer reports an AC cooling issue and requests a service visit.", id: "CC-SAMPLE-" + Math.random().toString(36).slice(2, 5).toUpperCase(), createdAt: new Date().toISOString(), status: "New · Sample", demo: true };
    saveTicket(ticket); setShowTickets(true); setNotice("A fictional sample ticket was added to this browser.");
  };

  return (
    <main className="min-h-screen bg-[#071426] text-[#F8FAFC]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3"><Mark/><span className="text-lg font-semibold">ClickChain</span><span className="hidden rounded-full border border-blue-300/20 bg-blue-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-200 sm:inline-flex">Interactive demo</span></Link>
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"><ArrowLeft size={16}/> Back to overview</Link>
      </header>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8">
        <div className="mb-8 max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">AI service desk · Browser demo</p><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Try a customer service call.</h1><p className="mt-3 leading-7 text-slate-400">Talk to Nora, the sample HVAC service desk assistant. She can capture a service request and prepare it for an operations team.</p></div>
        <div className="mb-6 flex gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/[0.07] px-4 py-3 text-sm text-amber-100"><ShieldAlert size={18} className="mt-0.5 shrink-0 text-amber-300"/><p><strong>Demo environment:</strong> DesertCool HVAC is fictional. Use sample details only. This is not connected to a live phone line, technician schedule or real HVAC company. Tickets stay in this browser.</p></div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.82fr)]">
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#0C1D32]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/15 text-blue-200"><Bot size={21}/></span><div><p className="font-semibold">Nora · Virtual service desk</p><p className="text-xs text-slate-400">DesertCool HVAC · Sample business</p></div></div><span className="inline-flex items-center gap-2 text-xs text-teal-200"><span className="h-2 w-2 rounded-full bg-teal-400"/> Demo assistant</span></div>
            <div ref={scrollRef} className="h-[390px] space-y-4 overflow-y-auto px-5 py-5 sm:h-[440px] sm:px-6">
              {messages.map((message, index) => <div key={index} className={"flex gap-3 " + (message.role === "user" ? "justify-end" : "justify-start")}>
                {message.role === "model" && <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-blue-200"><Bot size={16}/></span>}
                <div className={"max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 " + (message.role === "user" ? "rounded-br-md bg-blue-600 text-white" : "rounded-bl-md border border-white/10 bg-[#10243C] text-slate-200")}>{message.text}</div>
                {message.role === "user" && <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-slate-300"><UserRound size={16}/></span>}
              </div>)}
              {loading && <div className="flex items-center gap-3 text-sm text-slate-400"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/15 text-blue-200"><Bot size={16}/></span><LoaderCircle size={16} className="animate-spin"/> Nora is preparing a response…</div>}
            </div>
            <div className="border-t border-white/10 p-5 sm:p-6">
              {error && <div className="mb-4 rounded-xl border border-rose-300/20 bg-rose-300/[0.07] p-3 text-xs leading-5 text-rose-100">{error}</div>}
              {notice && <div className="mb-4 rounded-xl border border-teal-300/20 bg-teal-300/[0.07] p-3 text-xs leading-5 text-teal-100">{notice}</div>}
              {escalated && <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-300/20 bg-amber-300/[0.07] p-3 text-xs leading-5 text-amber-100"><ShieldAlert size={16} className="mt-0.5 shrink-0"/> This scenario has been flagged for human review in the demo.</div>}
              <div className="flex flex-wrap gap-2">
                <button onClick={() => void sendMessage("My AC is running but not cooling in Dubai Marina. My name is Ahmed. My phone number is +971 50 123 4567. I need a repair visit.")} disabled={loading || ticketCreated} className="rounded-full border border-blue-300/20 bg-blue-300/[0.07] px-3 py-2 text-xs text-blue-100 transition hover:bg-blue-300/15 disabled:opacity-40">Try a sample AC issue</button>
                <button onClick={() => void sendMessage("There is a burning smell coming from the AC unit. I am worried this may be unsafe.")} disabled={loading || ticketCreated} className="rounded-full border border-amber-300/20 bg-amber-300/[0.06] px-3 py-2 text-xs text-amber-100 transition hover:bg-amber-300/15 disabled:opacity-40">Try an urgent case</button>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button onClick={listening ? stopListening : startListening} disabled={loading || ticketCreated} className={"inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 " + (listening ? "bg-rose-500 text-white hover:bg-rose-400" : "bg-blue-600 text-white hover:bg-blue-500")}>{listening ? <MicOff size={17}/> : <Mic size={17}/>} {listening ? "Stop listening" : "Speak to Nora"}</button>
                <form onSubmit={(event) => { event.preventDefault(); void sendMessage(text); }} className="flex min-w-0 flex-1 gap-2"><input value={text} onChange={(event) => setText(event.target.value)} placeholder="Or type your service request…" disabled={loading || ticketCreated} className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#071426] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-400 disabled:opacity-50"/><button type="submit" disabled={loading || ticketCreated || !text.trim()} className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#071426] transition hover:bg-blue-50 disabled:opacity-40"><ArrowRight size={19}/></button></form>
              </div>
              {!voiceSupported && <p className="mt-2 text-xs text-slate-500">Speech recognition is not available in this browser. Text mode is available.</p>}
              <div className="mt-4 flex items-center justify-between"><button onClick={reset} className="inline-flex items-center gap-2 text-xs text-slate-400 transition hover:text-white"><RefreshCw size={13}/> Reset conversation</button><span className="text-[10px] text-slate-500">English · Browser microphone</span></div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-[#0C1D32] p-5 sm:p-6">
              <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Captured information</p><h2 className="mt-2 text-lg font-semibold">Service request draft</h2></div><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-200"><ClipboardList size={20}/></span></div>
              <div className="mt-5 space-y-4">{[["Customer", draft.customerName],["Phone", draft.phone],["Area", draft.area],["Issue", draft.issue],["Service type", draft.serviceType],["AMC status", draft.amcStatus],["Priority", draft.priority]].map(([label, value]) => <div key={label} className="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-3 text-sm last:border-0"><span className="text-slate-500">{label}</span><span className="max-w-[65%] text-right text-slate-200">{value || "Waiting for call…"}</span></div>)}</div>
              <div className="mt-4 rounded-xl bg-[#071426] p-3 text-xs leading-5 text-slate-400">The AI prepares the request. A human dispatcher confirms availability, pricing and the final appointment.</div>
            </section>
            <section className="rounded-3xl border border-white/10 bg-[#0C1D32] p-5 sm:p-6">
              <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Operations view</p><h2 className="mt-2 text-lg font-semibold">Service requests</h2></div><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/10 text-teal-200"><Wrench size={20}/></span></div>
              <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-[#071426] p-4"><p className="text-2xl font-semibold">{tickets.length}</p><p className="mt-1 text-xs text-slate-500">Saved in this browser</p></div><div className="rounded-xl bg-[#071426] p-4"><p className="text-2xl font-semibold">{tickets.filter((ticket) => ticket.status.toLowerCase().includes("human")).length}</p><p className="mt-1 text-xs text-slate-500">Human reviews</p></div></div>
              <button onClick={() => setShowTickets(!showTickets)} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5">{showTickets ? "Hide request dashboard" : "Open request dashboard"} <ArrowRight size={15}/></button>
            </section>
            <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-xs leading-5 text-slate-400"><div className="mb-2 flex items-center gap-2 font-semibold text-slate-200"><Volume2 size={15}/> Voice demo notes</div>Microphone input and spoken responses use browser speech features. The assistant's replies are generated by a server-side AI endpoint. This demo does not place or receive telephone calls.{aiReady ? <p className="mt-2 text-teal-200">AI endpoint configured for preview.</p> : <p className="mt-2 text-amber-200">AI endpoint needs configuration or is temporarily unavailable.</p>}</section>
          </aside>
        </div>

        {showTickets && <section className="mt-6 rounded-3xl border border-white/10 bg-[#0C1D32] p-5 sm:p-7"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Local demo records</p><h2 className="mt-2 text-xl font-semibold">Service request dashboard</h2><p className="mt-1 text-sm text-slate-400">Sample records are saved only in this browser.</p></div><div className="flex flex-wrap gap-2"><button onClick={addSample} className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/5">Add sample request</button><button onClick={() => setShowTickets(false)} className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-500">Close dashboard</button></div></div>
          <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500"><tr><th className="pb-3 pr-4">Request</th><th className="pb-3 pr-4">Customer</th><th className="pb-3 pr-4">Area</th><th className="pb-3 pr-4">Issue</th><th className="pb-3 pr-4">Priority</th><th className="pb-3">Status</th></tr></thead><tbody>{tickets.map((ticket) => <tr key={ticket.id} className="border-b border-white/[0.06] last:border-0"><td className="py-4 pr-4 font-medium text-blue-200">{ticket.id}<div className="mt-1 text-[10px] font-normal text-slate-500">{new Date(ticket.createdAt).toLocaleString()}</div></td><td className="py-4 pr-4 text-slate-200">{ticket.customerName}<div className="mt-1 text-xs text-slate-500">{ticket.phone}</div></td><td className="py-4 pr-4 text-slate-300">{ticket.area}</td><td className="py-4 pr-4 text-slate-300">{ticket.issue}</td><td className="py-4 pr-4 text-slate-300">{ticket.priority}</td><td className="py-4 text-slate-300">{ticket.status}</td></tr>)}{tickets.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-sm text-slate-500">No requests yet. Complete a demo call or add a sample request.</td></tr>}</tbody></table></div>
        </section>}
      </section>
      <footer className="border-t border-white/10 px-5 py-7 text-center text-xs text-slate-500">ClickChain · AI Service Desk prototype · Fictional business and sample data only</footer>
    </main>
  );
}
