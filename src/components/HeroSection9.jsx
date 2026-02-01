import { useEffect, useMemo, useState } from "react";

/**
 * Professional (non-infinite) Hero Clone
 * - No looping animations.
 * - Bars + line draw once on mount.
 * - Cleaner grid, axes labels, subtle markers.
 * - Revenue count-up once, sparkline draws once.
 */
export default function HeroClone() {
  const target = 54000;
  const [value, setValue] = useState(0);

  // one-time count up
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 950;

    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const features = useMemo(
    () => [
      { title: "إعداد سريع", desc: "اربط تطبيقك خلال دقائق بدون تعقيد." },
      { title: "تحليلات دقيقة", desc: "مقاييس واضحة تساعدك على اتخاذ القرار." },
      { title: "دفع آمن", desc: "حماية عالية للمعاملات وبيانات العملاء." },
      { title: "دعم عربي", desc: "مساعدة سريعة عبر الدردشة والبريد." },
    ],
    [],
  );

  return (
    <section
      dir="rtl"
      className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-6xl">
        {/* Top badge */}
        <div className="mb-6 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80">
            <span className="inline-block h-5 w-5 rounded-full border border-white/40 text-center text-xs leading-5">
              ↗
            </span>
            اشترك للحصول على ميزات متقدمة
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-center text-4xl md:text-5xl font-bold leading-tight">
          انضم إلى آلاف المطورين الذين <br />
          <span className="text-white">ينمون تطبيقاتهم معنا!</span>
        </h1>

        {/* Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left card: Users Growth */}
          <div className="relative rounded-3xl bg-[#E6E2F4] p-6 text-black overflow-hidden">
            <div className="absolute top-5 right-5 rounded-full bg-[#B8A9E9] px-3 py-1 text-xs font-semibold">
              نمو المستخدمين
            </div>

            {/* Detailed professional chart */}
            <div className="mt-10">
              <ProfessionalGrowthChart />
            </div>

            <div className="absolute bottom-6 left-6 rounded-xl bg-black text-white px-4 py-2 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
              <div className="text-xl font-bold">150%</div>
              <div className="text-xs text-white/70">زيادة سنوية</div>
            </div>
          </div>

          {/* Right card: Revenue */}
          <div className="relative rounded-3xl bg-[#E23A12] p-6 text-white overflow-hidden">
            <div className="absolute top-5 right-5 rounded-full bg-black/70 px-3 py-1 text-xs">
              أرباح حقيقية
            </div>

            {/* subtle background chart (professional) */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.22]">
              <ProfessionalRevenueBackground />
            </div>

            <div className="relative flex h-full items-center justify-center">
              <div className="rounded-2xl bg-black px-6 py-4 text-center shadow-[0_18px_55px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold tabular-nums">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-black">
                    +
                  </span>
                  {formatMoney(value)}
                </div>
                <div className="mt-1 text-sm text-white/70">الأرباح السنوية</div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/75">
                  <div className="rounded-full bg-white/10 px-3 py-1">معدل نمو 32٪</div>
                  <div className="rounded-full bg-white/10 px-3 py-1">تحويل 4.1٪</div>
                </div>
              </div>
            </div>

            <p className="absolute bottom-6 left-6 max-w-xs text-xs text-white/70">
              متوسط أرباح المطورين الذين يستخدمون منصتنا خلال 12 شهرًا.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 border border-white/10">
                  <span className="text-sm">✦</span>
                </div>
                <div className="text-sm font-semibold">{f.title}</div>
              </div>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* one-time animations + reduced motion */}
      <style>{`
        @media (prefers-reduced-motion: reduce){
          .barGrow, .lineDraw, .areaFade, .dotPop { animation: none !important; }
        }

        .areaFade { opacity: 0; animation: areaFade 420ms ease forwards; }
        @keyframes areaFade { to { opacity: 1; } }

        .lineDraw {
          stroke-dasharray: 1200;
          stroke-dashoffset: 1200;
          animation: lineDraw 900ms ease 80ms forwards;
        }
        @keyframes lineDraw { to { stroke-dashoffset: 0; } }

        .barGrow { transform-origin: bottom; transform: scaleY(0); animation: barGrow 680ms cubic-bezier(.2,.9,.2,1) forwards; }
        @keyframes barGrow { to { transform: scaleY(1); } }

        .dotPop { transform-origin: center; transform: scale(0.5); opacity: 0; animation: dotPop 420ms ease forwards; }
        @keyframes dotPop { to { transform: scale(1); opacity: 1; } }
      `}</style>
    </section>
  );
}

/* ---------------- Professional Growth Chart (SVG) ---------------- */

function ProfessionalGrowthChart() {
  // 3-year bars + line (professional styling)
  const points = [
    { year: "2022", v: 38 },
    { year: "2023", v: 62 },
    { year: "2024", v: 100 },
  ];

  // chart geometry
  const W = 520;
  const H = 260;
  const pad = { l: 54, r: 18, t: 14, b: 46 };
  const x0 = pad.l;
  const y0 = pad.t;
  const x1 = W - pad.r;
  const y1 = H - pad.b;

  const max = 100;
  const min = 0;

  const sx = (i) => x0 + (i * (x1 - x0)) / (points.length - 1);
  const sy = (v) => y1 - ((v - min) / (max - min || 1)) * (y1 - y0);

  const barW = 80;
  const barXs = points.map((_, i) => sx(i) - barW / 2);

  // line path through bar tops (slight smoothing with Q)
  const p0 = { x: sx(0), y: sy(points[0].v) };
  const p1 = { x: sx(1), y: sy(points[1].v) };
  const p2 = { x: sx(2), y: sy(points[2].v) };

  const lineD = [
    `M ${p0.x} ${p0.y}`,
    `Q ${p1.x} ${p1.y} ${(p1.x + p2.x) / 2} ${(p1.y + p2.y) / 2}`,
    `T ${p2.x} ${p2.y}`,
  ].join(" ");

  const areaD = `${lineD} L ${p2.x} ${y1} L ${p0.x} ${y1} Z`;

  const yTicks = [0, 25, 50, 75, 100];

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-black/90">نمو سنوي</div>
        <div className="text-xs text-black/60">آخر 3 سنوات</div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[260px]" aria-hidden="true">
        <defs>
          <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(0,0,0,0.16)" />
            <stop offset="1" stopColor="rgba(0,0,0,0.04)" />
          </linearGradient>
        </defs>

        {/* grid + y labels */}
        {yTicks.map((t) => {
          const y = sy(t);
          return (
            <g key={t}>
              <line x1={x0} y1={y} x2={x1} y2={y} stroke="rgba(0,0,0,0.10)" strokeWidth="1" />
              <text x={x0 - 10} y={y + 4} textAnchor="end" fontSize="11" fill="rgba(0,0,0,0.55)">
                {t}%
              </text>
            </g>
          );
        })}

        {/* axes */}
        <line x1={x0} y1={y0} x2={x0} y2={y1} stroke="rgba(0,0,0,0.18)" />
        <line x1={x0} y1={y1} x2={x1} y2={y1} stroke="rgba(0,0,0,0.18)" />

        {/* area (fade in once) */}
        <path d={areaD} fill="url(#areaG)" className="areaFade" />

        {/* bars (grow once with stagger) */}
        {points.map((p, i) => {
          const x = barXs[i];
          const yTop = sy(p.v);
          const h = y1 - yTop;

          return (
            <g key={p.year}>
              <rect
                x={x}
                y={yTop}
                width={barW}
                height={h}
                rx="14"
                fill={i === 2 ? "rgba(0,0,0,0.92)" : "rgba(0,0,0,0.28)"}
                className="barGrow"
                style={{ animationDelay: `${120 + i * 90}ms` }}
              />
              {/* value label on top */}
              <text
                x={x + barW / 2}
                y={yTop - 8}
                textAnchor="middle"
                fontSize="11"
                fill="rgba(0,0,0,0.70)">
                {p.v}%
              </text>
              {/* x label */}
              <text
                x={x + barW / 2}
                y={H - 18}
                textAnchor="middle"
                fontSize="12"
                fill="rgba(0,0,0,0.65)">
                {p.year}
              </text>
            </g>
          );
        })}

        {/* line draw once */}
        <path
          d={lineD}
          fill="none"
          stroke="rgba(0,0,0,0.65)"
          strokeWidth="3"
          className="lineDraw"
        />

        {/* markers pop once */}
        {[p0, p1, p2].map((pt, idx) => (
          <g key={idx} className="dotPop" style={{ animationDelay: `${720 + idx * 90}ms` }}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r="7"
              fill="rgba(230,226,244,0.95)"
              stroke="rgba(0,0,0,0.75)"
              strokeWidth="2"
            />
            <circle cx={pt.x} cy={pt.y} r="2.5" fill="rgba(0,0,0,0.75)" />
          </g>
        ))}
      </svg>

      <div className="mt-2 flex items-center justify-between text-xs text-black/60">
        <span>المصدر: تحليلات المنصة</span>
        <span>تحديث: هذا الشهر</span>
      </div>
    </div>
  );
}

/* ---------------- Professional Revenue Background (SVG) ---------------- */

function ProfessionalRevenueBackground() {
  // subtle grid + sparkline in the background, drawn once
  return (
    <svg className="h-full w-full" viewBox="0 0 800 520" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="revLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.85)" />
        </linearGradient>
      </defs>

      {/* grid */}
      <g opacity="0.35">
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={i}
            x1="60"
            y1={90 + i * 50}
            x2="760"
            y2={90 + i * 50}
            stroke="rgba(255,255,255,0.18)"
          />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={i}
            x1={70 + i * 70}
            y1="80"
            x2={70 + i * 70}
            y2="460"
            stroke="rgba(255,255,255,0.12)"
          />
        ))}
      </g>

      {/* sparkline (draw once) */}
      <path
        d="M70 380 C 150 330, 210 410, 290 340 S 440 270, 520 305 S 640 235, 730 205"
        stroke="url(#revLine)"
        strokeWidth="5"
        strokeLinecap="round"
        className="lineDraw"
      />

      {/* subtle points */}
      {[
        [70, 380],
        [290, 340],
        [520, 305],
        [730, 205],
      ].map(([x, y], i) => (
        <g key={i} className="dotPop" style={{ animationDelay: `${520 + i * 110}ms` }}>
          <circle cx={x} cy={y} r="8" fill="rgba(0,0,0,0.25)" />
          <circle cx={x} cy={y} r="4" fill="rgba(255,255,255,0.75)" />
        </g>
      ))}
    </svg>
  );
}

/* ---------------- utils ---------------- */

function formatMoney(n) {
  try {
    return `$${new Intl.NumberFormat("en-US").format(n)}`;
  } catch {
    return `$${String(n)}`;
  }
}
