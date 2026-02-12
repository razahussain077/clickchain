'use client';

import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function Home() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      q: 'Is this just a chatbot?',
      a: "No. Chatbots answer questions. ClickChain qualifies patients, scores them, and books appointments. It's a revenue engine, not a help desk.",
    },
    {
      q: 'What if the AI says something wrong?',
      a: 'We train the AI specifically on your practice. It has guardrails, human handoff triggers, and you can review every conversation.',
    },
    {
      q: 'How long does setup take?',
      a: '48 hours. We handle everything. You just provide your practice information.',
    },
    {
      q: 'Do I need to be technical?',
      a: 'Not at all. We install everything for you. You just log in to see your leads and bookings.',
    },
    {
      q: "What if it doesn't work?",
      a: "That's why we offer a 14-day free pilot. If you're not impressed, we remove it. No questions asked.",
    },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$2,000',
      period: '/mo',
      features: ['AI Chat Widget', 'Lead Qualification', 'Calendar Booking', 'Email Support'],
      highlighted: false,
    },
    {
      name: 'Growth',
      price: '$3,500',
      period: '/mo',
      features: [
        'Everything in Starter',
        'WhatsApp Integration',
        'Nurture Sequences',
        'Priority Support',
        'Analytics Dashboard',
      ],
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: '$7,500',
      period: '/mo',
      features: [
        'Everything in Growth',
        'Multi-Channel (Voice + SMS)',
        'Custom Integrations',
        'Dedicated Account Manager',
      ],
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white scroll-smooth">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              ClickChain
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition">
                How It Works
              </a>
              <a href="#results" className="text-gray-300 hover:text-white transition">
                Results
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition">
                Pricing
              </a>
            </div>
            <a href="#pricing" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition">
              Book Demo
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Your Dental Practice Is Losing{' '}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              $30,000/Year
            </span>{' '}
            In Missed Patient Inquiries
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Our AI responds to every patient inquiry in under 5 seconds, qualifies them, and books them on your calendar. 24/7. No staff needed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a href="https://cal.com/clickchain" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold transition transform hover:scale-105">
              Book Free Demo
            </a>
            <button className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400/10 px-8 py-4 rounded-lg font-bold transition">
              Watch Demo
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-blue-900/30">
            <div className="pt-8">
              <div className="text-2xl sm:text-3xl font-bold text-blue-400">5 sec</div>
              <div className="text-sm text-gray-400">response time</div>
            </div>
            <div className="pt-8">
              <div className="text-2xl sm:text-3xl font-bold text-blue-400">30-50%</div>
              <div className="text-sm text-gray-400">more bookings</div>
            </div>
            <div className="pt-8">
              <div className="text-2xl sm:text-3xl font-bold text-blue-400">24/7</div>
              <div className="text-sm text-gray-400">coverage</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            Here&apos;s What&apos;s Happening Right Now
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-red-900/20 to-red-900/10 border border-red-500/30 rounded-xl p-8 hover:border-red-500/50 transition">
              <div className="text-4xl font-bold text-red-400 mb-4">4.7H</div>
              <h3 className="text-xl font-semibold mb-3">Average Response Time</h3>
              <p className="text-gray-300">By then, your patient already called a competitor</p>
            </div>

            <div className="bg-gradient-to-br from-orange-900/20 to-orange-900/10 border border-orange-500/30 rounded-xl p-8 hover:border-orange-500/50 transition">
              <div className="text-4xl font-bold text-orange-400 mb-4">40-60%</div>
              <h3 className="text-xl font-semibold mb-3">Inquiries Go Unanswered</h3>
              <p className="text-gray-300">Your receptionist can&apos;t work 24/7</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-900/10 border border-yellow-500/30 rounded-xl p-8 hover:border-yellow-500/50 transition">
              <div className="text-4xl font-bold text-yellow-400 mb-4">$2-5K</div>
              <h3 className="text-xl font-semibold mb-3">Lost Per Missed Patient</h3>
              <p className="text-gray-300">That adds up to $30,000-$50,000/year</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">How ClickChain Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'We Install', desc: 'Add one line of code to your website. Takes 48 hours.' },
              { step: 2, title: 'AI Engages', desc: 'Patient visits your site, AI greets them in 5 seconds' },
              { step: 3, title: 'AI Qualifies', desc: 'Asks about insurance, treatment needed, preferred timing' },
              { step: 4, title: 'AI Books', desc: 'Books the appointment directly on your calendar' },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-gradient-to-br from-blue-900/30 to-blue-900/10 border border-blue-500/30 rounded-xl p-8">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-300">{item.desc}</p>
                </div>
                {item.step < 4 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-600 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS SECTION */}
      <section id="results" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">What Our Clients See</h2>

          <div className="bg-gradient-to-br from-green-900/30 to-green-900/10 border border-green-500/30 rounded-2xl p-8 sm:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-gray-400 mb-2">Before ClickChain</p>
                <p className="text-3xl sm:text-4xl font-bold">18 bookings</p>
                <p className="text-gray-400">per month</p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">After ClickChain</p>
                <p className="text-3xl sm:text-4xl font-bold text-green-400">47 bookings</p>
                <p className="text-gray-400">per month</p>
              </div>
            </div>

            <div className="border-t border-green-500/30 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-400 mb-2">Response time</p>
                <p className="text-lg">
                  <span className="line-through text-gray-500">4.7 hours</span>{' '}
                  <span className="text-green-400 font-bold">&rarr; 4.8 seconds</span>
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Revenue increase</p>
                <p className="text-2xl font-bold text-green-400">$34,200/month</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">Simple Pricing. Massive ROI.</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-8 transition transform hover:scale-105 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-blue-600 to-blue-800 border-2 border-blue-400 ring-2 ring-blue-400/50 relative'
                    : 'bg-gradient-to-br from-blue-900/30 to-blue-900/10 border border-blue-500/30'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-400 text-slate-950 px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-300">{plan.period}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-3">
                      <Check size={20} className="text-blue-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-bold transition ${
                    plan.highlighted
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-400">
            All plans include a 14-day free pilot. No credit card required.
          </p>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">Common Questions</h2>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-blue-900/20 border border-blue-500/30 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 py-4 flex justify-between items-center hover:bg-blue-900/30 transition"
                >
                  <span className="font-semibold text-left">{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={`text-blue-400 flex-shrink-0 transition-transform ${openFAQ === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFAQ === idx && (
                  <div className="px-6 py-4 bg-blue-900/10 border-t border-blue-500/30 text-gray-300">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready To Stop Losing Patients?</h2>
          <p className="text-lg text-gray-300 mb-12">
            We only onboard 5 new clinics per month to ensure quality.
          </p>
          <a
            href="https://cal.com/clickchain"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105"
          >
            Book Your Free Demo
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-blue-900/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                ClickChain
              </div>
              <p className="text-gray-400 mt-2">&copy; 2026 ClickChain. All rights reserved.</p>
            </div>
            <div>
              <a href="mailto:hello@clickchain.tech" className="text-blue-400 hover:text-blue-300 transition">
                hello@clickchain.tech
              </a>
            </div>
            <div className="flex gap-6 justify-start md:justify-end">
              <a href="#" className="text-gray-400 hover:text-white transition">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
