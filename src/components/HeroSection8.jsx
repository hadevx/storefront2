import React, { useMemo, useState } from "react";

export default function ClothingHeroArabic() {
  const [size, setSize] = useState("M");
  const [color, setColor] = useState("أونيكس");

  const colors = useMemo(
    () => [
      { name: "أونيكس", swatch: "bg-neutral-900" },
      { name: "سيج", swatch: "bg-emerald-900" },
      { name: "طين", swatch: "bg-orange-900" },
      { name: "ثلج", swatch: "bg-slate-200" },
    ],
    [],
  );

  const sizes = useMemo(() => ["XS", "S", "M", "L", "XL"], []);

  return (
    <section dir="rtl" className="relative w-full overflow-hidden bg-neutral-950 text-white">
      {/* خلفية نقطية */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.22) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          backgroundPosition: "0 0",
        }}
      />
      {/* تظليل + توهج */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 520px at 55% 45%, rgba(255,255,255,0.07), transparent 60%), radial-gradient(700px 520px at 40% 60%, rgba(249,115,22,0.12), transparent 55%), radial-gradient(900px 520px at 50% 65%, rgba(0,0,0,0.2), rgba(0,0,0,0.8) 70%)",
        }}
      />

      <div className="relative mx-auto grid min-h-[100svh] max-w-6xl grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-2">
        {/* اليمين: النص */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/80 ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            إصدار جديد • أساسيات شتوية مختارة
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            أناقة بسيطة… جودة تُلاحظ من أول لمسة
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
            قطع يومية بلمسة فاخرة: تيشيرتات، هوديز، بناطيل، ومعاطف تُنسّق بسهولة وتدوم طويلًا. خامات
            ممتازة وقصّات دقيقة تمنحك مظهرًا مرتبًا بدون مجهود.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
              تسوّق المجموعة
            </button>
            <button className="rounded-2xl bg-white/5 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/12 hover:bg-white/10 transition">
              استكشف الإطلالات
            </button>

            <div className="ml-0 flex items-center gap-2 sm:ml-2">
              <div className="flex -space-x-2">
                {[
                  "https://i.pravatar.cc/80?img=12",
                  "https://i.pravatar.cc/80?img=32",
                  "https://i.pravatar.cc/80?img=47",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`عميل ${i + 1}`}
                    className="h-8 w-8 rounded-full bg-white/10 ring-2 ring-neutral-950 object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>

              <div className="text-xs text-white/65">
                موثوق من <span className="text-white/85">+12,000</span> عميل
              </div>
            </div>
          </div>

          {/* معلومات سريعة */}
          <div className="mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
            <SelectPill label="الفئة" value="ملابس خارجية" />
            <SelectPill label="الشحن" value="مجاني فوق 5 د.ك" />
            <SelectPill label="الاسترجاع" value="خلال 30 يوم" />
          </div>
        </div>

        {/* اليسار: العرض */}
        <div className="relative mx-auto h-[760px] w-[520px] max-w-full">
          {/* فقاعة صغيرة */}
          <div className="absolute left-6 top-28 h-10 w-10 rounded-full bg-white/10 backdrop-blur-xl ring-1 ring-white/15 shadow-[0_14px_40px_rgba(0,0,0,0.5)]">
            <div className="grid h-full w-full place-items-center">
              <div className="h-6 w-6 rounded-full bg-white/15" />
            </div>
          </div>

          {/* بطاقة المفضلة */}
          <GlassCard className="absolute right-4 top-12 w-[200px] rounded-2xl p-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-white/90">قائمة الرغبات</div>
              <div className="grid h-6 min-w-6 place-items-center rounded-full bg-orange-500 px-2 text-[10px] font-semibold text-black">
                18
              </div>
            </div>
            <div className="mt-3 overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
              <div className="relative aspect-[4/3] w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0" />
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 240 180" fill="none">
                  <path
                    d="M92 44c8-14 20-22 28-22s20 8 28 22l18 16-10 16v72c0 8-6 14-14 14H100c-8 0-14-6-14-14V76L76 60l18-16Z"
                    fill="rgba(0,0,0,0.55)"
                  />
                  <path
                    d="M104 54c6-10 12-14 16-14s10 4 16 14"
                    stroke="rgba(255,255,255,0.14)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <rect
                    x="103"
                    y="92"
                    width="34"
                    height="20"
                    rx="10"
                    fill="rgba(255,255,255,0.08)"
                  />
                  <path
                    d="M120 98v10"
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </GlassCard>

          {/* بطاقة المنتج الرئيسية */}
          <div className="absolute left-1/2 top-36 w-[420px] -translate-x-1/2 rounded-[28px] bg-white/5 backdrop-blur-2xl ring-1 ring-white/12 shadow-[0_40px_120px_rgba(0,0,0,0.75)]">
            <div className="relative overflow-hidden rounded-[28px]">
              <div className="absolute inset-0 bg-gradient-to-b from-neutral-600/35 via-neutral-500/20 to-orange-900/30" />
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
                style={{
                  backgroundImage:
                    "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.5%22/%3E%3C/svg%3E')",
                }}
              />

              <div className="relative aspect-[4/3] w-full">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 720 540" fill="none">
                  <path
                    d="M290 150c20-28 44-42 70-42s50 14 70 42l-36 40c-10 10-18 14-34 14s-24-4-34-14l-36-40Z"
                    fill="rgba(0,0,0,0.90)"
                  />
                  <path
                    d="M220 210c36-26 82-40 140-40s104 14 140 40c22 16 34 40 34 76 0 120-92 190-174 190s-174-70-174-190c0-36 12-60 34-76Z"
                    fill="rgba(0,0,0,0.92)"
                  />
                  <path
                    d="M360 196v270"
                    stroke="rgba(255,255,255,0.10)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M292 252c26 18 52 26 68 26s42-8 68-26"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M220 250c-40 28-62 76-62 136 0 22 4 42 10 58"
                    stroke="rgba(0,0,0,0.85)"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />
                  <path
                    d="M500 250c40 28 62 76 62 136 0 22-4 42-10 58"
                    stroke="rgba(0,0,0,0.85)"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 shadow-[inset_0_-120px_160px_rgba(0,0,0,0.65)]" />
              </div>

              <div className="absolute left-5 top-5 rounded-2xl bg-black/25 px-4 py-3 backdrop-blur-xl ring-1 ring-white/10">
                <div className="text-xs text-white/75">مميّز</div>
                <div className="mt-1 text-sm font-semibold">جاكيت Arc Shell</div>
                <div className="mt-1 text-xs text-white/70">148$ • مقاوم للماء</div>
              </div>
            </div>
          </div>

          {/* بطاقة الخيارات */}
          <GlassCard className="absolute left-0 top-[330px] w-[240px] rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-white/85">اختر المقاس واللون</div>
              <div className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/15">
                <span className="text-sm">→</span>
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              <div>
                <div className="text-[11px] text-white/65">اللون</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setColor(c.name)}
                      className={
                        "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs ring-1 transition " +
                        (color === c.name
                          ? "bg-white/10 ring-white/20"
                          : "bg-white/5 ring-white/10 hover:bg-white/10")
                      }
                      aria-pressed={color === c.name}>
                      <span className={"h-3 w-3 rounded-full ring-1 ring-white/15 " + c.swatch} />
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-white/65">المقاس</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={
                        "h-8 w-10 rounded-xl text-xs ring-1 transition " +
                        (size === s
                          ? "bg-white/10 ring-white/20"
                          : "bg-white/5 ring-white/10 hover:bg-white/10")
                      }
                      aria-pressed={size === s}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] text-white/65">اختيارك</div>
                  <div className="text-[11px] text-white/80">
                    {color} • {size}
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <button className="flex-1 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-neutral-950">
                    أضف إلى السلة
                  </button>
                  <button className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white ring-1 ring-white/15">
                    ♡
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* بطاقة ترند */}
          <div className="absolute bottom-[170px] right-1 w-[240px] rounded-2xl bg-orange-600/95 p-4 text-black shadow-[0_28px_80px_rgba(0,0,0,0.55)] ring-1 ring-black/10">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold">الأكثر رواجًا</div>
              <div className="grid h-7 w-7 place-items-center rounded-full bg-black/10">
                <span className="text-sm">→</span>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-black/10 p-3">
              <div className="flex h-16 items-end gap-1">
                {[12, 18, 16, 24, 22, 34, 30, 48, 40, 56, 50].map((h, i) => (
                  <div
                    key={i}
                    className="w-2 rounded-sm bg-black/70"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
              <div className="mt-2 text-[11px] font-semibold text-black">جاكيت Arc Shell</div>
              <div className="text-[10px] text-black/70">+32% مشاهدة هذا الأسبوع</div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-black/10" />
              <div className="min-w-0">
                <div className="truncate text-[11px] font-semibold text-black">
                  متوسط تقييم 4.8/5
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/15">
                  <div className="h-full w-[90%] rounded-full bg-black/70" />
                </div>
                <div className="mt-1 text-[10px] text-black/70">2,341 مراجعة</div>
              </div>
            </div>
          </div>

          {/* شعار */}
          <div className="absolute bottom-8 left-10 select-none font-mono text-sm tracking-[0.35em] text-white/55">
            WEBSCHEMA
          </div>
        </div>
      </div>
    </section>
  );
}

/* Helpers */
function SelectPill({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="text-[11px] text-white/60">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white/85">{value}</div>
    </div>
  );
}

function GlassCard({ className = "", children }) {
  return (
    <div
      className={
        "bg-white/8 backdrop-blur-2xl ring-1 ring-white/14 shadow-[0_26px_80px_rgba(0,0,0,0.55)] " +
        className
      }>
      {children}
    </div>
  );
}
