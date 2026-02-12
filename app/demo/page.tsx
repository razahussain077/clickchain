'use client';

import React from 'react';
import {
  Phone,
  MapPin,
  Clock,
  Star,
  Shield,
  Smile,
  Stethoscope,
  Baby,
  AlertTriangle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import ChatBot from '@/components/ChatBot';

const services = [
  {
    icon: Stethoscope,
    title: 'General Dentistry',
    desc: 'Comprehensive exams, cleanings, fillings, and preventive care for the whole family.',
  },
  {
    icon: Sparkles,
    title: 'Cosmetic Dentistry',
    desc: 'Teeth whitening, veneers, and smile makeovers to give you the confidence you deserve.',
  },
  {
    icon: Shield,
    title: 'Orthodontics',
    desc: 'Invisalign clear aligners and traditional braces for a perfectly aligned smile.',
  },
  {
    icon: AlertTriangle,
    title: 'Emergency Care',
    desc: 'Same-day emergency appointments for pain, trauma, and urgent dental needs.',
  },
  {
    icon: Baby,
    title: 'Pediatric Dentistry',
    desc: 'Gentle, kid-friendly dental care in a fun and comfortable environment.',
  },
  {
    icon: Smile,
    title: 'Dental Implants',
    desc: 'Permanent tooth replacement solutions that look and feel like natural teeth.',
  },
];

const reviews = [
  { name: 'Sarah M.', text: 'Best dental experience ever! The staff is so friendly and professional.', stars: 5 },
  { name: 'James K.', text: 'Got my Invisalign here and my smile has never looked better. Highly recommend!', stars: 5 },
  { name: 'Maria L.', text: 'They squeezed me in same-day for an emergency. Truly grateful for this team.', stars: 5 },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🦷</span>
              <span className="text-xl sm:text-2xl font-bold text-[#1E40AF]">
                Bright Smile Dental
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-slate-600 hover:text-[#2563EB] transition text-sm font-medium">
                Services
              </a>
              <a href="#reviews" className="text-slate-600 hover:text-[#2563EB] transition text-sm font-medium">
                Reviews
              </a>
              <a href="#contact" className="text-slate-600 hover:text-[#2563EB] transition text-sm font-medium">
                Contact
              </a>
              <button className="bg-[#2563EB] hover:bg-[#1E40AF] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition">
                Book Appointment
              </button>
            </div>
            <button className="md:hidden bg-[#2563EB] hover:bg-[#1E40AF] text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
              Book Now
            </button>
          </div>
        </div>
      </nav>

      {/* TOP BAR */}
      <div className="bg-[#2563EB] text-white text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap justify-center sm:justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone size={13} /> (512) 555-0199</span>
            <span className="hidden sm:flex items-center gap-1"><MapPin size={13} /> 4821 Congress Ave, Austin TX</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={13} />
            <span>Mon-Fri 8AM-6PM &bull; Sat 9AM-2PM</span>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#2563EB] rounded-full opacity-5" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#2563EB] rounded-full opacity-5" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#2563EB]/10 text-[#2563EB] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <Star size={14} fill="currentColor" />
              Rated #1 Dental Clinic in Austin
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Your Smile Deserves{' '}
              <span className="text-[#2563EB]">the Best Care</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl">
              Award-winning dental care in the heart of Austin. From routine cleanings to complete smile makeovers — we treat every patient like family.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-[#2563EB] hover:bg-[#1E40AF] text-white font-semibold px-8 py-4 rounded-xl transition transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25">
                Book Your Free Exam <ArrowRight size={18} />
              </button>
              <button className="border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/5 font-semibold px-8 py-4 rounded-xl transition">
                Call (512) 555-0199
              </button>
            </div>
            <div className="flex items-center gap-6 mt-10 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Shield size={16} className="text-[#2563EB]" /> Insurance Accepted
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={16} className="text-[#2563EB]" /> Same-Day Appointments
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#2563EB]">15+</div>
              <div className="text-sm text-slate-500 mt-1">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#2563EB]">10,000+</div>
              <div className="text-sm text-slate-500 mt-1">Happy Patients</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#2563EB]">4.9 ★</div>
              <div className="text-sm text-slate-500 mt-1">Google Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#2563EB]">6</div>
              <div className="text-sm text-slate-500 mt-1">Specialist Doctors</div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Our Services</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Comprehensive dental care under one roof — from preventive checkups to advanced cosmetic procedures.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, idx) => (
              <div
                key={idx}
                className="group bg-white border border-slate-200 hover:border-[#2563EB]/30 rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-blue-500/5"
              >
                <div className="w-12 h-12 bg-[#2563EB]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#2563EB] transition-colors">
                  <svc.icon size={22} className="text-[#2563EB] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{svc.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI ASSISTANT BANNER */}
      <section className="bg-gradient-to-r from-[#1E40AF] to-[#2563EB] py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Available Right Now
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Our AI Assistant Is Available 24/7
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Have a question about our services, insurance, or want to book an appointment? Our AI-powered assistant can help you instantly — no wait times, no hold music.
          </p>
          <p className="text-blue-200 text-sm">
            Powered by{' '}
            <a
              href="https://clickchain.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-semibold underline underline-offset-2 hover:text-blue-100 transition"
            >
              ClickChain AI
            </a>
          </p>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">What Our Patients Say</h2>
            <p className="text-slate-500">Don&apos;t just take our word for it — hear from real patients.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: review.stars }).map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
                <p className="font-semibold text-sm text-slate-900">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW PATIENT OFFER */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-[#2563EB]/20 rounded-2xl p-8 sm:p-12 text-center">
            <div className="text-sm font-semibold text-[#2563EB] mb-2">NEW PATIENT SPECIAL</div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Free Exam + X-Rays for New Patients
            </h3>
            <p className="text-slate-500 mb-6 max-w-xl mx-auto">
              Start your journey to a healthier smile. Book your first visit today and receive a complimentary comprehensive exam and digital X-rays.
            </p>
            <button className="bg-[#2563EB] hover:bg-[#1E40AF] text-white font-semibold px-8 py-3 rounded-xl transition transform hover:scale-105 shadow-lg shadow-blue-500/25">
              Claim Your Free Exam
            </button>
          </div>
        </div>
      </section>

      {/* CONTACT / MAP SECTION */}
      <section id="contact" className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Visit Our Office</h2>
              <div className="space-y-4 text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-[#2563EB] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Address</p>
                    <p>4821 Congress Ave, Austin, TX 78745</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={20} className="text-[#2563EB] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Phone</p>
                    <p>(512) 555-0199</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-[#2563EB] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Hours</p>
                    <p>Mon - Fri: 8:00 AM - 6:00 PM</p>
                    <p>Saturday: 9:00 AM - 2:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#2563EB] transition"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#2563EB] transition"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#2563EB] transition"
                />
                <textarea
                  placeholder="How can we help?"
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#2563EB] transition resize-none"
                />
                <button className="w-full bg-[#2563EB] hover:bg-[#1E40AF] text-white font-semibold py-3 rounded-lg transition">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span>🦷</span>
            <span>&copy; 2026 Bright Smile Dental. All rights reserved.</span>
          </div>
          <div>
            AI Chatbot by{' '}
            <a
              href="https://clickchain.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2563EB] hover:text-blue-400 font-semibold transition"
            >
              ClickChain
            </a>
          </div>
        </div>
      </footer>

      {/* CHATBOT WIDGET */}
      <ChatBot />
    </div>
  );
}
