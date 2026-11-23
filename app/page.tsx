import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, CheckCircle2, ClipboardList,
  Link2, PhoneCall, ShieldCheck, Workflow
} from "lucide-react";

const steps = [
  { n: "01", title: "Answer the enquiry", body: "Give customers a consistent first response when your coordinators are busy or the office is closed." },
  { n: "02", title: "Capture job details", body: "Collect the caller's name, contact number, Dubai area, service issue and request type." },
  { n: "03", title: "Prepare the request", body: "Turn the conversation into a structured service record your operations team can review." },
  { n: "04", title: "Escalate when needed", body: "Flag safety-sensitive or unclear cases for a human instead of letting automation guess." },
];

const capabilities = [
  { icon: PhoneCall, title: "Inbound enquiry handling", body: "A first point of contact for after-hours and overflow enquiries. Start with a browser-based demo, then connect an approved phone channel." },
  { icon: ClipboardList, title: "Structured job intake", body: "Capture the details dispatchers need in one consistent request instead of piecing them together from messages." },
  { icon: Workflow, title: "Operations-ready handoff", body: "Give the coordinator a readable summary, request type and priority for review." },
  { icon: ShieldCheck, title: "Human-in-the-loop safety", body: "Flag smoke, burning smells, sparks and other safety concerns. The AI never confirms a technician or promises a visit time." },
];

function Mark({ small = false }: { small?: boolean }) {
  return <span className={"inline-flex shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200 " + (small ? "h-9 w-9" : "h-11 w-11")}><Link2 size={small ? 18 : 22} strokeWidth={2.4}/></span>;
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f9fd] text-[#17243b]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3"><Mark/><span className="text-xl font-bold tracking-tight">ClickChain</span></Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#workflow" className="transition hover:text-blue-700">Workflow</a>
          <a href="#capabilities" className="transition hover:text-blue-700">Capabilities</a>
          <a href="#control" className="transition hover:text-blue-700">Human control</a>
        </nav>
        <Link href="/demo" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 transition hover:bg-blue-50">Open workspace <ArrowUpRight size={16}/></Link>
      </header>

      <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:pb-28 lg:pt-20">
        <div className="pointer-events-none absolute -left-40 top-8 h-96 w-96 rounded-full bg-blue-200/45 blur-3xl"/>
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.17em] text-blue-700"><span className="h-2 w-2 rounded-full bg-emerald-500"/> AI job intake for HVAC operators</div>
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-6xl">Turn every service enquiry into a <span className="text-blue-600">clear next step.</span></h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">ClickChain helps HVAC teams capture customer requests, organise the details and put urgent cases in front of a human. Less information lost between the first call and the operations desk.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/demo" className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700">Try the interactive demo <ArrowRight size={17}/></Link>
            <a href="#workflow" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50">Explore the workflow</a>
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-600"/> Human review for sensitive cases</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-600"/> No invented booking promises</span>
          </div>
        </div>

        <div className="relative z-10">
          <div className="absolute -inset-5 rounded-[2rem] bg-blue-100/80 blur-2xl"/>
          <div className="relative overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-[0_28px_80px_-38px_rgba(30,64,125,0.32)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-3"><Mark small/><div><p className="text-sm font-bold">Service request preview</p><p className="text-xs text-slate-500">Illustrative workflow</p></div></div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">Sample</span>
            </div>
            <div className="space-y-4 bg-[#fbfcff] p-5 sm:p-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between"><span className="text-[10px] font-bold tracking-[0.14em] text-slate-400">INCOMING ENQUIRY</span><span className="text-[10px] font-semibold text-slate-400">Example caller</span></div>
                <div className="mt-3 flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><PhoneCall size={18}/></span><div><p className="text-sm font-semibold leading-6 text-slate-800">“My AC is running, but it is not cooling.”</p><p className="mt-1 text-xs text-slate-500">Customer enquiry · Dubai Marina</p></div></div>
              </div>
              <div className="flex items-center gap-3 px-1 text-[10px] font-bold tracking-[0.13em] text-slate-400"><span className="h-px flex-1 bg-slate-200"/>DETAILS CAPTURED<span className="h-px flex-1 bg-slate-200"/></div>
              <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                <div className="flex items-center justify-between"><span className="text-[10px] font-bold tracking-[0.14em] text-blue-800">JOB INTAKE RECORD</span><span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-blue-700">Awaiting review</span></div>
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                  <div><p className="text-[11px] text-slate-500">Issue</p><p className="mt-1 font-semibold text-slate-800">AC not cooling</p></div>
                  <div><p className="text-[11px] text-slate-500">Area</p><p className="mt-1 font-semibold text-slate-800">Dubai Marina</p></div>
                  <div><p className="text-[11px] text-slate-500">Request type</p><p className="mt-1 font-semibold text-slate-800">Repair</p></div>
                  <div><p className="text-[11px] text-slate-500">Next step</p><p className="mt-1 font-semibold text-emerald-700">Operations review</p></div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-emerald-700"/><p className="text-xs leading-5 text-slate-600">A coordinator confirms availability and pricing. The demo does not book a technician or promise a visit time.</p></div>
            </div>
            <div className="border-t border-slate-100 px-5 py-3 text-[10px] text-slate-400">Fictional company and sample details. No live customer data.</div>
          </div>
        </div>
      </section>

      <section id="workflow" className="border-y border-slate-200 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.19em] text-blue-700">The workflow</p><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">From first hello to an operations-ready request.</h2><p className="mt-4 leading-7 text-slate-600">The job intake agent is designed around one measurable outcome: a complete, reviewable service request.</p></div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{steps.map((step) => <div key={step.n} className="rounded-2xl border border-slate-200 bg-[#fbfcff] p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60"><p className="text-sm font-bold tracking-widest text-blue-600">{step.n}</p><h3 className="mt-5 text-lg font-bold text-slate-800">{step.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{step.body}</p></div>)}</div>
        </div>
      </section>

      <section id="capabilities" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.19em] text-blue-700">Purpose-built capabilities</p><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Useful automation, without losing human control.</h2></div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">{capabilities.map((feature) => { const Icon = feature.icon; return <div key={feature.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-100"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Icon size={21}/></span><div><h3 className="font-bold text-slate-800">{feature.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{feature.body}</p></div></div>; })}</div>
      </section>

      <section id="control" className="border-y border-slate-200 bg-[#eef4ff] py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-9 px-5 sm:px-8 lg:grid-cols-[1fr_auto]">
          <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.19em] text-blue-700">Designed for operators</p><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">The AI prepares the job. Your team stays in charge.</h2><p className="mt-4 leading-7 text-slate-600">Pricing, technician availability, dispatch and final appointments remain under your team&apos;s control. Start with intake; connect a phone number, CRM or field-service platform only after the workflow is agreed and tested.</p></div>
          <Link href="/demo" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700">Open the demo workspace <ArrowRight size={16}/></Link>
        </div>
      </section>

      <footer className="bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-3"><Mark small/><div><p className="font-bold text-slate-800">ClickChain</p><p className="text-xs text-slate-500">AI job intake for HVAC operations</p></div></div><p className="text-xs text-slate-400">Interactive prototype · Sample data only · © 2026 ClickChain</p><Link href="/demo" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-900">Open workspace <ArrowUpRight size={15}/></Link></div></footer>
    </main>
  );
}
