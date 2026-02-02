import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, Truck, ShieldCheck, RotateCcw, ChevronRight, ChevronLeft } from "lucide-react";
import Reveal from "./Reveal";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function TrustHighlights() {
  const language = useSelector((state) => state.language.lang);

  const t = useMemo(() => {
    return language === "ar"
      ? {
          topLabel: "ثقة مبنية في الكويت",
          titleA: "بسيط. فاخر.",
          titleB: "موثوق.",
          desc: "كل ما تحتاجه لتجربة تسوق سلسة — بدون ضجيج، فقط جودة.",
          customersSay: "آراء العملاء",
          ctaQuestion: "جاهز لتسوق أحدث المنتجات؟",
          shopNow: "تسوق الآن",
          builtFor: "مصمم للاستخدام اليومي",
          stats: [
            ["التوصيل", "سريع داخل الكويت"],
            ["المقاس", "مطابق للمقاس"],
            ["الدعم", "ردود سريعة"],
            ["الاستبدال", "استبدال سهل"],
          ],
          highlights: [
            {
              id: "quality",
              title: "جودة فاخرة",
              desc: "خياطة نظيفة. خامات أفضل.",
              icon: BadgeCheck,
            },
            {
              id: "delivery",
              title: "توصيل سريع",
              desc: "شحن سريع داخل الكويت.",
              icon: Truck,
            },
            {
              id: "secure",
              title: "دفع آمن",
              desc: "مدفوعات موثوقة وخصوصية.",
              icon: ShieldCheck,
            },
            {
              id: "returns",
              title: "استبدال سهل",
              desc: "تبديل مقاس ودعم بسيط.",
              icon: RotateCcw,
            },
          ],
          testimonials: [
            { id: "t1", quote: "مقاس ممتاز وخامة فاخرة.", name: "أحمد", meta: "مدينة الكويت" },
            { id: "t2", quote: "تصميم بسيط وجودة قوية.", name: "سارة", meta: "السالمية" },
            { id: "t3", quote: "الاستبدال كان سهل جدًا.", name: "فهد", meta: "حولي" },
          ],
        }
      : {
          topLabel: "Trust built in Kuwait",
          titleA: "Simple. Premium.",
          titleB: "Reliable.",
          desc: "Everything you need for a smooth shopping experience — no noise, just quality.",
          customersSay: "Customers say",
          ctaQuestion: "Ready to shop the latest drops?",
          shopNow: "Shop now",
          builtFor: "Built for everyday wear",
          stats: [
            ["Delivery", "Fast in Kuwait"],
            ["Fit", "True to size"],
            ["Support", "Quick replies"],
            ["Returns", "Easy exchange"],
          ],
          highlights: [
            {
              id: "quality",
              title: "Premium quality",
              desc: "Clean stitching. Better fabrics.",
              icon: BadgeCheck,
            },
            {
              id: "delivery",
              title: "Fast delivery",
              desc: "Quick dispatch in Kuwait.",
              icon: Truck,
            },
            {
              id: "secure",
              title: "Secure checkout",
              desc: "Trusted payments & privacy.",
              icon: ShieldCheck,
            },
            {
              id: "returns",
              title: "Easy exchanges",
              desc: "Simple size swaps & support.",
              icon: RotateCcw,
            },
          ],
          testimonials: [
            { id: "t1", quote: "Perfect fit. Feels premium.", name: "Ahmed", meta: "Kuwait City" },
            { id: "t2", quote: "Minimal design, maximum quality.", name: "Sara", meta: "Salmiya" },
            { id: "t3", quote: "Exchange was effortless.", name: "Fahad", meta: "Hawally" },
          ],
        };
  }, [language]);

  const HIGHLIGHTS = t.highlights;
  const TESTIMONIALS = t.testimonials;

  const [active, setActive] = useState(TESTIMONIALS[0].id);

  const activeTestimonial = useMemo(
    () => TESTIMONIALS.find((x) => x.id === active) || TESTIMONIALS[0],
    [active, TESTIMONIALS],
  );

  const Chevron = language === "ar" ? ChevronLeft : ChevronRight;

  return (
    <section
      dir={language === "ar" ? "rtl" : "ltr"}
      className="relative overflow-hidden px-2 py-16 sm:py-20 lg:py-28">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-neutral-50 to-white" />
        <div className="absolute left-1/2 top-[-140px] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-neutral-200/55 blur-3xl" />
        <div className="absolute right-[-140px] bottom-[-140px] h-[360px] w-[360px] rounded-full bg-neutral-100 blur-3xl" />
      </div>

      <div className="container-custom px-4 sm:px-6">
        {/* Header */}
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold tracking-[0.22em] uppercase text-neutral-500">
              {t.topLabel}
            </p>

            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-neutral-950">
              {t.titleA} <span className="italic font-light text-neutral-800">{t.titleB}</span>
            </h2>

            <p className="mt-4 text-neutral-600 leading-relaxed">{t.desc}</p>
          </div>
        </Reveal>

        {/* Cards + Quote */}
        <div className="mt-10 lg:mt-14 grid gap-6 lg:grid-cols-12">
          {/* Left: feature grid */}
          <div className="lg:col-span-7">
            <Reveal delay={0.05}>
              <div className="grid gap-4 sm:grid-cols-2">
                {HIGHLIGHTS.map((h) => {
                  const Icon = h.icon;
                  return (
                    <motion.div
                      key={h.id}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                      className="group relative rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur shadow-sm">
                      <div className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-2xl border border-neutral-200 bg-neutral-50 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-neutral-950" />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-neutral-950">{h.title}</h3>
                            <p className="mt-1 text-sm text-neutral-600">{h.desc}</p>
                          </div>
                        </div>

                        <div className="mt-5 h-px w-full bg-neutral-200/80" />
                        <div className="mt-3 text-xs font-semibold text-neutral-500">
                          {t.builtFor}
                        </div>
                      </div>

                      {/* glow on hover */}
                      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition">
                        <div className="absolute -inset-10 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.08),transparent_55%)]" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Reveal>

            {/* Stats strip */}
            <Reveal delay={0.08}>
              <div className="mt-6 rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur shadow-sm">
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-neutral-200">
                  {t.stats.map(([k, v]) => (
                    <div key={k} className="p-4">
                      <div className="text-[11px] text-neutral-500">{k}</div>
                      <div className="mt-1 text-sm font-semibold text-neutral-950">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: testimonial + CTA */}
          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-950 text-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                  <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
                </div>

                <div className="relative p-6 sm:p-7">
                  <div className="text-xs font-semibold tracking-[0.22em] uppercase text-white/70">
                    {t.customersSay}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTestimonial.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.22 }}
                      className="mt-4">
                      <p className="text-xl sm:text-2xl font-semibold leading-snug">
                        “{activeTestimonial.quote}”
                      </p>

                      <p className="mt-4 text-sm text-white/75">
                        <span className="font-semibold text-white">{activeTestimonial.name}</span> •{" "}
                        {activeTestimonial.meta}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-6 flex gap-2">
                    {TESTIMONIALS.map((x) => (
                      <button
                        key={x.id}
                        type="button"
                        onClick={() => setActive(x.id)}
                        className={`h-2.5 rounded-full transition-all ${
                          x.id === active ? "w-8 bg-white" : "w-2.5 bg-white/30 hover:bg-white/50"
                        }`}
                        aria-label={`Show testimonial from ${x.name}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative border-t border-white/10 p-6 sm:p-7">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-white/75">{t.ctaQuestion}</p>

                    <Link
                      to="/all-products"
                      className="inline-flex w-fit items-center justify-center rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-100 transition">
                      {t.shopNow}
                      <Chevron className={language === "ar" ? "mr-1 h-4 w-4" : "ml-1 h-4 w-4"} />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
