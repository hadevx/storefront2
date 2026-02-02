import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "./Reveal";
import { Link } from "react-router-dom";
import { Tag, Flame, Clock, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useSelector } from "react-redux";

export default function DropBanner() {
  const language = useSelector((state) => state.language.lang);

  const labels =
    language === "ar"
      ? {
          chipLive: "متاح الآن",
          chipNext: "الإصدار القادم",
          chipLimited: "كميات محدودة",
          chipTime: "لفترة محدودة",
          titleLiveA: "الإصدار",
          titleLiveB: "متاح الآن",
          titleNextA: "قطع جديدة خلال",
          titleNextB: "ساعات",
          descLive: "وصلت تصاميم جديدة الآن. احجز مقاسك قبل النفاد.",
          descNext: "إصدار صغير ومنتقى. جهّز نفسك قبل وقت الإطلاق.",
          hours: "ساعات",
          min: "دقائق",
          sec: "ثواني",
          availableNow: "متاح الآن",
          availableHint: "اضغط “الجديد” لمشاهدة ما وصل للتو.",
          tip: "معلومة: المقاسات قد تنفد بسرعة — تابع المفضلة مبكرًا.",
          ctaNew: "الجديد",
          ctaSale: "التخفيضات",
          ctaBest: "الأكثر مبيعًا",
        }
      : {
          chipLive: "Live now",
          chipNext: "Next drop",
          chipLimited: "Limited quantities",
          chipTime: "Time-sensitive",
          titleLiveA: "The drop is",
          titleLiveB: "live",
          titleNextA: "New pieces land in",
          titleNextB: "hours",
          descLive: "Fresh styles are available right now. Grab your size before it’s gone.",
          descNext: "A small, curated release. Set a reminder and be ready when it opens.",
          hours: "Hours",
          min: "Min",
          sec: "Sec",
          availableNow: "Available now",
          availableHint: "Tap “New arrivals” to see what just landed.",
          tip: "Tip: sizes can move fast — check your favorites early.",
          ctaNew: "New arrivals",
          ctaSale: "Sale",
          ctaBest: "Best sellers",
        };

  // Set your next drop date/time here (demo +18 hours)
  const DROP_AT = useMemo(() => new Date(Date.now() + 1000 * 60 * 60 * 18), []);

  const [now, setNow] = useState(() => Date.now());

  // ✅ FIX: interval should be in useEffect (not useState)
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, DROP_AT.getTime() - now);

  const t = {
    h: String(Math.floor(diff / 36e5)).padStart(2, "0"),
    m: String(Math.floor((diff % 36e5) / 6e4)).padStart(2, "0"),
    s: String(Math.floor((diff % 6e4) / 1000)).padStart(2, "0"),
  };

  const isLive = diff === 0;

  const Arrow = language === "ar" ? ArrowLeft : ArrowRight;

  const Chip = ({ icon: Icon, text }) => (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
      <Icon className="h-4 w-4" />
      {text}
    </span>
  );

  const TimeBox = ({ label, value }) => (
    <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur">
      <div className="text-[10px] uppercase tracking-widest text-white/50">{label}</div>
      <div className="mt-1 text-2xl font-black tabular-nums text-white">{value}</div>
    </div>
  );

  return (
    <section
      dir={language === "ar" ? "rtl" : "ltr"}
      className="relative px-2 py-16 lg:py-24 overflow-hidden">
      <div className="container-custom px-4">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950 shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
            {/* Background treatment */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-28 -left-28 h-96 w-96 rounded-full border border-white/10 opacity-40" />
              <div className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full border border-white/10 opacity-30" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px] opacity-35" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
            </div>

            <div className="relative p-6 sm:p-8 lg:p-10">
              {/* Top row */}
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <Chip icon={Flame} text={isLive ? labels.chipLive : labels.chipNext} />
                    <Chip icon={Tag} text={labels.chipLimited} />
                    <Chip icon={Clock} text={labels.chipTime} />
                  </div>

                  <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
                    {isLive ? (
                      <>
                        {labels.titleLiveA}{" "}
                        <span className="italic font-light text-white/80">{labels.titleLiveB}</span>
                      </>
                    ) : (
                      <>
                        {labels.titleNextA}{" "}
                        <span className="italic font-light text-white/80">{labels.titleNextB}</span>
                      </>
                    )}
                  </h2>

                  <p className="mt-3 text-sm sm:text-base text-white/70 leading-relaxed">
                    {isLive ? labels.descLive : labels.descNext}
                  </p>
                </div>

                {/* Countdown / Live */}
                <div className="shrink-0">
                  <AnimatePresence mode="wait">
                    {isLive ? (
                      <motion.div
                        key="live"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                        <div className="flex items-center gap-2 text-white">
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          <span className="text-sm font-semibold">{labels.availableNow}</span>
                        </div>
                        <p className="mt-2 text-xs text-white/60">{labels.availableHint}</p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="countdown"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="grid grid-cols-3 gap-2">
                        <TimeBox label={labels.hours} value={t.h} />
                        <TimeBox label={labels.min} value={t.m} />
                        <TimeBox label={labels.sec} value={t.s} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Bottom actions */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-white/50">{labels.tip}</div>

                {/* ✅ Quick links (not "Shop all") */}
                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/all-products?sort=new"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/90 hover:bg-white/10 transition">
                    {labels.ctaNew}
                    <Arrow className={language === "ar" ? "mr-2 h-4 w-4" : "ml-2 h-4 w-4"} />
                  </Link>

                  <Link
                    to="/sale"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/90 hover:bg-white/10 transition">
                    {labels.ctaSale}
                    <Arrow className={language === "ar" ? "mr-2 h-4 w-4" : "ml-2 h-4 w-4"} />
                  </Link>

                  <Link
                    to="/all-products?sort=best"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/90 hover:bg-white/10 transition">
                    {labels.ctaBest}
                    <Arrow className={language === "ar" ? "mr-2 h-4 w-4" : "ml-2 h-4 w-4"} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
