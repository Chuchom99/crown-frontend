import React from "react";
import { Link, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

function money(n) {
  if (n === null || n === undefined) return "—";
  return `₦${Number(n).toLocaleString("en-NG")}`;
}

function waLink(message) {
  const num = import.meta.env.VITE_WHATSAPP_NUMBER || "2349031159025";
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

function downloadPdf(quote, tierKey) {
  const store = import.meta.env.VITE_STORE_NAME || "Crown Solar";
  const t = quote.tiers[tierKey];

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`${store} - Quote`, 14, 16);

  doc.setFontSize(11);
  doc.text(`Tier: ${tierKey.toUpperCase()}`, 14, 26);
  doc.text(`Daily kWh: ${Number(quote.inputs.dailyKwh).toFixed(2)}`, 14, 34);
  doc.text(`Backup hours: ${quote.inputs.backupHours}`, 14, 42);
  doc.text(`System: ${quote.inputs.systemType}`, 14, 50);

  let y = 62;
  doc.setFontSize(12);
  doc.text("Recommended sizing", 14, y);
  y += 8;

  doc.setFontSize(11);
  doc.text(`Inverter: ${t.sizing.inverterKva} kVA`, 14, y); y += 7;
  doc.text(`Battery: ${t.sizing.batteryKwh} kWh`, 14, y); y += 7;
  if (t.sizing.panels) { doc.text(`Panels: ${t.sizing.panels}`, 14, y); y += 7; }

  y += 6;
  doc.setFontSize(12);
  doc.text("Items", 14, y);
  y += 8;

  doc.setFontSize(11);

  if (!t.items || t.items.length === 0) {
    doc.text("No matching inventory found for automatic pricing.", 14, y);
    y += 7;
    doc.text("Please contact us for a human-verified quote.", 14, y);
    y += 7;
  } else {
    t.items.forEach((it) => {
      doc.text(`${it.qty} x ${it.name}  (${money(it.unitPrice)})`, 14, y);
      y += 7;
    });

    y += 4;
    doc.setFontSize(12);
    doc.text(`Total: ${money(t.total)}`, 14, y);
  }

  doc.save(`quote-${tierKey}.pdf`);
}

export default function QuoteResult() {
  const nav = useNavigate();
  const [quote, setQuote] = React.useState(null);

  React.useEffect(() => {
    const raw = sessionStorage.getItem("last_quote");
    if (!raw) return;
    setQuote(JSON.parse(raw));
  }, []);

  if (!quote) {
    return (
      <div className="container py-12">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <div className="font-semibold">No quote found</div>
          <div className="mt-2 text-slate-600 text-sm">Generate a quote first.</div>
          <button onClick={() => nav("/quote")} className="mt-4 rounded-2xl bg-brand-orange text-white px-5 py-2 font-medium">
            Go to Quote
          </button>
        </div>
      </div>
    );
  }

  const tiers = ["basic", "standard", "premium"];
  const label = { basic: "Basic", standard: "Standard", premium: "Premium" };
  const highlight = { basic: "", standard: "ring-2 ring-brand-orange", premium: "" };

  return (
    <div className="container py-10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-sm text-slate-500">Quote results</div>
          <div className="mt-1 text-2xl font-semibold">Your 3 options</div>
          <div className="mt-2 text-slate-600">
            Daily kWh: <b>{Number(quote.inputs.dailyKwh).toFixed(2)}</b> • Backup: <b>{quote.inputs.backupHours}h</b> • System: <b>{quote.inputs.systemType}</b>
          </div>
        </div>

        <Link to="/quote" className="text-brand-orange font-medium hover:underline">
          Edit inputs →
        </Link>
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-4">
        {tiers.map((k) => {
          const t = quote.tiers[k];
          const msg = `Hi, I generated a ${label[k]} quote.\n\nDaily kWh: ${Number(quote.inputs.dailyKwh).toFixed(2)}\nBackup: ${quote.inputs.backupHours}h\nSystem: ${quote.inputs.systemType}\n\nSizing:\n- Inverter: ${t.sizing.inverterKva} kVA\n- Battery: ${t.sizing.batteryKwh} kWh\n${t.sizing.panels ? `- Panels: ${t.sizing.panels}\n` : ""}\n\nPlease help me with a human-verified quote.`;

          return (
            <div key={k} className={`rounded-3xl border border-slate-100 bg-white p-6 shadow-soft ${highlight[k]}`}>
              <div className="flex items-center justify-between">
                <div className="font-semibold">{label[k]}</div>
                {k === "standard" ? <div className="text-xs px-2 py-1 rounded-full bg-brand-orange/10 text-brand-orange">Recommended</div> : null}
              </div>

              <div className="mt-4 grid gap-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Inverter</span><span className="font-medium">{t.sizing.inverterKva} kVA</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Battery</span><span className="font-medium">{t.sizing.batteryKwh} kWh</span></div>
                {quote.inputs.systemType === "full_solar" ? (
                  <div className="flex justify-between"><span className="text-slate-500">Panels</span><span className="font-medium">{t.sizing.panels || 0}</span></div>
                ) : null}
              </div>

              <div className="mt-5">
                {t.status === "ok" ? (
                  <>
                    <div className="text-sm font-semibold">Itemized</div>
                    <div className="mt-2 space-y-2">
                      {t.items.map((it) => (
                        <div key={it.id} className="flex justify-between text-sm">
                          <span className="text-slate-600">{it.qty} × {it.name}</span>
                          <span className="font-medium">{money(it.unitPrice)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-slate-500 text-sm">Total</span>
                      <span className="text-lg font-semibold text-brand-orange">{money(t.total)}</span>
                    </div>
                  </>
                ) : (
                  <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-amber-800 text-sm">
                    {t.message || "Inventory not found for automatic pricing. Please contact us for a better quote."}
                  </div>
                )}
              </div>

              <div className="mt-6 grid gap-2">
                {/* Add to cart only when we have real items/prices */}
                {t.status === "ok" ? (
                  <button
                    onClick={() => {
                      const raw = localStorage.getItem("cart") || "[]";
                      const cart = JSON.parse(raw);
                      const next = [...cart];

                      t.items.forEach((it) => {
                        next.push({ productId: it.id, name: it.name, qty: it.qty, price: it.unitPrice });
                      });

                      localStorage.setItem("cart", JSON.stringify(next));
                      nav("/cart");
                    }}
                    className="rounded-2xl bg-slate-900 text-white py-2 font-medium hover:bg-brand-orange transition"
                  >
                    Add bundle to cart
                  </button>
                ) : (
                  <a
                    href={waLink(msg)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl bg-slate-900 text-white py-2 font-medium hover:bg-brand-orange transition text-center"
                  >
                    Chat on WhatsApp
                  </a>
                )}

                <button
                  onClick={() => downloadPdf(quote, k)}
                  className="rounded-2xl border border-slate-200 bg-white py-2 font-medium hover:bg-slate-50 transition"
                >
                  Download quote PDF
                </button>

                {/* Always show WhatsApp CTA too */}
                <a
                  href={waLink(msg)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-center text-brand-orange font-medium hover:underline"
                >
                  Need a human? Chat now →
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {quote.notes?.length ? (
        <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 text-sm text-slate-600 shadow-soft">
          <div className="font-semibold text-slate-900">Notes</div>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            {quote.notes.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
