import React from "react";
import Layout from "../../Layout";
import { Sparkles, ShieldCheck, Truck, RotateCcw, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  const values = [
    {
      icon: Sparkles,
      title: "Premium essentials",
      desc: "Clean silhouettes, quality fabrics, and timeless pieces you’ll re-wear all year.",
    },
    {
      icon: ShieldCheck,
      title: "Trusted & secure",
      desc: "Secure checkout and reliable support—your experience always comes first.",
    },
    {
      icon: HeartHandshake,
      title: "Made for you",
      desc: "We curate with intention—fits, colors, and comfort designed for modern life.",
    },
  ];

  const perks = [
    { icon: Truck, title: "Fast delivery", desc: "Quick dispatch across Kuwait." },
    { icon: RotateCcw, title: "Easy exchanges", desc: "Hassle-free size swaps." },
    { icon: ShieldCheck, title: "Secure payments", desc: "Protected checkout experience." },
  ];

  return (
    <Layout>
      {/* 🔒 Prevent horizontal scroll */}
      <div className="relative mt-[70px] min-h-screen overflow-x-hidden">
        {/* Background blobs (SAFE) */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-neutral-50 to-white" />

          {/* CENTER BLUR */}
          <div className="absolute left-1/2 top-16 h-72 w-[90vw] max-w-[700px] -translate-x-1/2 rounded-full bg-neutral-200/45 blur-3xl" />

          {/* RIGHT BLUR */}
          <div className="absolute right-0 top-80 h-64 w-64 translate-x-1/2 rounded-full bg-neutral-200/30 blur-3xl" />
        </div>

        <div className="container-custom px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          {/* HERO */}
          <section className="rounded-[28px] border border-neutral-200 bg-white/80 backdrop-blur shadow-sm overflow-hidden">
            <div className="p-6 sm:p-10 lg:p-12 max-w-full">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700">
                  <Sparkles className="h-4 w-4" />
                  About our Store
                </div>

                <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-neutral-950">
                  Minimal fashion. <span className="italic font-light">Maximum confidence.</span>
                </h1>

                <p className="mt-4 text-neutral-600 leading-relaxed">
                  Our store is built around everyday essentials—pieces that feel premium, fit right,
                  and stay timeless. We focus on quality, comfort, and a smooth shopping experience.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    to="/all-products"
                    className="inline-flex items-center justify-center rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-900 transition">
                    Shop collection
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition">
                    Contact us
                  </Link>
                </div>

                {/* STATS */}
                <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { k: "Quality", v: "Premium fabrics" },
                    { k: "Delivery", v: "Fast dispatch" },
                    { k: "Support", v: "Always responsive" },
                    { k: "Style", v: "Clean & modern" },
                  ].map((s) => (
                    <div key={s.k} className="rounded-2xl border border-neutral-200 bg-white p-4">
                      <div className="text-sm font-semibold text-neutral-950">{s.k}</div>
                      <div className="mt-1 text-xs text-neutral-600">{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PERKS */}
            <div className="border-t border-neutral-200 bg-neutral-50/70">
              <div className="grid sm:grid-cols-3">
                {perks.map((p, idx) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.title}
                      className={`p-6 sm:p-7 ${idx !== 0 ? "sm:border-l border-neutral-200" : ""}`}>
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 bg-white">
                        <Icon className="h-5 w-5 text-neutral-900" />
                      </div>
                      <div className="mt-4 text-base font-semibold text-neutral-950">{p.title}</div>
                      <p className="mt-2 text-sm text-neutral-600">{p.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* VALUES */}
          <section className="mt-12">
            <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-950">
              What we stand for
            </h2>
            <p className="mt-2 text-neutral-600">
              Simple principles that guide every product we ship.
            </p>

            <div className="mt-6 grid md:grid-cols-3 gap-4 sm:gap-6">
              {values.map((v) => {
                const Icon = v.icon;
                return (
                  <div
                    key={v.title}
                    className="rounded-3xl border border-neutral-200 bg-white shadow-sm p-6 hover:shadow-md transition">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
                      <Icon className="h-5 w-5 text-neutral-900" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-neutral-950">{v.title}</h3>
                    <p className="mt-2 text-sm text-neutral-600">{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* CTA */}
          <section className="mt-14">
            <div className="rounded-[28px] bg-neutral-950 px-6 sm:px-10 py-10 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2),transparent_55%)]" />
              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                  <div className="text-sm font-semibold text-white/80">Ready to refresh?</div>
                  <div className="mt-2 text-2xl sm:text-3xl font-semibold">
                    Explore the latest drop.
                  </div>
                  <p className="mt-2 text-white/75 max-w-xl">
                    Find pieces you’ll wear on repeat—minimal, modern, and made to last.
                  </p>
                </div>

                <Link
                  to="/all-products"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 hover:bg-white/90 transition">
                  Shop now
                </Link>
              </div>
            </div>
          </section>

          <div className="mt-10 text-center text-sm text-neutral-500">
            Thanks for choosing WEBSCHEMA Store — we’re happy you’re here.
          </div>
        </div>
      </div>
    </Layout>
  );
}
