import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, Clock3, Headset, Link2, PhoneCall, ShieldCheck, Workflow, Wrench } from "lucide-react";

const steps = [
  { n: "01", title: "Answer the call", body: "A customer calls about an AC issue. The service desk answers and starts a natural conversation." },
  { n: "02", title: "Capture the request", body: "Collect contact details, location, the reported issue and the type of service needed." },
  { n: "03", title: "Create the job", body: "Turn the conversation into a structured request for the operations team to review." },
  { n: "04", title: "Bring in a human", body: "Escalate urgent, unclear or sensitive situations to a member of staff." },
];

const features = [
  { icon: PhoneCall, title: "Inbound call handling", body: "A consistent first response for routine enquiries, including after-hours and overflow scenarios." },
  { icon: Workflow, title: "Structured job intake", body: "Capture the information dispatchers need instead of reconstructing details from scattered messages." },
  { icon: Clock3, title: "Appointment coordination", body: "Prepare complete requests for the operations team and connect to approved availability rules when integrated." },
  { icon: ShieldCheck, title: "Human escalation", body: "Keep people in control of urgent cases, uncertain answers, pricing and final booking decisions." },
];

function BrandMark({ small = false }: { small?: boolean }) {
  return <span className={"inline-flex items-center justify-center rounded-xl bg-blue-600 text-white " + (small ? "h-9 w-9" : "h-11 w-11")}><Link2 size={small ? 19 : 23} strokeWidth={2.4}/></span>;
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#071426] text-[#F8FAFC]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3"><BrandMark/><span className="text-xl font-semibold tracking-tight">ClickChain</span></Link>
        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#how-it-works" className="transition hover:text-white">How it works</a>
          <a href="#capabilities" className="transition hover:text-white">Capabilities</a>
          <a href="#who-its-for" className="transition hover:text-white">Who it is for</a>
        </nav>
        <Link href="/demo" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#071426] transition hover:bg-blue-50">Try the demo <ArrowUpRight size={16}/></Link>
      </header>

      <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-[1.03fr_0.97fr] lg:gap-16 lg:pb-32 lg:pt-24">
        <div className="pointer-events-none absolute -left-48 top-16 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl"/>
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200"><span className="h-1.5 w-1.5 rounded-full bg-teal-400"/> AI service desk · HVAC & field service</div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-6xl">Every service call should become a <span className="text-blue-300">clear next step.</span></h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">ClickChain helps HVAC and field-service teams capture customer enquiries, organise service requests and bring the right person into the conversation.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/demo" className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500">Experience the demo <ArrowRight size={17}/></Link>
            <a href="#how-it-works" className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5">See how it works</a>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-2"><CheckCircle2 size={15} className="text-teal-400"/> Human handoff built in</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 size={15} className="text-teal-400"/> Designed around existing workflows</span>
          </div>
        </div>

        <div className="relative z-10">
          <div className="absolute -inset-6 rounded-[2rem] bg-blue-500/10 blur-2xl"/>
          <div className="relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0C1D32] shadow-2xl shadow-black/30">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3"><BrandMark small/><div><p className="text-sm font-semibold">Service desk preview</p><p className="text-xs text-slate-400">Illustrative workflow · Demo environment</p></div></div>
              <span className="rounded-full border border-teal-300/20 bg-teal-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-teal-200">Demo</span>
            </div>
            <div className="space-y-4 p-5 sm:p-6">
              <div className="rounded-2xl border border-white/10 bg-[#10243C] p-4">
                <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-400">INCOMING ENQUIRY</span><span className="text-xs text-slate-500">Example</span></div>
                <div className="mt-3 flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-blue-200"><PhoneCall size={17}/></span><div><p className="text-sm font-medium text-white">“My AC is running, but it is not cooling.”</p><p className="mt-1 text-xs text-slate-400">Customer enquiry · Dubai Marina</p></div></div>
              </div>
              <div className="flex items-center gap-3 px-1 text-xs text-slate-400"><span className="h-px flex-1 bg-white/10"/>AI CAPTURES THE DETAILS<span className="h-px flex-1 bg-white/10"/></div>
              <div className="rounded-2xl border border-blue-300/20 bg-blue-400/[0.07] p-4">
                <div className="flex items-center justify-between"><span className="text-xs font-semibold text-blue-200">SERVICE REQUEST</span><span className="rounded-full bg-blue-300/10 px-2 py-1 text-[10px] text-blue-100">Example</span></div>
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div><p className="text-[11px] text-slate-500">Issue</p><p className="mt-1 text-slate-100">AC not cooling</p></div>
                  <div><p className="text-[11px] text-slate-500">Area</p><p className="mt-1 text-slate-100">Dubai Marina</p></div>
                  <div><p className="text-[11px] text-slate-500">Request type</p><p className="mt-1 text-slate-100">Repair</p></div>
                  <div><p className="text-[11px] text-slate-500">Next step</p><p className="mt-1 text-teal-200">Team review</p></div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-teal-300/15 bg-teal-300/[0.06] px-4 py-3"><ShieldCheck size={18} className="shrink-0 text-teal-300"/><p className="text-xs leading-5 text-slate-300">The operations team reviews the request and confirms the next step. The AI does not promise technician availability.</p></div>
            </div>
            <div className="border-t border-white/10 px-5 py-3 text-[11px] text-slate-500">Illustrative sample data. Not a real customer or service request.</div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0A192B] py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">The operational gap</p><h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">A call is only the beginning of a service job.</h2><p className="mt-4 leading-7 text-slate-400">Customer conversations often need to become accurate records, clear handoffs and follow-through. ClickChain is designed to connect those steps.</p></div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6"><PhoneCall className="text-blue-300" size={22}/><h3 className="mt-5 text-lg font-semibold">Calls and enquiries</h3><p className="mt-2 text-sm leading-6 text-slate-400">Give customers a consistent first point of contact when staff are busy or the office is closed.</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6"><Wrench className="text-blue-300" size={22}/><h3 className="mt-5 text-lg font-semibold">Incomplete job details</h3><p className="mt-2 text-sm leading-6 text-slate-400">Capture the information dispatchers need before a request reaches the operations queue.</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6"><Headset className="text-blue-300" size={22}/><h3 className="mt-5 text-lg font-semibold">Manual handoffs</h3><p className="mt-2 text-sm leading-6 text-slate-400">Keep the customer conversation connected to the staff member responsible for the next action.</p></div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">How it works</p><h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">From first hello to a structured service request.</h2></div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{steps.map((step) => <div key={step.n} className="rounded-2xl border border-white/10 bg-[#0C1D32] p-6"><p className="text-sm font-semibold tracking-widest text-blue-300">{step.n}</p><h3 className="mt-6 text-lg font-semibold">{step.title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{step.body}</p></div>)}</div>
      </section>

      <section id="capabilities" className="border-y border-white/10 bg-[#0A192B] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">What the service desk can do</p><h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Useful automation. Clear human control.</h2></div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">{features.map((feature) => { const Icon = feature.icon; return <div key={feature.title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-6"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-200"><Icon size={21}/></span><div><h3 className="font-semibold">{feature.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{feature.body}</p></div></div>; })}</div>
        </div>
      </section>

      <section id="who-its-for" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <div className="grid items-center gap-10 rounded-[1.75rem] border border-blue-300/15 bg-gradient-to-br from-blue-500/10 to-teal-400/[0.04] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:p-12">
          <div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Built for service operations</p><h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">For HVAC and field-service teams that manage real-world jobs.</h2><p className="mt-4 leading-7 text-slate-300">Start with inbound call handling and structured job intake. Connect scheduling, customer updates and existing service software as the workflow is validated.</p></div>
          <Link href="/demo" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#071426] transition hover:bg-blue-50">Try the interactive demo <ArrowRight size={16}/></Link>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#06101E]"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-3"><BrandMark small/><div><p className="font-semibold">ClickChain</p><p className="text-xs text-slate-500">AI service desk for HVAC & field service</p></div></div><p className="text-xs text-slate-500">© 2026 ClickChain. Interactive prototype — sample data only.</p><Link href="/demo" className="inline-flex items-center gap-2 text-sm font-medium text-blue-200 transition hover:text-white">Open demo <ArrowUpRight size={15}/></Link></div></footer>
    </main>
  );
}
