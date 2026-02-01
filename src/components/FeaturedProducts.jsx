import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import QuickLookModal from "./QuickLookModal";
import Reveal from "./Reveal";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FeaturedProducts({ products, isLoading }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const items = useMemo(() => (Array.isArray(products) ? products : []), [products]);

  const handleQuickLook = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (isLoading) return <Loader />;

  return (
    <section className="relative px-2 py-16 lg:py-24 overflow-hidden" id="featured-products">
      {/* Modern background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-neutral-50 to-white" />
        <div className="absolute left-1/2 top-[-120px] h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-neutral-200/55 blur-3xl" />
        <div className="absolute -left-24 top-40 h-72 w-72 rounded-full bg-neutral-200/30 blur-3xl" />
        <div className="absolute right-[-120px] bottom-[-120px] h-80 w-80 rounded-full bg-neutral-100 blur-3xl" />
      </div>

      <div className="container-custom px-4">
        {/* Header */}
        <Reveal>
          <div className="mb-10 lg:mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-700 shadow-sm">
                <Sparkles className="h-4 w-4" />
                Just dropped
              </div>

              <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-neutral-950">
                Featured <span className="italic font-light text-neutral-800">Picks</span>
              </h2>

              <p className="mt-3 text-base md:text-lg text-neutral-600 leading-relaxed">
                Fresh arrivals curated for style and comfort. Tap any item for a quick look.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Content */}
        {items.length === 0 ? (
          <div className="rounded-3xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
            <p className="text-neutral-900 font-semibold">No featured products yet</p>
            <p className="mt-1 text-sm text-neutral-500">Check back soon — new drops are coming.</p>
          </div>
        ) : (
          <>
            {/* Modern Mason-ish grid (responsive, looks premium) */}
            <motion.div
              className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06 } },
              }}>
              {items.slice(0, 8).map((product) => (
                <motion.div
                  key={product._id}
                  variants={{
                    hidden: { opacity: 0, y: 18, scale: 0.98 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] },
                    },
                  }}
                  className="relative">
                  {/* Card wrapper with glow on hover */}
                  <div className="group relative rounded-3xl">
                    <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 opacity-0 blur transition duration-300 group-hover:opacity-100" />
                    <div className="relative rounded-3xl border border-neutral-200 bg-white shadow-sm transition duration-300 group-hover:shadow-[0_18px_55px_rgba(0,0,0,0.12)]">
                      <ProductCard product={product} onQuickLook={handleQuickLook} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Simple dark CTA */}
            <div className="mt-10 lg:mt-14">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
                {/* subtle glow */}
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                  <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
                </div>

                <div className="relative flex flex-col gap-4 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
                  <div className="max-w-xl">
                    <p className="text-xs font-semibold tracking-wide text-white/70 uppercase">
                      Explore more
                    </p>
                    <h3 className="mt-2 text-xl sm:text-2xl font-black text-white">
                      Want more styles?
                    </h3>
                    <p className="mt-2 text-sm text-white/70">
                      Browse the full catalog and discover new favorites.
                    </p>
                  </div>

                  <Link
                    to="/all-products"
                    className="group inline-flex w-fit items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-bold text-zinc-950 shadow-sm transition
                   hover:bg-white/90 active:scale-[0.99]">
                    Browse all products
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <QuickLookModal product={selectedProduct} isOpen={isModalOpen} onClose={closeModal} />
    </section>
  );
}
