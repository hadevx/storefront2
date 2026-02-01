import React from "react";

/**
 * Hero clone (React + Tailwind) for the provided reference:
 * - Left: clean white copy + CTA
 * - Top: logo + Contact us, Menu pill, Support pill
 * - Right: green rounded panel with dotted globe + orbit lines + badges
 *
 * Drop into a page that already has Tailwind configured.
 */
export default function DisputeAiHeroClone() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Top nav */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="font-semibold tracking-tight text-zinc-900">RCOIR</div>
            <a href="#" className="text-xs text-zinc-500 hover:text-zinc-900 transition">
              • Contact us
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-full bg-emerald-900/90 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-900 transition">
              Menu ↗
            </button>
            <button className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 transition">
              Support ↗
            </button>
          </div>
        </header>

        {/* Hero */}
        <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          {/* Left copy */}
          <div>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-zinc-900 sm:text-5xl">
              Empowering Dispute <br />
              Management Through <br />
              Advanced AI Solutions
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-zinc-500">
              Harnessing Predictive AI to Streamline Chargeback Management and Enhance Business
              Efficiency.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button className="rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-950 transition">
                Get Started Today →
              </button>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 bg-white">
                  ⓘ
                </span>
                Discover How We Can Help You
              </div>
            </div>
          </div>

          {/* Right visual panel */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[28px] bg-[#173B16] shadow-[0_28px_80px_rgba(0,0,0,0.12)] ring-1 ring-black/5">
              {/* soft glows */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-lime-200/10 blur-3xl" />
                <div className="absolute -right-28 bottom-[-120px] h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/30" />
              </div>

              {/* globe */}
              <div className="relative p-8">
                <div className="relative mx-auto aspect-square w-full max-w-[420px]">
                  <GlobeSVG />
                  {/* pins */}
                  <Pin style={{ left: "34%", top: "48%" }} />
                  <Pin style={{ left: "63%", top: "37%" }} />
                  <Pin style={{ left: "52%", top: "62%" }} />
                </div>

                {/* bottom badge */}
                <div className="mt-6 flex items-center justify-between rounded-2xl bg-black/25 px-4 py-3 text-white backdrop-blur ring-1 ring-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[
                        "https://i.pravatar.cc/80?img=12",
                        "https://i.pravatar.cc/80?img=32",
                        "https://i.pravatar.cc/80?img=47",
                      ].map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt={`client ${i + 1}`}
                          className="h-8 w-8 rounded-full ring-2 ring-[#173B16] object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                    <div className="text-xs text-white/85">
                      Over <span className="font-semibold text-white">90%</span> of clients
                    </div>
                  </div>

                  <button className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/15 hover:bg-white/15 transition">
                    Learn more →
                  </button>
                </div>
              </div>
            </div>

            {/* tiny floating card (optional like ref vibe) */}
            <div className="absolute -bottom-5 left-6 hidden rounded-2xl bg-white px-4 py-3 text-xs text-zinc-700 shadow-lg ring-1 ring-black/5 sm:block">
              Trusted by growing teams
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------- Visual helpers ----------------- */

function Pin({ style }) {
  return (
    <div
      style={style}
      className="absolute grid h-8 w-8 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur">
      <div className="h-2.5 w-2.5 rounded-full bg-white" />
    </div>
  );
}

function GlobeSVG() {
  return (
    <svg
      viewBox="0 0 520 520"
      className="absolute inset-0 h-full w-full"
      fill="none"
      aria-hidden="true">
      <defs>
        <radialGradient
          id="g1"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(260 220) rotate(90) scale(260)">
          <stop stopColor="rgba(255,255,255,0.18)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.02)" />
        </radialGradient>

        {/* dot pattern */}
        <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.35)" />
        </pattern>

        <mask id="globeMask">
          <circle cx="260" cy="260" r="200" fill="white" />
        </mask>

        <linearGradient
          id="orbit"
          x1="70"
          y1="140"
          x2="470"
          y2="380"
          gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(255,255,255,0.05)" />
          <stop offset="0.5" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.08)" />
        </linearGradient>
      </defs>

      {/* globe base */}
      <circle cx="260" cy="260" r="206" fill="url(#g1)" opacity="0.9" />
      <circle cx="260" cy="260" r="206" stroke="rgba(255,255,255,0.10)" />

      {/* latitude lines */}
      {[-120, -70, -20, 30, 80, 130].map((dy, i) => (
        <ellipse
          key={i}
          cx="260"
          cy={260 + dy * 0.45}
          rx={180 - Math.abs(dy) * 0.5}
          ry={55 - Math.abs(dy) * 0.12}
          stroke="rgba(255,255,255,0.10)"
        />
      ))}

      {/* longitude lines */}
      {[0, 25, 50, 75, 100, 125, 150].map((a, i) => (
        <ellipse
          key={i}
          cx="260"
          cy="260"
          rx="72"
          ry="200"
          transform={`rotate(${a} 260 260)`}
          stroke="rgba(255,255,255,0.08)"
        />
      ))}

      {/* dotted land / data mask */}
      <g mask="url(#globeMask)" opacity="0.55">
        <rect x="60" y="60" width="400" height="400" fill="url(#dots)" />
        {/* extra vignette */}
        <circle cx="260" cy="260" r="200" fill="rgba(0,0,0,0.18)" />
      </g>

      {/* orbit lines */}
      <path
        d="M70 210 C 150 140, 250 110, 350 140 C 430 164, 465 220, 470 260 C 475 310, 440 360, 350 380 C 260 402, 160 390, 100 340"
        stroke="url(#orbit)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M95 160 C 170 90, 280 70, 380 110 C 460 142, 500 220, 485 295 C 465 390, 320 440, 210 410 C 150 395, 100 350, 80 290"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* small orbit nodes */}
      {[
        [150, 150],
        [390, 140],
        [420, 320],
        [190, 410],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="7" fill="rgba(255,255,255,0.10)" />
          <circle cx={x} cy={y} r="2.5" fill="rgba(255,255,255,0.75)" />
        </g>
      ))}
    </svg>
  );
}
