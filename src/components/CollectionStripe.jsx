import { useMemo, useRef, useState, useEffect } from "react";
import Reveal from "./Reveal";
import {
  useGetAllProductsQuery,
  useGetCategoriesTreeQuery,
  useGetMainCategoriesWithCountsQuery,
} from "../redux/queries/productApi";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Layers } from "lucide-react";
import { motion } from "framer-motion";

const capitalizeLabel = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export function CollectionStrip() {
  const { data: products } = useGetAllProductsQuery();
  const { data: categoryTree } = useGetCategoriesTreeQuery();
  const { data: mainCategoriesWithCounts } = useGetMainCategoriesWithCountsQuery();
  const navigate = useNavigate();

  const scrollRef = useRef(null);
  const [active, setActive] = useState(0);

  const categories = useMemo(() => {
    const tree = Array.isArray(categoryTree) ? categoryTree : [];
    const prods = Array.isArray(products) ? products : [];
    const counts = Array.isArray(mainCategoriesWithCounts) ? mainCategoriesWithCounts : [];

    return tree
      .map((category) => {
        const name = category?.name || "Unknown";
        const label = capitalizeLabel(name);

        const count = counts.find((c) => String(c._id) === String(category._id))?.count || 0;

        const firstProduct = prods.find((p) => String(p.category) === String(category._id));
        const image = category?.image || firstProduct?.image?.[0]?.url || "/fallback.jpg";

        return { id: category._id, label, count, image };
      })
      .filter(Boolean);
  }, [categoryTree, products, mainCategoriesWithCounts]);

  const scrollByCard = (dir = 1) => {
    const el = scrollRef.current;
    if (!el) return;

    const card = el.querySelector("[data-card]");
    const step = card ? card.getBoundingClientRect().width + 16 : 320;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const cards = Array.from(el.querySelectorAll("[data-card]"));
    if (!cards.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

        if (visible) {
          const idx = cards.indexOf(visible.target);
          if (idx >= 0) setActive(idx);
        }
      },
      { root: el, threshold: [0.5, 0.7, 0.85] },
    );

    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [categories.length]);

  const goTo = (index) => {
    const el = scrollRef.current;
    if (!el) return;

    const cards = el.querySelectorAll("[data-card]");
    const target = cards[index];
    if (target) target.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  return (
    <section className="relative px-2 py-16 lg:py-24 overflow-hidden" id="collections">
      {/* Modern background (same vibe as FeaturedProducts) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-neutral-50 to-white" />
        <div className="absolute left-1/2 top-[-120px] h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-neutral-200/55 blur-3xl" />
        <div className="absolute -left-24 top-40 h-72 w-72 rounded-full bg-neutral-200/30 blur-3xl" />
        <div className="absolute right-[-120px] bottom-[-120px] h-80 w-80 rounded-full bg-neutral-100 blur-3xl" />
      </div>

      <Reveal>
        <div className="container-custom px-4">
          {/* Header */}
          <div className="mb-8 lg:mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              {/* ✅ "Just dropped" style pill for categories */}
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-700 shadow-sm">
                <Layers className="h-4 w-4" />
                Browse categories
              </div>

              <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-neutral-950">
                Collections <span className="italic font-light text-neutral-800">by category</span>
              </h2>

              <p className="mt-3 text-base md:text-lg text-neutral-600 leading-relaxed">
                Swipe through categories and jump straight into your favorite styles.
              </p>
            </div>

            {/* Arrows (desktop) */}
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                className="h-10 w-10 rounded-2xl border border-neutral-200 bg-white shadow-sm hover:bg-neutral-50 transition"
                aria-label="Previous">
                <ArrowLeft className="mx-auto h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollByCard(1)}
                className="h-10 w-10 rounded-2xl border border-neutral-200 bg-white shadow-sm hover:bg-neutral-50 transition"
                aria-label="Next">
                <ArrowRight className="mx-auto h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Carousel */}
          <div className="relative">
            {/* edge fades */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent" />

            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-2
                         snap-x snap-mandatory
                         [-ms-overflow-style:none] [scrollbar-width:none]
                         [&::-webkit-scrollbar]:hidden">
              {categories.map((c) => (
                <motion.button
                  key={c.id}
                  type="button"
                  data-card
                  onClick={() => navigate(`/category/${c.id}`)}
                  className="snap-start shrink-0 w-[78%] sm:w-[320px] md:w-[360px] text-left"
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] },
                  }}
                  viewport={{ once: true, amount: 0.2 }}>
                  <div className="group relative rounded-3xl">
                    <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 opacity-0 blur transition duration-300 group-hover:opacity-100" />

                    <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition duration-300 group-hover:shadow-[0_18px_55px_rgba(0,0,0,0.12)]">
                      <div className="relative aspect-[4/5]">
                        <img
                          src={c.image}
                          alt={c.label}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          draggable="false"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

                        <div className="absolute top-4 left-4 rounded-full bg-white/15 text-white text-xs px-3 py-1.5 backdrop-blur border border-white/10">
                          {c.count} items
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <h3 className="text-2xl  font-semibold text-white truncate">{c.label}</h3>

                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-xs text-white/80">View collection</p>

                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-zinc-950 shadow-sm transition group-hover:bg-white/90">
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Mobile arrows */}
            <div className="mt-4 flex md:hidden items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                className="h-10 w-10 rounded-2xl border border-neutral-200 bg-white shadow-sm hover:bg-neutral-50 transition"
                aria-label="Previous">
                <ArrowLeft className="mx-auto h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                className="h-10 w-10 rounded-2xl border border-neutral-200 bg-white shadow-sm hover:bg-neutral-50 transition"
                aria-label="Next">
                <ArrowRight className="mx-auto h-4 w-4" />
              </button>
            </div>

            {/* Dots */}
            {categories.length > 1 && (
              <div className="mt-5 flex items-center justify-center gap-2">
                {categories.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2.5 rounded-full transition-all ${
                      i === active ? "w-7 bg-zinc-900" : "w-2.5 bg-zinc-300 hover:bg-zinc-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Dark CTA (same one you use in FeaturedProducts) */}
          <div className="mt-10 lg:mt-14">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
              {/* subtle glow + grid texture */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-28 -left-28 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:18px_18px] opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-transparent" />
              </div>

              <div className="relative flex flex-col gap-5 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl">
                  <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-white/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Discover what’s next
                  </p>

                  <h3 className="mt-2 text-2xl sm:text-3xl font-black text-white leading-tight">
                    Find your next favorite look
                  </h3>

                  <p className="mt-2 text-sm sm:text-base text-white/70 leading-relaxed">
                    Explore the full shop with new arrivals, best sellers, and curated categories.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    to="/all-products?sort=new"
                    className="group inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur
                     hover:bg-white/15 transition active:scale-[0.99]">
                    New arrivals
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>

                  <Link
                    to="/all-products"
                    className="group inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-black text-zinc-950 shadow-sm
                     hover:bg-white/90 transition active:scale-[0.99]">
                    Shop all
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
