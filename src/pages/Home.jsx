import React from "react";
import { Link } from "react-router-dom";
import HeroVideo from "../assets/Brown Modern House Tour YouTube Intro Video.mp4";
import { BatteryCharging, ShieldCheck, Truck, Wrench } from "lucide-react";
import { SectionTitle, Pill } from "../components/UI.jsx";
import api from "../api/client.js";

const features = [
  {
    icon: ShieldCheck,
    title: "Original & verified",
    desc: "Get genuine solar components with clear specs and warranty.",
  },
  {
    icon: Wrench,
    title: "Expert support",
    desc: "Sizing help for panels, inverters, batteries, and accessories.",
  },
  {
    icon: Truck,
    title: "Fast delivery",
    desc: "We package properly and deliver quickly within your coverage.",
  },
  {
    icon: BatteryCharging,
    title: "Smart bundles",
    desc: "Ready-to-install bundles for homes, shops, and offices.",
  },
];

export default function Home() {
  const [categories, setCategories] = React.useState([]);
  const [loadingCats, setLoadingCats] = React.useState(true);
  const [catError, setCatError] = React.useState("");
  const [featured, setFeatured] = React.useState([]);
  const [loadingFeatured, setLoadingFeatured] = React.useState(true);
  const [featuredError, setFeaturedError] = React.useState("");

  const apiBase = (
    import.meta.env.VITE_API_URL || "https://crown-backend-xr16.onrender.com"
  ).replace(/\/$/, "");

  function resolveImage(img) {
    if (!img) return null;
    return img.startsWith("http") ? img : `${apiBase}${img}`;
  }

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingCats(true);
        setCatError("");

        // Common patterns:
        // 1) GET /api/categories
        // 2) response: { categories: [...] } OR { data: [...] } OR [...]
        const res = await api.get("/api/categories");

        const payload = res?.data;
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.categories)
          ? payload.categories
          : Array.isArray(payload?.data)
          ? payload.data
          : [];

        if (mounted) setCategories(list);
      } catch (e) {
        if (mounted)
          setCatError(
            e?.response?.data?.message ||
              e?.message ||
              "Failed to load categories"
          );
      } finally {
        if (mounted) setLoadingCats(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingFeatured(true);
        setFeaturedError("");

        // Your backend: getProducts supports page & limit
        const res = await api.get("/api/products/get-product", {
          params: { featuredOnly: true, page: 1, limit: 12 },
        });

        const list = res?.data?.products || [];
        if (mounted) setFeatured(list);
      } catch (e) {
        if (mounted)
          setFeaturedError(
            e?.response?.data?.error ||
              e?.message ||
              "Failed to load featured products"
          );
      } finally {
        if (mounted) setLoadingFeatured(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Helper: choose the best key to filter products by category
  // Prefer slug if you have it; else fallback to name; else id.
  const getCategoryQuery = (c) => c?.slug || c?.name || c?._id || c?.id;

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.12),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(249,115,22,0.08),transparent_40%)]" />
        <div className="container relative py-14 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <Pill>Inverters + Batteries • Modern solutions</Pill>
              <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight">
                Power your home with{" "}
                <span className="gradient-text">reliable solar</span>.
              </h1>
              <p className="mt-4 text-slate-600 text-lg max-w-xl">
                Shop solar panels, inverters, batteries, and accessories. Clean
                UI, quick search, and a smooth checkout.
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
                  Get Quote
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
                <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
                  <div className="text-2xl font-semibold">
                    {categories?.length || 0}+
                  </div>
                  <div className="text-xs text-slate-600">Categories</div>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
                  <div className="text-2xl font-semibold">24/7</div>
                  <div className="text-xs text-slate-600">Support</div>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
                  <div className="text-2xl font-semibold">Secure</div>
                  <div className="text-xs text-slate-600">Payments</div>
                </div>
              </div>
            </div>

            <div className="lg:pl-10">
              <div className="rounded-3xl border border-slate-100 bg-white shadow-soft overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <SectionTitle
                    eyebrow="How it works"
                    title="Simple, fast buying experience"
                    subtitle="Designed to help customers choose the right setup quickly."
                  />
                </div>
                <div className="p-6 grid gap-4">
                  {features.map((f) => {
                    const Icon = f.icon;
                    return (
                      <div
                        key={f.title}
                        className="flex gap-3 rounded-2xl border border-slate-100 p-4 hover:bg-slate-50 transition"
                      >
                        <div className="h-10 w-10 rounded-2xl bg-brand-orange/10 text-brand-orange grid place-items-center">
                          <Icon size={18} />
                        </div>
                        <div>
                          <div className="font-semibold">{f.title}</div>
                          <div className="text-sm text-slate-600">{f.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 rounded-3xl bg-slate-900 text-white p shadow-soft">
                <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black">
                  <video
                    className="w-full aspect-video object-cover rounded-2xl"
                    src={HeroVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster="/videos/dealer-tip-poster.jpg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REAL CATEGORIES */}
      <section className="container py-14">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionTitle
            eyebrow="Featured"
            title="Popular solar categories"
            subtitle="Panels, inverters, batteries, and everything you need for a complete setup."
          />
          <Link
            to="/products"
            className="text-brand-orange font-medium hover:underline"
          >
            Shop now →
          </Link>
        </div>

        <div className="mt-8">
          {loadingCats ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft animate-pulse"
                >
                  <div className="h-3 w-20 bg-slate-200 rounded" />
                  <div className="mt-3 h-4 w-40 bg-slate-200 rounded" />
                  <div className="mt-4 h-3 w-full bg-slate-200 rounded" />
                  <div className="mt-2 h-3 w-5/6 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          ) : catError ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
              {catError}
            </div>
          ) : categories.length === 0 ? (
            <div className="rounded-3xl border border-slate-100 bg-white p-6 text-slate-600">
              No categories found yet. Add categories in Admin → Categories.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.slice(0, 8).map((c) => (
                <Link
                  key={c._id || c.id || c.slug || c.name}
                  to={`/products?categoryId=${encodeURIComponent(c.id)}`}
                  className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-soft hover:shadow-md transition"
                >
                  <div className="text-sm text-slate-500">Category</div>
                  <div className="mt-1 font-semibold group-hover:text-brand-orange transition">
                    {c.name}
                  </div>
                  <div className="mt-3 text-sm text-slate-600">
                    Browse {String(c.name || "").toLowerCase()} with clear specs
                    and pricing.
                  </div>
                  <div className="mt-4 text-brand-orange font-medium">
                    View →
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container pb-16">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionTitle
            eyebrow="Trending"
            title="Featured products"
            subtitle="Fresh arrivals and best picks—ready to order."
          />
          <Link
            to="/products"
            className="text-brand-orange font-medium hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="mt-8">
          {loadingFeatured ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-slate-100 bg-white p-4 shadow-soft animate-pulse"
                >
                  <div className="aspect-[4/3] rounded-2xl bg-slate-200" />
                  <div className="mt-4 h-4 w-3/4 bg-slate-200 rounded" />
                  <div className="mt-2 h-3 w-1/2 bg-slate-200 rounded" />
                  <div className="mt-4 h-9 w-full bg-slate-200 rounded-2xl" />
                </div>
              ))}
            </div>
          ) : featuredError ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
              {featuredError}
            </div>
          ) : featured.length === 0 ? (
            <div className="rounded-3xl border border-slate-100 bg-white p-6 text-slate-600">
              No products yet. Add products in Admin → Products.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featured.map((p) => {
                const rawImg =
                  p?.ProductImages?.[0]?.imageUrl ||
                  p?.ProductImage?.[0]?.imageUrl ||
                  p?.images?.[0] ||
                  null;

                const img = resolveImage(rawImg);

                const price = Number(p?.price || 0);
                const catName = p?.Category?.name || p?.category?.name || "";

                return (
                  <Link
                    key={p.id}
                    to={`/products/${p.id}`}
                    className="group rounded-3xl border border-slate-100 bg-white p-4 shadow-soft hover:shadow-md transition"
                  >
                    <div className="aspect-[4/3] rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden grid place-items-center">
                      {img ? (
                        <img
                          src={img}
                          alt={p.name}
                          className="h-full w-full object-cover group-hover:scale-[1.02] transition"
                          loading="lazy"
                        />
                      ) : (
                        <div className="text-slate-400 text-sm">No image</div>
                      )}
                    </div>

                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold leading-snug truncate">
                          {p.name}
                        </div>
                        <div className="mt-1 text-xs text-slate-500 truncate">
                          {catName ? catName : "—"}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="font-semibold text-brand-orange">
                          ₦{price.toLocaleString("en-NG")}
                        </div>
                        {p.stock !== undefined && (
                          <div className="mt-1 text-xs text-slate-500">
                            {p.stock > 0
                              ? `${p.stock} in stock`
                              : "Out of stock"}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="rounded-2xl bg-slate-900 text-white text-sm py-2 text-center group-hover:bg-brand-orange transition">
                        View details
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-16">
        <div className="rounded-3xl border border-slate-100 bg-[linear-gradient(135deg,rgba(249,115,22,0.18),rgba(255,255,255,1)_55%)] p-8 sm:p-10 shadow-soft">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-sm font-medium text-brand-orange">
                Ready to switch?
              </div>
              <h3 className="mt-2 text-2xl sm:text-3xl font-semibold">
                Let's connect you to a more reliable energy source.
              </h3>
              <p className="mt-2 text-slate-600 max-w-xl">
                You're just a few clicks away from exploring our wide range of
                solar products and solutions tailored to your needs.
              </p>
            </div>
            <Link
              to="/products"
              className="rounded-2xl bg-brand-orange text-white px-6 py-3 font-medium hover:bg-brand-orangeDark transition shadow-soft text-center"
            >
              Shop solar products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

