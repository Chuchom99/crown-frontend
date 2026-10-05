import React from "react"
import { Link } from "react-router-dom"
import { ShieldCheck, Wrench, Truck, Sun, BatteryCharging } from "lucide-react"
import { SectionTitle, Pill } from "../components/UI"

const highlights = [
  { icon: ShieldCheck, title: "Genuine products", desc: "Verified solar components with clear specs and warranty support." },
  { icon: Wrench, title: "Expert sizing", desc: "We help you choose the right inverter, battery capacity, and panel count." },
  { icon: Truck, title: "Fast delivery", desc: "Well-packaged items and quick delivery across our coverage areas." },
  { icon: BatteryCharging, title: "Smart bundles", desc: "Home and business bundles designed for common power needs in Nigeria." },
]

export default function About() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(249,115,22,0.12),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(249,115,22,0.08),transparent_40%)]" />
        <div className="container relative py-14 sm:py-18">
          <Pill>About • Crown Solar</Pill>
          <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight">
            Reliable solar solutions for <span className="gradient-text">homes & businesses</span> in Nigeria.
          </h1>
          <p className="mt-4 text-slate-600 text-lg max-w-2xl">
            Crown Solar is a modern solar equipment store built to make it easy to find the right solar components — panels,
            inverters, batteries, and accessories — with clear specs, fair pricing, and dependable support.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Link
              to="/products"
              className="rounded-2xl bg-brand-orange text-white px-6 py-3 font-medium hover:bg-brand-orangeDark transition shadow-soft text-center"
            >
              Browse products
            </Link>
            <Link
              to="/quote"
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-medium hover:bg-slate-50 transition text-center"
            >
              Get a quote
            </Link>
          </div>

          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-brand-orange/10 text-brand-orange grid place-items-center">
                  <Sun size={18} />
                </div>
                <div>
                  <div className="font-semibold">Local-first</div>
                  <div className="text-sm text-slate-600">Built for Nigeria’s energy needs.</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-brand-orange/10 text-brand-orange grid place-items-center">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="font-semibold">Transparent specs</div>
                  <div className="text-sm text-slate-600">Know what you’re buying.</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-brand-orange/10 text-brand-orange grid place-items-center">
                  <Wrench size={18} />
                </div>
                <div>
                  <div className="font-semibold">Human support</div>
                  <div className="text-sm text-slate-600">Talk to an expert anytime.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="container py-14">
        <SectionTitle
          eyebrow="Why Crown Solar"
          title="A smoother way to buy solar"
          subtitle="We focus on clarity, reliability, and fast support—so customers can buy confidently."
        />

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((h) => {
            const Icon = h.icon
            return (
              <div key={h.title} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
                <div className="h-11 w-11 rounded-2xl bg-brand-orange/10 text-brand-orange grid place-items-center">
                  <Icon size={18} />
                </div>
                <div className="mt-4 font-semibold">{h.title}</div>
                <div className="mt-2 text-sm text-slate-600">{h.desc}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* MISSION + PROCESS */}
      <section className="container pb-16">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft">
            <div className="text-sm font-medium text-brand-orange">Our mission</div>
            <h2 className="mt-2 text-2xl font-semibold">Make solar shopping simple and accurate.</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Solar systems fail when sizing is wrong or components don’t match. We help customers select the right inverter size,
              battery capacity, and (when needed) panel array—based on real usage, not guesswork.
            </p>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Our goal is to reduce confusion by showing clear specs, offering sensible bundles, and providing fast human support for
              custom requirements.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-[linear-gradient(135deg,rgba(249,115,22,0.18),rgba(255,255,255,1)_55%)] p-8 shadow-soft">
            <div className="text-sm font-medium text-brand-orange">How we help</div>
            <h2 className="mt-2 text-2xl font-semibold">From power needs to the right setup.</h2>
            <ol className="mt-4 space-y-3 text-slate-700">
              <li className="flex gap-3">
                <span className="h-7 w-7 rounded-xl bg-white border border-slate-200 grid place-items-center text-sm font-semibold">1</span>
                <div>
                  <div className="font-medium">Share your appliances or daily kWh</div>
                  <div className="text-sm text-slate-600">We estimate daily energy and peak load.</div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="h-7 w-7 rounded-xl bg-white border border-slate-200 grid place-items-center text-sm font-semibold">2</span>
                <div>
                  <div className="font-medium">Get 3 quote tiers</div>
                  <div className="text-sm text-slate-600">Basic, Standard, Premium—so you can choose.</div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="h-7 w-7 rounded-xl bg-white border border-slate-200 grid place-items-center text-sm font-semibold">3</span>
                <div>
                  <div className="font-medium">Confirm with a human expert</div>
                  <div className="text-sm text-slate-600">We validate your setup and finalize pricing.</div>
                </div>
              </li>
            </ol>

            <div className="mt-7 flex gap-3 flex-wrap">
              <Link
                to="/quote"
                className="rounded-2xl bg-slate-900 text-white px-6 py-3 font-medium hover:bg-brand-orange transition shadow-soft"
              >
                Get a quote
              </Link>
              <Link
                to="/contact"
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-medium hover:bg-slate-50 transition"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
