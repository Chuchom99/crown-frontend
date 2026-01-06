// import React from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/client";
// import { SectionTitle, Pill } from "../components/UI";

// const presets = [
//   { name: "LED Bulb", watts: 10 },
//   { name: "Fan", watts: 60 },
//   { name: "TV", watts: 80 },
//   { name: "Decoder", watts: 20 },
//   { name: "Laptop", watts: 60 },
//   { name: "Fridge", watts: 150 },
// ];

// export default function Quote() {
//   const nav = useNavigate();

//   const [mode, setMode] = React.useState("appliances"); // appliances | kwh
//   const [appliances, setAppliances] = React.useState([{ name: "TV", qty: 1, watts: 80, hours: 6 }]);
//   const [dailyKwh, setDailyKwh] = React.useState("");

//   const [backupHours, setBackupHours] = React.useState(10);
//   const [systemType, setSystemType] = React.useState("full_solar"); // inverter_battery | full_solar
//   const [batteryChemistry, setBatteryChemistry] = React.useState("lithium");
//   const [budget, setBudget] = React.useState("");

//   const [name, setName] = React.useState("");
//   const [phone, setPhone] = React.useState("");
//   const [location, setLocation] = React.useState("");

//   const [loading, setLoading] = React.useState(false);
//   const [err, setErr] = React.useState("");

//   const addPreset = (p) => {
//     setAppliances((prev) => [...prev, { name: p.name, qty: 1, watts: p.watts, hours: 6 }]);
//   };

//   const updateRow = (idx, key, val) => {
//     setAppliances((prev) =>
//       prev.map((r, i) => (i === idx ? { ...r, [key]: key === "name" ? val : Number(val) } : r))
//     );
//   };

//   const removeRow = (idx) => {
//     setAppliances((prev) => prev.filter((_, i) => i !== idx));
//   };

//   const submit = async () => {
//     try {
//       setErr("");
//       setLoading(true);

//       const payload = {
//         mode,
//         appliances: mode === "appliances" ? appliances : [],
//         dailyKwh: mode === "kwh" ? Number(dailyKwh) : null,
//         backupHours: Number(backupHours),
//         systemType,
//         batteryChemistry,
//         budget: budget ? Number(budget) : null,
//         contact: { name, phone, location },
//       };

//       const res = await api.post("/api/quotes", payload);

//       // Save in session and go to result
//       sessionStorage.setItem("last_quote", JSON.stringify(res.data));
//       nav("/quote/result");
//     } catch (e) {
//       setErr(e?.response?.data?.error || e?.message || "Failed to generate quote");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container py-10">
//       <Pill>Instant sizing • 3 options • Nigeria defaults</Pill>
//       <div className="mt-4">
//         <SectionTitle
//           eyebrow="Get a quote"
//           title="Tell us your power needs"
//           subtitle="We’ll recommend 3 setups (Basic / Standard / Premium)."
//         />
//       </div>

//       <div className="mt-8 grid lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
//           <div className="flex gap-2">
//             <button
//               className={`px-4 py-2 rounded-2xl border ${mode === "appliances" ? "bg-slate-900 text-white border-slate-900" : "border-slate-200"}`}
//               onClick={() => setMode("appliances")}
//             >
//               Appliances
//             </button>
//             <button
//               className={`px-4 py-2 rounded-2xl border ${mode === "kwh" ? "bg-slate-900 text-white border-slate-900" : "border-slate-200"}`}
//               onClick={() => setMode("kwh")}
//             >
//               Daily kWh
//             </button>
//           </div>

//           {mode === "appliances" ? (
//             <>
//               <div className="mt-5 flex flex-wrap gap-2">
//                 {presets.map((p) => (
//                   <button
//                     key={p.name}
//                     onClick={() => addPreset(p)}
//                     className="text-sm px-3 py-2 rounded-2xl border border-slate-200 hover:bg-slate-50"
//                   >
//                     + {p.name}
//                   </button>
//                 ))}
//               </div>

//               <div className="mt-6 grid gap-3">
//                 {appliances.map((a, idx) => (
//                   <div key={idx} className="grid grid-cols-12 gap-2 items-center">
//                     <input
//                       className="col-span-4 rounded-2xl border border-slate-200 px-3 py-2"
//                       value={a.name}
//                       onChange={(e) => updateRow(idx, "name", e.target.value)}
//                       placeholder="Appliance"
//                     />
//                     <input
//                       type="number"
//                       className="col-span-2 rounded-2xl border border-slate-200 px-3 py-2"
//                       value={a.qty}
//                       onChange={(e) => updateRow(idx, "qty", e.target.value)}
//                       placeholder="Qty"
//                       min={1}
//                     />
//                     <input
//                       type="number"
//                       className="col-span-3 rounded-2xl border border-slate-200 px-3 py-2"
//                       value={a.watts}
//                       onChange={(e) => updateRow(idx, "watts", e.target.value)}
//                       placeholder="Watts"
//                       min={1}
//                     />
//                     <input
//                       type="number"
//                       className="col-span-2 rounded-2xl border border-slate-200 px-3 py-2"
//                       value={a.hours}
//                       onChange={(e) => updateRow(idx, "hours", e.target.value)}
//                       placeholder="Hours/day"
//                       min={0}
//                       step="0.5"
//                     />
//                     <button
//                       onClick={() => removeRow(idx)}
//                       className="col-span-1 text-slate-400 hover:text-red-600"
//                       title="Remove"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </>
//           ) : (
//             <div className="mt-6">
//               <label className="text-sm text-slate-600">Daily energy usage (kWh/day)</label>
//               <input
//                 type="number"
//                 className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2"
//                 value={dailyKwh}
//                 onChange={(e) => setDailyKwh(e.target.value)}
//                 placeholder="e.g. 6.5"
//                 min={0}
//                 step="0.1"
//               />
//               <div className="mt-2 text-xs text-slate-500">
//                 If you don’t know, use the Appliances tab instead.
//               </div>
//             </div>
//           )}

//           <div className="mt-8 grid sm:grid-cols-2 gap-4">
//             <div>
//               <label className="text-sm text-slate-600">Backup hours</label>
//               <select
//                 className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2"
//                 value={backupHours}
//                 onChange={(e) => setBackupHours(e.target.value)}
//               >
//                 {[6, 10, 12, 18, 24].map((h) => (
//                   <option key={h} value={h}>
//                     {h} hours
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="text-sm text-slate-600">System type</label>
//               <select
//                 className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2"
//                 value={systemType}
//                 onChange={(e) => setSystemType(e.target.value)}
//               >
//                 <option value="inverter_battery">Inverter + Battery</option>
//                 <option value="full_solar">Full Solar (Panels + Inverter + Battery)</option>
//               </select>
//             </div>

//             <div>
//               <label className="text-sm text-slate-600">Battery chemistry</label>
//               <select
//                 className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2"
//                 value={batteryChemistry}
//                 onChange={(e) => setBatteryChemistry(e.target.value)}
//               >
//                 <option value="lithium">Lithium</option>
//                 <option value="gel">Gel / Lead-acid</option>
//               </select>
//             </div>

//             <div>
//               <label className="text-sm text-slate-600">Budget (optional)</label>
//               <input
//                 type="number"
//                 className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2"
//                 value={budget}
//                 onChange={(e) => setBudget(e.target.value)}
//                 placeholder="₦"
//                 min={0}
//               />
//             </div>
//           </div>
//         </div>

//         <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
//           <div className="font-semibold">Contact (optional but recommended)</div>
//           <div className="mt-4 grid gap-3">
//             <input className="rounded-2xl border border-slate-200 px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
//             <input className="rounded-2xl border border-slate-200 px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone / WhatsApp" />
//             <input className="rounded-2xl border border-slate-200 px-3 py-2" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location (e.g. Lagos)" />
//           </div>

//           {err ? <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 p-3 text-red-700 text-sm">{err}</div> : null}

//           <button
//             onClick={submit}
//             disabled={loading}
//             className="mt-6 w-full rounded-2xl bg-brand-orange text-white px-5 py-3 font-medium hover:bg-brand-orangeDark transition shadow-soft disabled:opacity-60"
//           >
//             {loading ? "Generating..." : "Get 3 quote options"}
//           </button>

//           <div className="mt-3 text-xs text-slate-500">
//             You’ll receive Basic / Standard / Premium recommendations.
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { SectionTitle, Pill } from "../components/UI";

const presets = [
  { name: "LED Bulb", watts: 10 },
  { name: "Fan", watts: 60 },
  { name: "TV", watts: 80 },
  { name: "Decoder", watts: 20 },
  { name: "Laptop", watts: 60 },
  { name: "Fridge", watts: 150 },
];

export default function Quote() {
  const nav = useNavigate();

  const [mode, setMode] = React.useState("appliances"); // appliances | kwh
  const [appliances, setAppliances] = React.useState([
    { name: "TV", qty: 1, watts: 80, hours: 6 },
  ]);
  const [dailyKwh, setDailyKwh] = React.useState("");

  const [backupHours, setBackupHours] = React.useState(10);
  const [systemType, setSystemType] = React.useState("full_solar"); // inverter_battery | full_solar
  const [batteryChemistry, setBatteryChemistry] = React.useState("lithium");
  const [budget, setBudget] = React.useState("");

  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [location, setLocation] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState("");

  const addPreset = (p) => {
    setAppliances((prev) => [
      ...prev,
      { name: p.name, qty: 1, watts: p.watts, hours: 6 },
    ]);
  };

  const addEmptyRow = () => {
    setAppliances((prev) => [
      ...prev,
      { name: "", qty: 1, watts: 0, hours: 6 },
    ]);
  };

  const updateRow = (idx, key, val) => {
    setAppliances((prev) =>
      prev.map((r, i) =>
        i === idx ? { ...r, [key]: key === "name" ? val : Number(val) } : r
      )
    );
  };

  const removeRow = (idx) => {
    setAppliances((prev) => prev.filter((_, i) => i !== idx));
  };

  const submit = async () => {
    try {
      setErr("");
      setLoading(true);

      const payload = {
        mode,
        appliances: mode === "appliances" ? appliances : [],
        dailyKwh: mode === "kwh" ? Number(dailyKwh) : null,
        backupHours: Number(backupHours),
        systemType,
        batteryChemistry,
        budget: budget ? Number(budget) : null,
        contact: { name, phone, location },
      };

      const res = await api.post("/api/quote", payload);

      sessionStorage.setItem("last_quote", JSON.stringify(res.data));
      nav("/quote/result");
    } catch (e) {
      setErr(e?.response?.data?.error || e?.message || "Failed to generate quote");
    } finally {
      setLoading(false);
    }
  };

  const hasValidApplianceRows =
    appliances.some((a) => (a.name || "").trim() && Number(a.qty) > 0 && Number(a.watts) > 0 && Number(a.hours) >= 0);

  return (
    <div className="container py-10">
      <Pill>Instant sizing • 3 options • Nigeria defaults (sun hours = 5)</Pill>

      <div className="mt-4">
        <SectionTitle
          eyebrow="Get a quote"
          title="Tell us your power needs"
          subtitle="We’ll recommend 3 setups (Basic / Standard / Premium)."
        />
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        {/* LEFT: POWER INPUT */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="font-semibold">1) Power usage</div>
              <div className="text-sm text-slate-600">
                Choose one method: appliances list (recommended) or daily kWh.
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className={`px-4 py-2 rounded-2xl border ${
                  mode === "appliances"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
                onClick={() => setMode("appliances")}
              >
                Appliances (recommended)
              </button>

              <button
                type="button"
                className={`px-4 py-2 rounded-2xl border ${
                  mode === "kwh"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
                onClick={() => setMode("kwh")}
              >
                Daily kWh
              </button>
            </div>
          </div>

          {mode === "appliances" ? (
            <>
              <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
                <div className="text-sm text-slate-600">
                  Quick add common appliances:
                </div>
                <div className="flex flex-wrap gap-2">
                  {presets.map((p) => (
                    <button
                      type="button"
                      key={p.name}
                      onClick={() => addPreset(p)}
                      className="text-sm px-3 py-2 rounded-2xl border border-slate-200 hover:bg-slate-50"
                    >
                      + {p.name}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={addEmptyRow}
                    className="text-sm px-3 py-2 rounded-2xl border border-slate-200 hover:bg-slate-50"
                  >
                    + Custom item
                  </button>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                <div className="font-medium text-slate-900">How to fill this:</div>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li><b>Watts</b> = power rating (usually printed on the device).</li>
                  <li><b>Hours/day</b> = how long you use it daily.</li>
                  <li>This helps estimate <b>daily kWh</b> and <b>peak load</b>.</li>
                </ul>
              </div>

              {/* Table headers */}
              <div className="mt-6 grid grid-cols-12 gap-2 text-xs font-semibold text-slate-500 px-1">
                <div className="col-span-4">Appliance</div>
                <div className="col-span-2">Qty</div>
                <div className="col-span-3">Watts (W)</div>
                <div className="col-span-2">Hours/day</div>
                <div className="col-span-1 text-right">Remove</div>
              </div>

              <div className="mt-2 grid gap-3">
                {appliances.map((a, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                    <input
                      className="col-span-4 rounded-2xl border border-slate-200 px-3 py-2"
                      value={a.name}
                      onChange={(e) => updateRow(idx, "name", e.target.value)}
                      placeholder="e.g. Fridge"
                    />
                    <input
                      type="number"
                      className="col-span-2 rounded-2xl border border-slate-200 px-3 py-2"
                      value={a.qty}
                      onChange={(e) => updateRow(idx, "qty", e.target.value)}
                      placeholder="1"
                      min={1}
                    />
                    <input
                      type="number"
                      className="col-span-3 rounded-2xl border border-slate-200 px-3 py-2"
                      value={a.watts}
                      onChange={(e) => updateRow(idx, "watts", e.target.value)}
                      placeholder="e.g. 150"
                      min={0}
                    />
                    <input
                      type="number"
                      className="col-span-2 rounded-2xl border border-slate-200 px-3 py-2"
                      value={a.hours}
                      onChange={(e) => updateRow(idx, "hours", e.target.value)}
                      placeholder="e.g. 10"
                      min={0}
                      step="0.5"
                    />
                    <button
                      type="button"
                      onClick={() => removeRow(idx)}
                      className="col-span-1 text-slate-400 hover:text-red-600 text-right"
                      title="Remove row"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {!hasValidApplianceRows ? (
                <div className="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-2xl p-3">
                  Add at least one valid appliance row (name, qty, watts, hours/day).
                </div>
              ) : null}
            </>
          ) : (
            <div className="mt-6">
              <div className="font-semibold">Daily energy usage</div>
              <label className="mt-2 block text-sm text-slate-600">
                Enter your estimated total usage (kWh/day)
              </label>
              <input
                type="number"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2"
                value={dailyKwh}
                onChange={(e) => setDailyKwh(e.target.value)}
                placeholder="e.g. 6.5"
                min={0}
                step="0.1"
              />
              <div className="mt-2 text-xs text-slate-500">
                If you’re not sure, switch to <b>Appliances</b> and we’ll calculate it for you.
              </div>
            </div>
          )}

          {/* SYSTEM SETTINGS */}
          <div className="mt-10">
            <div className="font-semibold">2) Backup & system preferences</div>
            <div className="text-sm text-slate-600">
              These settings affect battery size, inverter size, and (if solar) panel count.
            </div>

            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-600">Backup duration</label>
                <select
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2"
                  value={backupHours}
                  onChange={(e) => setBackupHours(e.target.value)}
                >
                  {[6, 10, 12, 18, 24].map((h) => (
                    <option key={h} value={h}>
                      {h} hours
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-600">System type</label>
                <select
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2"
                  value={systemType}
                  onChange={(e) => setSystemType(e.target.value)}
                >
                  <option value="inverter_battery">Inverter + Battery (no panels)</option>
                  <option value="full_solar">Full Solar (Panels + Inverter + Battery)</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-600">Battery type</label>
                <select
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2"
                  value={batteryChemistry}
                  onChange={(e) => setBatteryChemistry(e.target.value)}
                >
                  <option value="lithium">Lithium (recommended)</option>
                  <option value="gel">Gel / Lead-acid</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-600">Budget (optional)</label>
                <input
                  type="number"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 1500000"
                  min={0}
                />
                <div className="mt-1 text-xs text-slate-500">In ₦ (NGN). We’ll flag options above budget.</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: CONTACT + SUBMIT */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <div className="font-semibold">3) Contact details</div>
          <div className="mt-1 text-sm text-slate-600">
            Optional, but helps us give a better human quote if needed.
          </div>

          <div className="mt-4 grid gap-3">
            <label className="text-sm text-slate-600">
              Name
              <input
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aisha"
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

            <label className="text-sm text-slate-600">
              Location
              <input
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Lagos"
              />
            </label>
          </div>

          {err ? (
            <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
              {err}
            </div>
          ) : null}

          <button
            onClick={submit}
            disabled={loading || (mode === "appliances" ? !hasValidApplianceRows : !dailyKwh)}
            className="mt-6 w-full rounded-2xl bg-brand-orange text-white px-5 py-3 font-medium hover:bg-brand-orangeDark transition shadow-soft disabled:opacity-60"
          >
            {loading ? "Generating quote..." : "Get 3 quote options"}
          </button>

          <div className="mt-3 text-xs text-slate-500">
            You’ll receive Basic / Standard / Premium recommendations instantly.
          </div>
        </div>
      </div>
    </div>
  );
}
