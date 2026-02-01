import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "./Reveal";
import { Link } from "react-router-dom";
import { Tag, Flame, Clock, ArrowRight, CheckCircle2 } from "lucide-react";

/**
 * DropBanner
 * A totally different landing component:
 * - "Drop" style announcement card (dark, editorial)
 * - Small countdown (client-side)
 * - Quick links (NOT "Shop all")
 * - Minimal + premium, consistent with your motion vibe
 */
export default function DropBanner() {
  // Set your next drop date/time here
  const DROP_AT = useMemo(() => new Date(Date.now() + 1000 * 60 * 60 * 18), []); // +18 hours demo

  const [now, setNow] = useState(() => Date.now());
  useState(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  });

  const diff = Math.max(0, DROP_AT.getTime() - now);

  const t = {
    h: String(Math.floor(diff / 36e5)).padStart(2, "0"),
    m: String(Math.floor((diff % 36e5) / 6e4)).padStart(2, "0"),
    s: String(Math.floor((diff % 6e4) / 1000)).padStart(2, "0"),
  };

  const isLive = diff === 0;

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
    <section className="relative px-2 py-16 lg:py-24 overflow-hidden">
      <div className="container-custom px-4">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950 shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
            {/* Different background treatment (rings + noise-like dots) */}
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
                    <Chip icon={Flame} text={isLive ? "Live now" : "Next drop"} />
                    <Chip icon={Tag} text="Limited quantities" />
                    <Chip icon={Clock} text="Time-sensitive" />
                  </div>

                  <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
                    {isLive ? (
                      <>
                        The drop is <span className="italic font-light text-white/80">live</span>
                      </>
                    ) : (
                      <>
                        New pieces land in{" "}
                        <span className="italic font-light text-white/80">hours</span>
                      </>
                    )}
                  </h2>

                  <p className="mt-3 text-sm sm:text-base text-white/70 leading-relaxed">
                    {isLive
                      ? "Fresh styles are available right now. Grab your size before it’s gone."
                      : "A small, curated release. Set a reminder and be ready when it opens."}
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
                          <span className="text-sm font-semibold">Available now</span>
                        </div>
                        <p className="mt-2 text-xs text-white/60">
                          Tap “New arrivals” to see what just landed.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="countdown"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="grid grid-cols-3 gap-2">
                        <TimeBox label="Hours" value={t.h} />
                        <TimeBox label="Min" value={t.m} />
                        <TimeBox label="Sec" value={t.s} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Bottom actions */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-white/50">
                  Tip: sizes can move fast — check your favorites early.
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
