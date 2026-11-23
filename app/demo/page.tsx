"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, AlertTriangle, ArrowDownToLine, ArrowLeft, ArrowRight,
  Bot, Check, CheckCircle2, ChevronDown, ClipboardList, Headset,
  LayoutDashboard, Link2, LoaderCircle, MapPin, MessageSquare, Mic, MicOff,
  Phone, Plus, RefreshCw, Search, Send, ShieldAlert, ShieldCheck,
  Trash2, UserRound, Volume2, Wrench, X
} from "lucide-react";

type ChatMessage = { role: "user" | "model"; text: string };
type TicketDraft = {
  customerName: string;
  phone: string;
  area: string;
  issue: string;
  serviceType: string;
  amcStatus: string;
  priority: string;
  summary: string;
};
type Ticket = TicketDraft & {
  id: string;
  createdAt: string;
  status: string;
  demo: true;
};
type SpeechEvent = { results: ArrayLike<ArrayLike<{ transcript: string }>> };
type SpeechError = { error: string };
type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechEvent) => void) | null;
  onerror: ((event: SpeechError) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechWindow = Window & {
  SpeechRecognition?: new () => Recognition;
  webkitSpeechRecognition?: new () => Recognition;
};

const STORAGE_KEY = "clickchain-job-intake-demo-v2";
const GREETING: ChatMessage = {
  role: "model",
  text: "Thank you for contacting DesertCool HVAC. I am Nora, the virtual service desk assistant. How can I help with your AC or maintenance request today?"
};
const EMPTY: TicketDraft = {
  customerName: "",
  phone: "",
  area: "",
  issue: "",
  serviceType: "Repair",
  amcStatus: "Unknown",
  priority: "Normal",
  summary: ""
};
const SAMPLE_TICKETS: Ticket[] = [
  {
    id: "CC-2041", customerName: "Ahmed Rahman", phone: "+971 50 123 4567",
    area: "Dubai Marina", issue: "AC running but not cooling",
    serviceType: "Repair", amcStatus: "Unknown", priority: "Normal",
    summary: "Customer reports an AC cooling issue and requests a service review.",
    createdAt: "2026-11-24T06:40:00.000Z", status: "New", demo: true
  },
  {
    id: "CC-2040", customerName: "Huda Malik", phone: "+971 55 987 1234",
    area: "Business Bay", issue: "Water leaking from indoor AC unit",
    serviceType: "Repair", amcStatus: "Active", priority: "Urgent",
    summary: "Water leak reported from the indoor unit. Coordinator review requested.",
    createdAt: "2026-11-24T05:15:00.000Z", status: "In review", demo: true
  },
  {
    id: "CC-2039", customerName: "Omar Saeed", phone: "+971 52 555 0198",
    area: "Jumeirah Lake Towers", issue: "Annual AC maintenance visit",
    serviceType: "Maintenance", amcStatus: "Active", priority: "Normal",
    summary: "Customer wants to arrange routine maintenance under an active AMC.",
    createdAt: "2026-11-23T15:25:00.000Z", status: "Needs human review", demo: true
  }
];

function Mark({ small = false }: { small?: boolean }) {
  return <span className={"inline-flex shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200 " + (small ? "h-9 w-9" : "h-10 w-10")}><Link2 size={small ? 18 : 20} strokeWidth={2.4}/></span>;
}

function statusClasses(status: string) {
  if (status === "Needs human review") return "bg-amber-50 text-amber-800 ring-amber-200";
  if (status === "Resolved") return "bg-emerald-50 text-emerald-800 ring-emerald-200";
  if (status === "In review") return "bg-blue-50 text-blue-800 ring-blue-200";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

function priorityClasses(priority: string) {
  if (priority === "Safety escalation") return "bg-rose-50 text-rose-800";
  if (priority === "Urgent") return "bg-amber-50 text-amber-800";
  return "bg-slate-100 text-slate-600";
}

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.96;
  const voice = window.speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("en"));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

function makeId() {
  return "CC-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

export default function DemoPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [tickets, setTickets] = useState<Ticket[]>(SAMPLE_TICKETS);
  const [draft, setDraft] = useState<TicketDraft>(EMPTY);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [voiceOutput, setVoiceOutput] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [escalated, setEscalated] = useState(false);
  const [escalationReason, setEscalationReason] = useState("");
  const [ticketCreated, setTicketCreated] = useState(false);
  const [assistantMode, setAssistantMode] = useState("Checking");
  const [activeView, setActiveView] = useState<"overview" | "intake" | "requests">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All requests");
  const [selectedTicketId, setSelectedTicketId] = useState("CC-2041");
  const [hydrated, setHydrated] = useState(false);
  const recognitionRef = useRef<Recognition | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setTickets(parsed as Ticket[]);
      }
    } catch {
      setNotice("The browser could not read saved demo records. A fresh sample workspace is loaded.");
    }
    setHydrated(true);
    const speechWindow = window as SpeechWindow;
    setVoiceSupported(Boolean(speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition));
    fetch("/api/health", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setAssistantMode(data.assistantMode === "gemini" ? "AI assistant" : "Guided demo assistant"))
      .catch(() => setAssistantMode("Guided demo assistant"));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets)); }
    catch { setNotice("Browser storage is full. Export your demo records before adding more."); }
  }, [tickets, hydrated]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const openTickets = tickets.filter((ticket) => ticket.status !== "Resolved").length;
  const humanTickets = tickets.filter((ticket) => ticket.status === "Needs human review").length;
  const urgentTickets = tickets.filter((ticket) => ticket.priority === "Urgent" || ticket.priority === "Safety escalation").length;

  const filteredTickets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const matchesQuery = !query || [
        ticket.id, ticket.customerName, ticket.phone, ticket.area, ticket.issue, ticket.serviceType
      ].join(" ").toLowerCase().includes(query);
      const matchesFilter = filter === "All requests"
        || (filter === "Open" && ticket.status !== "Resolved")
        || (filter === "Needs human review" && ticket.status === "Needs human review")
        || (filter === "Resolved" && ticket.status === "Resolved")
        || (filter === "Urgent" && (ticket.priority === "Urgent" || ticket.priority === "Safety escalation"));
      return matchesQuery && matchesFilter;
    });
  }, [tickets, searchQuery, filter]);

  const selectedTicket = tickets.find((ticket) => ticket.id === selectedTicketId) || null;
  const draftComplete = Boolean(draft.customerName && draft.phone && draft.area && draft.issue);

  const saveTicket = useCallback((ticket: Ticket) => {
    setTickets((previous) => [ticket, ...previous].slice(0, 100));
    setSelectedTicketId(ticket.id);
    setActiveView("requests");
  }, []);

  const sendMessage = useCallback(async (value: string, shouldSpeak = false, newConversation = false) => {
    const clean = value.trim().slice(0, 600);
    if (!clean || loading || (ticketCreated && !newConversation)) return;
    setError("");
    setNotice("");
    setLoading(true);
    setText("");
    const baseMessages = newConversation ? [GREETING] : messages;
    const next = [...baseMessages, { role: "user" as const, text: clean }];
    setMessages(next);
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-12) })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "The assistant could not respond. Please try again.");
      const answer = String(payload.reply || "Thank you. Could you tell me a little more about the request?");
      setMessages((previous) => [...previous, { role: "model", text: answer }]);
      const nextDraft = { ...EMPTY, ...(payload.ticketDraft || {}) } as TicketDraft;
      setDraft(nextDraft);
      setEscalated(Boolean(payload.needsHuman));
      setEscalationReason(String(payload.escalationReason || ""));
      if (shouldSpeak && voiceOutput) speak(answer);
      const complete = Boolean(nextDraft.customerName && nextDraft.phone && nextDraft.area && nextDraft.issue);
      if (payload.readyToCreateTicket && complete && !ticketCreated) {
        const ticket: Ticket = {
          ...nextDraft,
          id: makeId(),
          createdAt: new Date().toISOString(),
          status: payload.needsHuman ? "Needs human review" : "New",
          demo: true
        };
        saveTicket(ticket);
        setTicketCreated(true);
        setNotice("Request created in this browser demo. It has not been sent to a real HVAC company or operations team.");
      } else if (payload.mode === "guided-demo") {
        setNotice("Guided demo assistant is active. Add a Gemini API key in the server environment to enable live AI-generated replies.");
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong. Please retry.");
    } finally {
      setLoading(false);
    }
  }, [loading, messages, saveTicket, ticketCreated, voiceOutput]);

  const startListening = () => {
    setError("");
    const speechWindow = window as SpeechWindow;
    const SpeechRecognitionConstructor = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognitionConstructor) {
      setVoiceSupported(false);
      setError("Voice input is not supported by this browser. Use the text box instead.");
      return;
    }
    try {
      const recognition = new SpeechRecognitionConstructor();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results).map((result) => result[0]?.transcript || "").join(" ").trim();
        if (transcript) void sendMessage(transcript, true);
      };
      recognition.onerror = (event) => {
        setError(event.error === "not-allowed" ? "Microphone permission was blocked. Allow microphone access or use text mode." : "Voice input stopped. Please try again.");
        setListening(false);
      };
      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
      recognition.start();
      setListening(true);
    } catch {
      setError("The microphone could not start. Try Chrome or use text mode.");
      setListening(false);
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const resetConversation = () => {
    recognitionRef.current?.stop();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setMessages([GREETING]);
    setDraft(EMPTY);
    setTicketCreated(false);
    setEscalated(false);
    setEscalationReason("");
    setError("");
    setNotice("");
    setActiveView("intake");
  };

  const runSampleCall = () => {
    resetConversation();
    void sendMessage("Hello, my name is Ahmed Rahman. My phone number is +971 50 123 4567. I am in Dubai Marina. My AC is running but not cooling. I need a repair visit.", false, true);
  };

  const runSafetyScenario = () => {
    resetConversation();
    void sendMessage("My name is Huda Malik. My phone number is +971 55 987 1234. I am in Business Bay. There is a burning smell and smoke coming from the AC unit. I need help urgently.", false, true);
  };

  const addSampleRequest = () => {
    const ticket: Ticket = {
      ...EMPTY,
      customerName: "Sara Khan",
      phone: "+971 56 321 4455",
      area: "Dubai Hills",
      issue: "AC making a loud rattling noise",
      serviceType: "Repair",
      amcStatus: "Unknown",
      priority: "Normal",
      summary: "Fictional sample request. Customer reports a rattling noise from the AC unit.",
      id: makeId(),
      createdAt: new Date().toISOString(),
      status: "New",
      demo: true
    };
    saveTicket(ticket);
    setNotice("Fictional sample request added to this browser workspace.");
  };

  const updateStatus = (id: string, status: string) => {
    setTickets((previous) => previous.map((ticket) => ticket.id === id ? { ...ticket, status } : ticket));
  };

  const deleteTicket = (id: string) => {
    setTickets((previous) => previous.filter((ticket) => ticket.id !== id));
    if (selectedTicketId === id) setSelectedTicketId("");
    setNotice("Demo request removed from this browser.");
  };

  const resetWorkspace = () => {
    setTickets(SAMPLE_TICKETS);
    setSelectedTicketId("CC-2041");
    setNotice("The fictional sample workspace has been restored.");
  };

  const exportCsv = () => {
    const columns = ["Request ID", "Created", "Customer", "Phone", "Area", "Issue", "Service type", "AMC status", "Priority", "Status", "Summary"];
    const values = tickets.map((ticket) => [
      ticket.id, ticket.createdAt, ticket.customerName, ticket.phone, ticket.area, ticket.issue,
      ticket.serviceType, ticket.amcStatus, ticket.priority, ticket.status, ticket.summary
    ]);
    const escapeCell = (value: string) => "\"" + String(value || "").replace(/"/g, "\"\"") + "\"";
    const csv = [columns, ...values].map((row) => row.map(escapeCell).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "clickchain-demo-requests.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const copySummary = async (ticket: Ticket) => {
    const summary = [
      "ClickChain service request " + ticket.id,
      "Customer: " + ticket.customerName,
      "Phone: " + ticket.phone,
      "Area: " + ticket.area,
      "Issue: " + ticket.issue,
      "Service: " + ticket.serviceType,
      "AMC: " + ticket.amcStatus,
      "Priority: " + ticket.priority,
      "Status: " + ticket.status,
      "Summary: " + ticket.summary,
      "Demo record only — not sent to a live HVAC company."
    ].join("\n");
    try {
      await navigator.clipboard.writeText(summary);
      setNotice("Request summary copied.");
    } catch {
      setNotice("Clipboard access was blocked by the browser.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f7fc] text-[#18253b]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="Back to ClickChain overview"><Mark/></Link>
            <div><p className="text-base font-bold tracking-tight">ClickChain</p><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">HVAC service desk</p></div>
            <span className="ml-2 hidden rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 ring-1 ring-blue-100 sm:inline-flex">Interactive demo</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:inline-flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/> Sample workspace</span>
            <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"><ArrowLeft size={14}/> <span className="hidden sm:inline">Overview</span></Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[232px_minmax(0,1fr)]">
        <aside className="hidden min-h-[calc(100vh-72px)] border-r border-slate-200 bg-white px-4 py-6 lg:block">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.17em] text-slate-400">Workspace</p>
          <nav className="mt-3 space-y-1">
            <button onClick={() => setActiveView("overview")} className={"flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition " + (activeView === "overview" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50")}><LayoutDashboard size={17}/> Overview</button>
            <button onClick={() => setActiveView("intake")} className={"flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition " + (activeView === "intake" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50")}><Headset size={17}/> Live intake demo</button>
            <button onClick={() => setActiveView("requests")} className={"flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition " + (activeView === "requests" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50")}><ClipboardList size={17}/> Service requests <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">{tickets.length}</span></button>
          </nav>
          <div className="mt-9 border-t border-slate-100 pt-6">
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.17em] text-slate-400">Demo connections</p>
            <div className="mt-3 space-y-3 px-3 text-xs">
              <div className="flex items-center justify-between"><span className="text-slate-500">Assistant</span><span className="font-semibold text-blue-700">{assistantMode}</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-500">Storage</span><span className="font-semibold text-slate-700">This browser</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-500">Phone line</span><span className="font-semibold text-amber-700">Not connected</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-500">CRM / FSM</span><span className="font-semibold text-amber-700">Not connected</span></div>
            </div>
          </div>
          <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
            <div className="flex items-center gap-2 text-blue-800"><ShieldCheck size={16}/><span className="text-xs font-bold">Human control</span></div>
            <p className="mt-2 text-[11px] leading-5 text-slate-600">The AI prepares requests. Your team confirms pricing, availability and appointments.</p>
          </div>
          <div className="mt-8 flex items-center gap-2 px-3 text-[10px] text-slate-400"><span className="h-2 w-2 rounded-full bg-emerald-500"/> Demo environment active</div>
        </aside>

        <section className="min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-blue-700">DesertCool HVAC · Fictional workspace</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{activeView === "intake" ? "Live intake demo" : activeView === "requests" ? "Service requests" : "Service desk overview"}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{activeView === "intake" ? "Speak or type as a customer. Nora captures the information and prepares a structured request." : activeView === "requests" ? "Review, search, update and export sample service requests stored in this browser." : "A simple operations view of the job-intake workflow. All records shown here are fictional sample data."}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={runSampleCall} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"><Phone size={14}/> Run sample call</button>
              <button onClick={addSampleRequest} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"><Plus size={14}/> Add sample request</button>
            </div>
          </div>

          <div className="mb-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            <button onClick={() => setActiveView("overview")} className={"whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold " + (activeView === "overview" ? "bg-blue-600 text-white" : "border border-slate-200 bg-white text-slate-600")}>Overview</button>
            <button onClick={() => setActiveView("intake")} className={"whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold " + (activeView === "intake" ? "bg-blue-600 text-white" : "border border-slate-200 bg-white text-slate-600")}>Live intake</button>
            <button onClick={() => setActiveView("requests")} className={"whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold " + (activeView === "requests" ? "bg-blue-600 text-white" : "border border-slate-200 bg-white text-slate-600")}>Requests ({tickets.length})</button>
          </div>

          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <AlertTriangle size={17} className="mt-0.5 shrink-0 text-amber-700"/>
            <div className="text-xs leading-5 text-amber-900"><strong>Demo only.</strong> DesertCool HVAC and all customer records are fictional. This workspace does not receive real calls, contact staff, book technicians or connect to a live CRM. Do not enter real customer personal information.</div>
          </div>

          {notice && <div className="mb-5 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs leading-5 text-emerald-800"><CheckCircle2 size={15} className="mt-0.5 shrink-0"/><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss notice" className="ml-auto"><X size={14}/></button></div>}

          {activeView === "overview" && (
            <>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-500">Requests in workspace</span><span className="rounded-xl bg-blue-50 p-2 text-blue-700"><ClipboardList size={17}/></span></div><p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{tickets.length}</p><p className="mt-1 text-[11px] text-slate-400">Fictional and locally saved</p></div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-500">Open requests</span><span className="rounded-xl bg-sky-50 p-2 text-sky-700"><Activity size={17}/></span></div><p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{openTickets}</p><p className="mt-1 text-[11px] text-slate-400">Not marked as resolved</p></div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-500">Human reviews</span><span className="rounded-xl bg-amber-50 p-2 text-amber-700"><ShieldAlert size={17}/></span></div><p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{humanTickets}</p><p className="mt-1 text-[11px] text-slate-400">Flagged for staff review</p></div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-500">Urgent / safety</span><span className="rounded-xl bg-rose-50 p-2 text-rose-700"><AlertTriangle size={17}/></span></div><p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{urgentTickets}</p><p className="mt-1 text-[11px] text-slate-400">Priority labels in sample data</p></div>
              </div>

              <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.6fr)]">
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                    <div><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Headset size={16}/></span><h2 className="text-sm font-bold text-slate-900">Nora · Virtual service desk</h2></div><p className="mt-1 text-[11px] text-slate-500">Browser-based conversation simulator</p></div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700">Ready for demo</span>
                  </div>
                  <div className="space-y-4 p-5">
                    <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-800">Try a customer scenario</p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">“My AC is running, but it is not cooling.”</p>
                      <p className="mt-1 text-xs text-slate-500">See how the assistant gathers contact details and prepares a repair request.</p>
                      <button onClick={runSampleCall} className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"><PhoneCall size={14}/> Run normal call scenario <ArrowRight size={13}/></button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button onClick={() => setActiveView("intake")} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:border-blue-200 hover:bg-blue-50/50"><span><span className="block text-xs font-bold text-slate-800">Open live intake</span><span className="mt-1 block text-[11px] text-slate-500">Talk or type to Nora</span></span><ArrowRight size={16} className="text-blue-700"/></button>
                      <button onClick={runSafetyScenario} className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/50 px-4 py-3 text-left transition hover:bg-amber-50"><span><span className="block text-xs font-bold text-amber-900">Test safety escalation</span><span className="mt-1 block text-[11px] text-amber-800/75">Smoke / burning smell scenario</span></span><ShieldAlert size={16} className="text-amber-700"/></button>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100">
                  <div className="flex items-center justify-between"><div><p className="text-xs font-bold text-slate-900">Connection status</p><p className="mt-1 text-[11px] text-slate-500">What this preview actually uses</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">Preview</span></div>
                  <div className="mt-5 space-y-4">
                    <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Bot size={17}/></span><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-slate-800">Assistant engine</p><p className="text-[11px] text-slate-500">{assistantMode}</p></div><CheckCircle2 size={16} className="text-emerald-600"/></div>
                    <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><ClipboardList size={17}/></span><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-slate-800">Ticket storage</p><p className="text-[11px] text-slate-500">This browser only</p></div><CheckCircle2 size={16} className="text-emerald-600"/></div>
                    <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><Phone size={17}/></span><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-slate-800">UAE phone connection</p><p className="text-[11px] text-slate-500">Not connected</p></div><span className="text-[10px] font-bold text-amber-700">Pending</span></div>
                    <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><Wrench size={17}/></span><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-slate-800">CRM / dispatch software</p><p className="text-[11px] text-slate-500">Not connected</p></div><span className="text-[10px] font-bold text-amber-700">Pending</span></div>
                  </div>
                  <p className="mt-5 rounded-xl bg-slate-50 p-3 text-[11px] leading-5 text-slate-500">Browser voice input depends on Chrome permissions. The phone and CRM integrations require the customer's selected providers and credentials.</p>
                </section>
              </div>

              <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="text-sm font-bold text-slate-900">Recent service requests</h2><p className="mt-1 text-[11px] text-slate-500">Latest records in this browser demo</p></div><button onClick={() => setActiveView("requests")} className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900">View all <ArrowRight size={13}/></button></div>
                <div className="divide-y divide-slate-100">{tickets.slice(0, 4).map((ticket) => <button key={ticket.id} onClick={() => { setSelectedTicketId(ticket.id); setActiveView("requests"); }} className="flex w-full flex-col gap-2 px-5 py-4 text-left transition hover:bg-slate-50 sm:flex-row sm:items-center"><span className="w-24 shrink-0 text-xs font-bold text-blue-700">{ticket.id}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-slate-800">{ticket.customerName} · {ticket.area}</span><span className="mt-1 block truncate text-[11px] text-slate-500">{ticket.issue}</span></span><span className={"w-fit rounded-full px-2.5 py-1 text-[10px] font-bold " + priorityClasses(ticket.priority)}>{ticket.priority}</span><span className={"w-fit rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 " + statusClasses(ticket.status)}>{ticket.status}</span></button>)}</div>
              </section>
            </>
          )}

          {activeView === "intake" && (
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(310px,0.65fr)]">
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                  <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Bot size={20}/></span><div><p className="text-sm font-bold text-slate-900">Nora · Virtual service desk</p><p className="text-[11px] text-slate-500">DesertCool HVAC · Fictional business</p></div></div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/> Demo assistant</span>
                </div>
                <div ref={scrollRef} className="h-[420px] space-y-4 overflow-y-auto bg-[#fbfcff] px-4 py-5 sm:h-[470px] sm:px-6">
                  {messages.map((message, index) => <div key={index} className={"flex gap-3 " + (message.role === "user" ? "justify-end" : "justify-start")}>
                    {message.role === "model" && <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700"><Bot size={16}/></span>}
                    <div className={"max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6 " + (message.role === "user" ? "rounded-br-md bg-blue-600 text-white" : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm")}>{message.text}</div>
                    {message.role === "user" && <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500"><UserRound size={16}/></span>}
                  </div>)}
                  {loading && <div className="flex items-center gap-3 text-xs text-slate-500"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-700"><Bot size={16}/></span><LoaderCircle size={15} className="animate-spin"/> Nora is preparing a response…</div>}
                </div>
                <div className="border-t border-slate-100 p-4 sm:p-5">
                  {error && <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-5 text-rose-800">{error}</div>}
                  {escalated && <div className="mb-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900"><ShieldAlert size={16} className="mt-0.5 shrink-0 text-amber-700"/><span><strong>Human review required.</strong> {escalationReason || "This issue has been flagged as safety-sensitive."}</span></div>}
                  {ticketCreated && <div className="mb-3 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs leading-5 text-emerald-800"><CheckCircle2 size={16} className="mt-0.5 shrink-0"/><span>Request created successfully in this browser demo. Start a new conversation to run another scenario.</span></div>}
                  <div className="mb-3 flex flex-wrap gap-2">
                    <button onClick={runSampleCall} disabled={loading} className="rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-[11px] font-semibold text-blue-800 transition hover:bg-blue-100 disabled:opacity-50">Run complete repair example</button>
                    <button onClick={runSafetyScenario} disabled={loading} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-800 transition hover:bg-amber-100 disabled:opacity-50">Run safety escalation example</button>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button onClick={listening ? stopListening : startListening} disabled={loading || ticketCreated} className={"inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 " + (listening ? "bg-rose-600 text-white hover:bg-rose-700" : "bg-blue-600 text-white hover:bg-blue-700")}>{listening ? <MicOff size={16}/> : <Mic size={16}/>} {listening ? "Stop listening" : "Speak to Nora"}</button>
                    <form onSubmit={(event) => { event.preventDefault(); void sendMessage(text); }} className="flex min-w-0 flex-1 gap-2">
                      <input value={text} onChange={(event) => setText(event.target.value)} placeholder="Type a customer service request…" disabled={loading || ticketCreated} className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-400 disabled:bg-slate-50"/>
                      <button type="submit" aria-label="Send message" disabled={loading || ticketCreated || !text.trim()} className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-blue-700 disabled:opacity-40"><Send size={17}/></button>
                    </form>
                  </div>
                  {!voiceSupported && <p className="mt-2 text-[11px] text-slate-500">Voice recognition is not available in this browser. Text mode still works.</p>}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                    <button onClick={resetConversation} className="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-500 transition hover:text-slate-800"><RefreshCw size={13}/> New conversation</button>
                    <button onClick={() => setVoiceOutput(!voiceOutput)} className={"inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold " + (voiceOutput ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-500")}><Volume2 size={13}/>{voiceOutput ? "Voice replies on" : "Voice replies off"}</button>
                    <span className="text-[10px] text-slate-400">English · Browser microphone</span>
                  </div>
                </div>
              </section>

              <aside className="space-y-5">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100">
                  <div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Live extraction</p><h2 className="mt-1 text-sm font-bold text-slate-900">Service request draft</h2></div><span className="rounded-xl bg-blue-50 p-2 text-blue-700"><ClipboardList size={18}/></span></div>
                  <div className="mt-5 space-y-3">
                    {[["Customer name", draft.customerName], ["Phone number", draft.phone], ["Dubai area", draft.area], ["Reported issue", draft.issue], ["Service type", draft.serviceType], ["AMC status", draft.amcStatus], ["Priority", draft.priority]].map(([label, value]) => <div key={label} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 text-xs last:border-0 last:pb-0"><span className="text-slate-500">{label}</span><span className="max-w-[65%] text-right font-semibold text-slate-800">{value || <span className="font-normal text-slate-300">Waiting for details</span>}</span></div>)}
                  </div>
                  <div className="mt-5 rounded-xl bg-slate-50 p-3 text-[11px] leading-5 text-slate-500">The operations team must review the request and confirm technician availability, pricing and any appointment.</div>
                  {draftComplete && !ticketCreated && <button onClick={() => void sendMessage("Please confirm the service request details and prepare the job record.")} disabled={loading} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"><Check size={15}/> Confirm captured details</button>}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100">
                  <div className="flex items-center gap-2"><ShieldCheck size={17} className="text-emerald-700"/><h2 className="text-xs font-bold text-slate-900">Demo guardrails</h2></div>
                  <ul className="mt-3 space-y-2 text-[11px] leading-5 text-slate-600">
                    <li>• No diagnosis or repair instructions.</li>
                    <li>• No invented technician or arrival time.</li>
                    <li>• Safety-sensitive cases are flagged for human review.</li>
                    <li>• No real customer, phone line or dispatch connection.</li>
                  </ul>
                </section>
              </aside>
            </div>
          )}

          {activeView === "requests" && (
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.55fr)]">
              <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100">
                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
                  <div><h2 className="text-sm font-bold text-slate-900">All service requests</h2><p className="mt-1 text-[11px] text-slate-500">{tickets.length} records · saved in this browser only</p></div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-[11px] font-bold text-slate-700 transition hover:bg-slate-50"><ArrowDownToLine size={13}/> Export CSV</button>
                    <button onClick={resetWorkspace} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-[11px] font-bold text-slate-700 transition hover:bg-slate-50"><RefreshCw size={13}/> Reset samples</button>
                  </div>
                </div>
                <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row">
                  <div className="relative min-w-0 flex-1"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search customer, request ID, area or issue…" className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none placeholder:text-slate-400 focus:border-blue-400"/></div>
                  <div className="relative"><select value={filter} onChange={(event) => setFilter(event.target.value)} className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 text-xs font-semibold text-slate-700 outline-none focus:border-blue-400 sm:w-44"><option>All requests</option><option>Open</option><option>Needs human review</option><option>Urgent</option><option>Resolved</option></select><ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"/></div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left">
                    <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400"><tr><th className="px-5 py-3">Request</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Area / issue</th><th className="px-4 py-3">Priority</th><th className="px-4 py-3">Status</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">{filteredTickets.map((ticket) => <tr key={ticket.id} onClick={() => setSelectedTicketId(ticket.id)} className={"cursor-pointer transition hover:bg-blue-50/60 " + (selectedTicketId === ticket.id ? "bg-blue-50/50" : "")}>
                      <td className="px-5 py-4"><p className="text-xs font-bold text-blue-700">{ticket.id}</p><p className="mt-1 text-[10px] text-slate-400">{ticket.createdAt.slice(0, 16).replace("T", " ")}</p></td>
                      <td className="px-4 py-4"><p className="text-xs font-semibold text-slate-800">{ticket.customerName}</p><p className="mt-1 text-[10px] text-slate-500">{ticket.phone}</p></td>
                      <td className="px-4 py-4"><p className="text-xs font-semibold text-slate-700">{ticket.area}</p><p className="mt-1 max-w-[210px] truncate text-[10px] text-slate-500">{ticket.issue}</p></td>
                      <td className="px-4 py-4"><span className={"rounded-full px-2.5 py-1 text-[10px] font-bold " + priorityClasses(ticket.priority)}>{ticket.priority}</span></td>
                      <td className="px-4 py-4"><span className={"rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 " + statusClasses(ticket.status)}>{ticket.status}</span></td>
                    </tr>)}</tbody>
                  </table>
                  {filteredTickets.length === 0 && <div className="px-5 py-12 text-center"><ClipboardList size={22} className="mx-auto text-slate-300"/><p className="mt-3 text-xs font-semibold text-slate-600">No matching requests</p><p className="mt-1 text-[11px] text-slate-400">Try another search or filter.</p></div>}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-5 py-3 text-[10px] text-slate-400"><span>Sample data · local browser storage</span><span>Click a row to inspect its details</span></div>
              </section>

              <aside className="space-y-5">
                {selectedTicket ? (
                  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100">
                    <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-700">Request detail</p><h2 className="mt-1 text-lg font-bold text-slate-900">{selectedTicket.id}</h2></div><button onClick={() => setSelectedTicketId("")} aria-label="Close request details" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={15}/></button></div>
                    <span className={"mt-3 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 " + statusClasses(selectedTicket.status)}>{selectedTicket.status}</span>
                    <div className="mt-5 space-y-4">
                      <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Customer</p><p className="mt-1 text-sm font-semibold text-slate-800">{selectedTicket.customerName}</p><p className="mt-1 text-xs text-slate-500">{selectedTicket.phone}</p></div>
                      <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Location</p><p className="mt-1 flex items-center gap-2 text-xs font-semibold text-slate-700"><MapPin size={13} className="text-slate-400"/>{selectedTicket.area}</p></div>
                      <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reported issue</p><p className="mt-1 text-xs leading-5 text-slate-700">{selectedTicket.issue}</p></div>
                      <div className="grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">Service type</p><p className="mt-1 text-xs font-semibold text-slate-800">{selectedTicket.serviceType}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">AMC status</p><p className="mt-1 text-xs font-semibold text-slate-800">{selectedTicket.amcStatus}</p></div></div>
                      <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Priority</p><span className={"mt-1 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold " + priorityClasses(selectedTicket.priority)}>{selectedTicket.priority}</span></div>
                      <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Intake summary</p><p className="mt-1 text-xs leading-5 text-slate-600">{selectedTicket.summary || "No additional summary."}</p></div>
                    </div>
                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Update request status</label>
                      <select value={selectedTicket.status} onChange={(event) => updateStatus(selectedTicket.id, event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-blue-400"><option>New</option><option>In review</option><option>Needs human review</option><option>Resolved</option></select>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2"><button onClick={() => void copySummary(selectedTicket)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50"><MessageSquare size={13}/> Copy summary</button><button onClick={() => deleteTicket(selectedTicket.id)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 px-3 py-2.5 text-[11px] font-bold text-rose-700 hover:bg-rose-50"><Trash2 size={13}/> Delete</button></div>
                    <p className="mt-4 text-[10px] leading-4 text-slate-400">Status changes affect this browser's demo copy only. No technician or customer is notified.</p>
                  </section>
                ) : (
                  <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"><ClipboardList size={24} className="mx-auto text-slate-300"/><p className="mt-3 text-xs font-bold text-slate-700">Select a request</p><p className="mt-1 text-[11px] text-slate-500">Choose a row to view the job details.</p></section>
                )}
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100">
                  <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-700"/><h3 className="text-xs font-bold text-slate-900">Record handling</h3></div>
                  <p className="mt-2 text-[11px] leading-5 text-slate-500">Export records before clearing browser data. This demonstration has no shared database, authentication or company-wide access control.</p>
                </section>
              </aside>
            </div>
          )}

          <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 py-5 text-[10px] text-slate-400"><span>ClickChain · HVAC job intake prototype</span><span>Fictional sample data · Browser-local storage · No live telephony</span></footer>
        </section>
      </div>
    </main>
  );
}
