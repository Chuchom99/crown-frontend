import React from "react"
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react"
import { SectionTitle, Pill } from "../components/UI"

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "23480XXXXXXXXX"
const STORE_NAME = import.meta.env.VITE_STORE_NAME || "SolarDealer"

// Replace with your real address (used in map search)
const DEFAULT_LOCATION_QUERY = "Lagos, Nigeria"

function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export default function Contact() {
  const [fullName, setFullName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [message, setMessage] = React.useState("Hi, I need help choosing the right solar setup.")

  const quickMsg = `Hi ${STORE_NAME}, I need help with a solar quote.\n\nName: ${fullName || "—"}\nPhone: ${phone || "—"}\nMessage: ${message || "—"}`
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(DEFAULT_LOCATION_QUERY)}&output=embed`

  return (
    <div className="container py-10">
      <Pill>Contact • Fast response</Pill>

      <div className="mt-4">
        <SectionTitle
          eyebrow="Contact us"
          title="Let’s help you get the right solar setup"
          subtitle="Message us on WhatsApp for the quickest response, or use the form below."
        />
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        {/* LEFT: Contact cards */}
        <div className="lg:col-span-1 grid gap-4">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-brand-orange/10 text-brand-orange grid place-items-center">
                <MessageCircle size={18} />
              </div>
              <div>
                <div className="font-semibold">WhatsApp</div>
                <div className="text-sm text-slate-600">Fastest response (recommended)</div>
              </div>
            </div>

            <a
              href={waLink(quickMsg)}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 text-white px-4 py-3 font-medium hover:bg-brand-orange transition shadow-soft"
            >
              <MessageCircle size={16} />
              Chat on WhatsApp
            </a>

            <div className="mt-3 text-xs text-slate-500">
              Set your number in <code>VITE_WHATSAPP_NUMBER</code>.
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-brand-orange/10 text-brand-orange grid place-items-center">
                <Phone size={18} />
              </div>
              <div>
                <div className="font-semibold">Phone</div>
                <div className="text-sm text-slate-600">Call us for quick guidance</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-slate-700">
              +234 801 234 5678
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-brand-orange/10 text-brand-orange grid place-items-center">
                <Mail size={18} />
              </div>
              <div>
                <div className="font-semibold">Email</div>
                <div className="text-sm text-slate-600">For business inquiries</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-slate-700">
              info@solardealer.com
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-brand-orange/10 text-brand-orange grid place-items-center">
                <MapPin size={18} />
              </div>
              <div>
                <div className="font-semibold">Location</div>
                <div className="text-sm text-slate-600">We deliver nationwide</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-slate-700">
              {DEFAULT_LOCATION_QUERY}
            </div>
          </div>
        </div>

        {/* RIGHT: Map + form */}
        <div className="lg:col-span-2 grid gap-6">
          {/* Map */}
          <div className="rounded-3xl border border-slate-100 bg-white shadow-soft overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="font-semibold">Find us</div>
              <div className="text-sm text-slate-600">Map preview (update address as needed)</div>
            </div>
            <div className="aspect-video bg-slate-50">
              <iframe
                title="Map"
                src={mapSrc}
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Form */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
            <div className="font-semibold">Send a message</div>
            <div className="mt-1 text-sm text-slate-600">
              Prefer WhatsApp? The button below will open WhatsApp with your message.
            </div>

            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              <label className="text-sm text-slate-600">
                Full name
                <input
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aisha Ibrahim"
                />
              </label>

              <label className="text-sm text-slate-600">
                Phone / WhatsApp
                <input
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 08012345678"
                />
              </label>

              <label className="text-sm text-slate-600 sm:col-span-2">
                Message
                <textarea
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 min-h-[120px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us your appliances, backup hours, and location..."
                />
              </label>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <a
                href={waLink(quickMsg)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-orange text-white px-6 py-3 font-medium hover:bg-brand-orangeDark transition shadow-soft"
              >
                <MessageCircle size={16} />
                Send on WhatsApp
              </a>

              <a
                href={`mailto:info@solardealer.com?subject=${encodeURIComponent(`Inquiry - ${STORE_NAME}`)}&body=${encodeURIComponent(quickMsg)}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 font-medium hover:bg-slate-50 transition"
              >
                <Mail size={16} />
                Send via Email
              </a>
            </div>

            <div className="mt-3 text-xs text-slate-500">
              Tip: include your appliance list or daily kWh + backup hours for a faster response.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
