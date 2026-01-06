// import React from "react";
// import { Link } from "react-router-dom";
// import api from "../api/client.js";
// import { useAuth } from "../context/AuthContext.jsx";
// import { useCart } from "../context/CartContext.jsx";
// import { formatMoney } from "../utils/format.js";

// const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "23480XXXXXXXXX";

// function waLink(text) {
//   return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
// }

// function safeJson(v) {
//   try {
//     return typeof v === "string" ? JSON.parse(v) : v;
//   } catch {
//     return v;
//   }
// }

// export default function Checkout() {
//   const { user } = useAuth();
//   const { items, subtotal, clear } = useCart();
//   const total = subtotal();

//   const [loading, setLoading] = React.useState(false);
//   const [status, setStatus] = React.useState(null);
//   const [error, setError] = React.useState("");

//   // Payment methods from backend
//   const [pmLoading, setPmLoading] = React.useState(false);
//   const [paymentMethods, setPaymentMethods] = React.useState([]);
//   const [selectedPmId, setSelectedPmId] = React.useState("");

//   const selectedPm = React.useMemo(
//     () => paymentMethods.find((p) => p.id === selectedPmId) || null,
//     [paymentMethods, selectedPmId]
//   );

//   const pmName = (selectedPm?.name || "").toLowerCase();
//   const isCrypto = pmName.includes("crypto");

//   const [form, setForm] = React.useState({
//     email: user?.email || "",
//     fullName: user?.name || "",
//     phone: "",
//     address1: "",
//     city: "",
//     state: "",
//     country: "Nigeria",
//     notes: "",
//   });

//   function onChange(e) {
//     setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
//   }

//   async function loadPaymentMethods() {
//     setPmLoading(true);
//     try {
//       const { data } = await api.get("/api/payment-method/get-payment-method");
//       const active = (Array.isArray(data) ? data : []).filter((x) => x?.isActive);

//       setPaymentMethods(active);

//       // Default to first active method
//       if (active.length && !selectedPmId) {
//         setSelectedPmId(active[0].id);
//       }
//     } catch (e) {
//       // Don’t block checkout completely; show a message and fallback
//       console.error(e);
//       setPaymentMethods([]);
//     } finally {
//       setPmLoading(false);
//     }
//   }

//   React.useEffect(() => {
//     loadPaymentMethods();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const whatsappMsg = React.useMemo(() => {
//     const cartLines = items
//       .map((it) => `- ${it.name} x${it.quantity} = ${formatMoney(Number(it.price) * it.quantity)}`)
//       .join("\n");

//     return (
//       `Hi, I want to pay via CRYPTO. Please authorize my payment.\n\n` +
//       `Customer:\n` +
//       `Name: ${form.fullName || user?.name || "—"}\n` +
//       `Phone: ${form.phone || "—"}\n` +
//       `Email: ${form.email || user?.email || "—"}\n` +
//       `Location: ${[form.city, form.state].filter(Boolean).join(", ") || "Nigeria"}\n\n` +
//       `Order summary:\n${cartLines}\n\n` +
//       `Total: ${formatMoney(total)}\n\n` +
//       `I understand I must be authorized before paying via crypto.`
//     );
//   }, [items, total, form, user]);

//   async function placeOrder(e) {
//     e.preventDefault();
//     setError("");
//     setStatus(null);

//     if (items.length === 0) {
//       setError("Your cart is empty.");
//       return;
//     }

//     if (!selectedPmId) {
//       setError("Please select a payment method.");
//       return;
//     }

//     if (!user && !form.email) {
//       setError("Email is required for guest checkout.");
//       return;
//     }

//     // 🔒 CRYPTO RULE: must chat first
//     if (isCrypto) {
//       setStatus({
//         ok: false,
//         cryptoGate: true,
//         message: "Crypto payments require WhatsApp authorization. Please chat with us first.",
//       });
//       return;
//     }

//     // BANK TRANSFER: proceed
//     setLoading(true);
//     try {
//       const payload = {
//         items: items.map((x) => ({ productId: x.id, quantity: x.quantity })),
//         shippingAddress: {
//           fullName: form.fullName,
//           phone: form.phone,
//           address1: form.address1,
//           city: form.city,
//           state: form.state,
//           country: form.country,
//           notes: form.notes,
//         },
//         paymentMethodId: selectedPmId, // ✅ send selected method id to backend if supported
//         ...(user ? {} : { guestEmail: form.email }),
//       };

//       const { data } = await api.post("/api/orders/create-order", payload);

//       setStatus({ ok: true, data });
//       clear();
//     } catch (err) {
//       setError(
//         err?.response?.data?.error ||
//           err?.response?.data?.message ||
//           err.message ||
//           "Failed to place order"
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   const details = safeJson(selectedPm?.details);

//   return (
//     <div className="container py-10">
//       <div className="flex items-end justify-between gap-6 flex-wrap">
//         <div>
//           <div className="text-sm font-medium text-brand-orange">Checkout</div>
//           <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
//             Complete your purchase
//           </h1>
//           <p className="mt-2 text-slate-600">
//             Fill in delivery details, choose payment, and place your order.
//           </p>
//         </div>
//         <Link to="/cart" className="text-brand-orange font-medium hover:underline">
//           ← Back to cart
//         </Link>
//       </div>

//       <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
//         <form
//           onSubmit={placeOrder}
//           className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft"
//         >
//           {/* PAYMENT METHOD */}
//           <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
//             <div className="font-semibold">Payment method</div>
//             <div className="mt-1 text-sm text-slate-600">
//               Bank transfer is instant to place an order. Crypto requires WhatsApp authorization.
//             </div>

//             <div className="mt-3">
//               {pmLoading ? (
//                 <div className="text-sm text-slate-600">Loading payment methods…</div>
//               ) : paymentMethods.length === 0 ? (
//                 <div className="text-sm text-amber-700">
//                   No payment methods found. Please contact support.
//                 </div>
//               ) : (
//                 <div className="grid sm:grid-cols-2 gap-3">
//                   {paymentMethods.map((pm) => {
//                     const active = pm.id === selectedPmId;
//                     return (
//                       <button
//                         key={pm.id}
//                         type="button"
//                         onClick={() => setSelectedPmId(pm.id)}
//                         className={`text-left rounded-2xl border p-4 transition ${
//                           active
//                             ? "border-brand-orange bg-white shadow-soft"
//                             : "border-slate-200 bg-white hover:bg-slate-50"
//                         }`}
//                       >
//                         <div className="font-semibold">{pm.name}</div>
//                         <div className="text-xs text-slate-600 mt-1">
//                           {String(pm.name).toLowerCase().includes("crypto")
//                             ? "Authorize via WhatsApp first"
//                             : "Pay after placing order"}
//                         </div>
//                       </button>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* PAYMENT DETAILS */}
//             {selectedPm ? (
//               <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
//                 <div className="text-sm font-semibold">Payment instructions</div>

//                 {isCrypto ? (
//                   <>
//                     <div className="mt-2 text-sm text-slate-600">
//                       Crypto payments must be authorized first. Click WhatsApp to get approval and the correct wallet address.
//                     </div>

//                     <a
//                       href={waLink(whatsappMsg)}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="mt-3 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 text-white px-4 py-3 font-medium hover:bg-brand-orange transition shadow-soft"
//                     >
//                       Chat on WhatsApp for Crypto Authorization
//                     </a>
//                   </>
//                 ) : (
//                   <>
//                     <div className="mt-2 grid gap-2 text-sm text-slate-700">
//                       {details?.bankName ? (
//                         <div className="flex items-center justify-between gap-4">
//                           <span className="text-slate-500">Bank</span>
//                           <span className="font-medium">{details.bankName}</span>
//                         </div>
//                       ) : null}

//                       {details?.accountNumber ? (
//                         <div className="flex items-center justify-between gap-4">
//                           <span className="text-slate-500">Account number</span>
//                           <span className="font-medium">{details.accountNumber}</span>
//                         </div>
//                       ) : null}

//                       {details?.Name ? (
//                         <div className="flex items-center justify-between gap-4">
//                           <span className="text-slate-500">Account name</span>
//                           <span className="font-medium">{details.Name}</span>
//                         </div>
//                       ) : null}

//                       {details?.instructions ? (
//                         <div className="mt-2 text-xs text-slate-600">
//                           <span className="font-semibold">Note:</span> {details.instructions}
//                         </div>
//                       ) : null}
//                     </div>
//                   </>
//                 )}
//               </div>
//             ) : null}
//           </div>

//           {/* GUEST EMAIL */}
//           {!user ? (
//             <div className="mt-4 grid sm:grid-cols-2 gap-4">
//               <div className="sm:col-span-2">
//                 <label className="text-sm text-slate-600">Email</label>
//                 <input
//                   name="email"
//                   value={form.email}
//                   onChange={onChange}
//                   className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
//                   placeholder="you@example.com"
//                   required
//                 />
//               </div>
//             </div>
//           ) : null}

//           {/* ADDRESS */}
//           <div className="mt-4 grid sm:grid-cols-2 gap-4">
//             <div className="sm:col-span-2">
//               <label className="text-sm text-slate-600">Full name</label>
//               <input
//                 name="fullName"
//                 value={form.fullName}
//                 onChange={onChange}
//                 className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
//                 placeholder="Customer name"
//               />
//             </div>

//             <div className="sm:col-span-2">
//               <label className="text-sm text-slate-600">Phone</label>
//               <input
//                 name="phone"
//                 value={form.phone}
//                 onChange={onChange}
//                 className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
//                 placeholder="+234..."
//               />
//             </div>

//             <div className="sm:col-span-2">
//               <label className="text-sm text-slate-600">Address</label>
//               <input
//                 name="address1"
//                 value={form.address1}
//                 onChange={onChange}
//                 className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
//                 placeholder="Street / house number"
//                 required
//               />
//             </div>

//             <div>
//               <label className="text-sm text-slate-600">City</label>
//               <input
//                 name="city"
//                 value={form.city}
//                 onChange={onChange}
//                 className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
//                 placeholder="City"
//               />
//             </div>

//             <div>
//               <label className="text-sm text-slate-600">State</label>
//               <input
//                 name="state"
//                 value={form.state}
//                 onChange={onChange}
//                 className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
//                 placeholder="State"
//               />
//             </div>

//             <div className="sm:col-span-2">
//               <label className="text-sm text-slate-600">Notes</label>
//               <textarea
//                 name="notes"
//                 value={form.notes}
//                 onChange={onChange}
//                 rows={3}
//                 className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
//                 placeholder="Anything we should know?"
//               />
//             </div>
//           </div>

//           {error ? (
//             <div className="mt-4 rounded-2xl bg-red-50 border border-red-100 p-3 text-sm text-red-700">
//               {error}
//             </div>
//           ) : null}

//           {/* STATUS */}
//           {status?.ok ? (
//             <div className="mt-4 rounded-2xl bg-green-50 border border-green-100 p-3 text-sm text-green-700">
//               Order placed successfully. Please complete payment and then click{" "}
//               <b>Notify Payment</b> from your Orders page (or we can add it here next).
//             </div>
//           ) : null}

//           {status?.cryptoGate ? (
//             <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
//               {status.message}{" "}
//               <a
//                 className="font-semibold underline"
//                 href={waLink(whatsappMsg)}
//                 target="_blank"
//                 rel="noreferrer"
//               >
//                 Chat now →
//               </a>
//             </div>
//           ) : null}

//           <button
//             disabled={loading || pmLoading || !selectedPmId}
//             className="mt-6 w-full rounded-2xl bg-brand-orange text-white px-6 py-3 font-medium hover:bg-brand-orangeDark transition shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isCrypto
//               ? "Chat on WhatsApp to authorize Crypto"
//               : loading
//               ? "Placing order…"
//               : "Place order"}
//           </button>

//           <div className="mt-4 text-xs text-slate-500">
//             If you choose crypto, you must chat with us first for authorization.
//           </div>
//         </form>

//         {/* SUMMARY */}
//         <aside className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft h-fit">
//           <div className="font-semibold">Order summary</div>
//           <div className="mt-4 grid gap-3">
//             {items.map((it) => (
//               <div key={it.id} className="flex items-start justify-between gap-3 text-sm">
//                 <div>
//                   <div className="font-medium">{it.name}</div>
//                   <div className="text-slate-500">Qty: {it.quantity}</div>
//                 </div>
//                 <div className="font-medium">
//                   {formatMoney(Number(it.price) * it.quantity)}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="h-px bg-slate-100 my-4" />
//           <div className="flex items-center justify-between">
//             <div className="font-semibold">Subtotal</div>
//             <div className="font-semibold">{formatMoney(total)}</div>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { Link } from "react-router-dom";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatMoney } from "../utils/format.js";

const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER || "23480XXXXXXXXX";

function waLink(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function safeJson(v) {
  try {
    return typeof v === "string" ? JSON.parse(v) : v;
  } catch {
    return v;
  }
}

function splitName(fullName = "") {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: parts[0] };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export default function Checkout() {
  const { user } = useAuth();
  const { items, subtotal, clear } = useCart();
  const total = subtotal();

  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState(null);
  const [error, setError] = React.useState("");

  // Payment methods
  const [pmLoading, setPmLoading] = React.useState(false);
  const [paymentMethods, setPaymentMethods] = React.useState([]);
  const [selectedPmName, setSelectedPmName] = React.useState(""); // ✅ backend needs name

  const selectedPm = React.useMemo(() => {
    return paymentMethods.find((p) => p.name === selectedPmName) || null;
  }, [paymentMethods, selectedPmName]);

  const isCrypto = React.useMemo(() => {
    const n = (selectedPmName || "").toLowerCase();
    return n.includes("crypto");
  }, [selectedPmName]);

  const [form, setForm] = React.useState({
    email: user?.email || "",
    fullName: user?.name || "",
    phone: "",
    address1: "",
    city: "",
    state: "",
    country: "Nigeria",
    notes: "",
  });

  function onChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function loadPaymentMethods() {
    setPmLoading(true);
    try {
      const { data } = await api.get("/api/payment-method/get-payment-method");
      const active = (Array.isArray(data) ? data : []).filter(
        (x) => x?.isActive
      );

      setPaymentMethods(active);

      // default to Bank Transfer if exists, else first active
      const bank = active.find((x) =>
        String(x.name).toLowerCase().includes("bank")
      );
      const first = bank || active[0];
      if (first && !selectedPmName) setSelectedPmName(first.name);
    } catch (e) {
      console.error(e);
      setPaymentMethods([]);
    } finally {
      setPmLoading(false);
    }
  }

  React.useEffect(() => {
    loadPaymentMethods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const waMsg = React.useMemo(() => {
    const cartLines = items
      .map(
        (it) =>
          `- ${it.name} x${it.quantity} = ${formatMoney(
            Number(it.price) * it.quantity
          )}`
      )
      .join("\n");

    return (
      `Hi, I want to pay via CRYPTO. Please authorize my payment.\n\n` +
      `Name: ${form.fullName || "—"}\n` +
      `Phone: ${form.phone || "—"}\n` +
      `Email: ${form.email || "—"}\n` +
      `Location: ${
        [form.city, form.state].filter(Boolean).join(", ") || "Nigeria"
      }\n\n` +
      `Order summary:\n${cartLines}\n\n` +
      `Total: ${formatMoney(total)}\n\n` +
      `I understand I must be authorized before paying via crypto.`
    );
  }, [items, total, form]);

  async function placeOrder(e) {
    e.preventDefault();
    setError("");
    setStatus(null);

    if (items.length === 0) return setError("Your cart is empty.");
    if (!selectedPmName) return setError("Please select a payment method.");

    // crypto gate
    if (isCrypto) {
      setStatus({
        ok: false,
        cryptoGate: true,
        message:
          "Crypto payments require WhatsApp authorization. Chat with us first.",
      });
      return;
    }

    // required for guest
    if (!user && !form.email)
      return setError("Email is required for guest checkout.");

    // backend requires firstName + lastName always
    const { firstName, lastName } = splitName(form.fullName);
    if (!firstName || !lastName)
      return setError("Please enter your full name (first and last).");
    if (!form.phone) return setError("Phone is required.");

    setLoading(true);
    try {
      const payload = {
        items: items.map((x) => ({ productId: x.id, quantity: x.quantity })), // ✅ matches validator + controller
        shippingAddress: {
          fullName: form.fullName,
          phone: form.phone,
          address1: form.address1,
          city: form.city,
          state: form.state,
          country: form.country,
          notes: form.notes,
        },

        // ✅ controller expects these at top-level
        firstName,
        lastName,
        email: user?.email || form.email, // ✅ required
        phone: form.phone, // ✅ required

        // ✅ must match PaymentMethod.name exactly (e.g., "Bank Transfer")
        paymentMethod: selectedPmName,

        ...(user ? {} : { guestEmail: form.email }), // ✅ satisfies validator for guests
      };

      const { data } = await api.post("/api/orders/create-order", payload);

      if (selectedPmName === "Paystack") {
        if (!data?.paymentUrl) {
          setError("Paystack payment URL was not returned. Please try again.");
          return;
        }
        window.location.href = data.paymentUrl;
        return;
      }

      // Manual payments
      setStatus({ ok: true, data });
      clear();
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          (Array.isArray(err?.response?.data?.errors)
            ? err.response.data.errors?.[0]?.msg
            : null) ||
          err.message ||
          "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  }

  const details = safeJson(selectedPm?.details);

  return (
    <div className="container py-10">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div className="text-sm font-medium text-brand-orange">Checkout</div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
            Complete your purchase
          </h1>
          <p className="mt-2 text-slate-600">
            Fill in delivery details, choose payment, and place your order.
          </p>
        </div>
        <Link
          to="/cart"
          className="text-brand-orange font-medium hover:underline"
        >
          ← Back to cart
        </Link>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
        <form
          onSubmit={placeOrder}
          className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft"
        >
          {/* PAYMENT METHOD */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="font-semibold">Payment method</div>
            <div className="mt-1 text-sm text-slate-600">
              Bank Transfer: place order now, then notify payment. Crypto: chat
              first for authorization.
            </div>

            <div className="mt-3">
              {pmLoading ? (
                <div className="text-sm text-slate-600">
                  Loading payment methods…
                </div>
              ) : paymentMethods.length === 0 ? (
                <div className="text-sm text-amber-700">
                  No active payment methods available.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {paymentMethods.map((pm) => {
                    const active = pm.name === selectedPmName;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setSelectedPmName(pm.name)}
                        className={`text-left rounded-2xl border p-4 transition ${
                          active
                            ? "border-brand-orange bg-white shadow-soft"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="font-semibold">{pm.name}</div>
                        <div className="text-xs text-slate-600 mt-1">
                          {String(pm.name).toLowerCase().includes("crypto")
                            ? "Authorize via WhatsApp first"
                            : "Pay after placing order"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* DETAILS */}
            {selectedPmName ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold">Instructions</div>

                {isCrypto ? (
                  <>
                    <div className="mt-2 text-sm text-slate-600">
                      Crypto payments require authorization. Tap WhatsApp to
                      proceed.
                    </div>
                    <a
                      href={waLink(waMsg)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 text-white px-4 py-3 font-medium hover:bg-brand-orange transition shadow-soft"
                    >
                      Chat on WhatsApp for Crypto Authorization
                    </a>
                  </>
                ) : (
                  <div className="mt-2 text-sm text-slate-700 grid gap-2">
                    {details?.bankName ? (
                      <div>
                        <span className="text-slate-500">Bank:</span>{" "}
                        <b>{details.bankName}</b>
                      </div>
                    ) : null}
                    {details?.accountNumber ? (
                      <div>
                        <span className="text-slate-500">Account:</span>{" "}
                        <b>{details.accountNumber}</b>
                      </div>
                    ) : null}
                    {details?.Name ? (
                      <div>
                        <span className="text-slate-500">Name:</span>{" "}
                        <b>{details.Name}</b>
                      </div>
                    ) : null}
                    {details?.instructions ? (
                      <div className="text-xs text-slate-600">
                        <span className="font-semibold">Note:</span>{" "}
                        {details.instructions}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* GUEST EMAIL */}

          <div className="mt-4">
            <label className="text-sm text-slate-600">Email (required)</label>
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* NAME + PHONE */}
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm text-slate-600">
                Full name (required)
              </label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                placeholder="e.g. John Doe"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm text-slate-600">Phone (required)</label>
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                placeholder="+234..."
                required
              />
            </div>

            {/* ADDRESS */}
            <div className="sm:col-span-2">
              <label className="text-sm text-slate-600">
                Address (required)
              </label>
              <input
                name="address1"
                value={form.address1}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                placeholder="Street / house number"
                required
              />
            </div>

            <div>
              <label className="text-sm text-slate-600">City</label>
              <input
                name="city"
                value={form.city}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                placeholder="City"
              />
            </div>

            <div>
              <label className="text-sm text-slate-600">State</label>
              <input
                name="state"
                value={form.state}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                placeholder="State"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm text-slate-600">Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={onChange}
                rows={3}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                placeholder="Anything we should know?"
              />
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl bg-red-50 border border-red-100 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {status?.ok ? (
            <div className="mt-4 rounded-2xl bg-green-50 border border-green-100 p-3 text-sm text-green-700">
              Order placed successfully. Check your email for payment details
              and instructions.
            </div>
          ) : null}

          {status?.cryptoGate ? (
            <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
              {status.message}{" "}
              <a
                className="font-semibold underline"
                href={waLink(waMsg)}
                target="_blank"
                rel="noreferrer"
              >
                Chat now →
              </a>
            </div>
          ) : null}

          <button
            disabled={loading || pmLoading || !selectedPmName}
            className="mt-6 w-full rounded-2xl bg-brand-orange text-white px-6 py-3 font-medium hover:bg-brand-orangeDark transition shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCrypto
              ? "Chat on WhatsApp to authorize Crypto"
              : loading
              ? "Placing order…"
              : "Place order"}
          </button>

          <div className="mt-4 text-xs text-slate-500">
            Manual payments: place order → pay → notify → admin confirms.
          </div>
        </form>

        <aside className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft h-fit">
          <div className="font-semibold">Order summary</div>
          <div className="mt-4 grid gap-3">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-start justify-between gap-3 text-sm"
              >
                <div>
                  <div className="font-medium">{it.name}</div>
                  <div className="text-slate-500">Qty: {it.quantity}</div>
                </div>
                <div className="font-medium">
                  {formatMoney(Number(it.price) * it.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="h-px bg-slate-100 my-4" />
          <div className="flex items-center justify-between">
            <div className="font-semibold">Subtotal</div>
            <div className="font-semibold">{formatMoney(total)}</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
