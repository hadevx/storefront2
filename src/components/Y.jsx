import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo } from "react";

export default function HeroCloneEcom() {
  const language = useSelector((state) => state.language.lang);

  const t = useMemo(() => {
    return language === "ar"
      ? {
          pill: "إصدار جديد • كمية محدودة",
          title1: "إطلالات سهلة تمنحك",
          title2: "ثقة يومية",
          desc: "أساسيات فاخرة، قصّات نظيفة، وخامات مريحة. تسوق أحدث مجموعة مع توصيل داخل الكويت.",
          ctaShop: "تسوق الجديد",
          ctaBest: "الأكثر مبيعًا",
          trust1: "توصيل سريع داخل الكويت",
          trust2: "استبدال سهل",
          trust3: "دفع آمن",
          offerLabel: "عرض اليوم",
          offerTitleA: "خصم إضافي",
          offerTitleB: "10%",
          offerTitleC: "على منتجات محددة",
          offerDesc: "لفترة محدودة. تصفح قسم التخفيضات واحجز مقاسك قبل نفاد الكمية.",
          boxDeliveryLabel: "التوصيل",
          boxDeliveryValue: "24–48 ساعة",
          boxExchangeLabel: "الاستبدال",
          boxExchangeValue: "سهل",
          saleBtn: "تسوق التخفيضات",
        }
      : {
          pill: "New drop • Limited stock",
          title1: "Effortless fits for",
          title2: "everyday confidence",
          desc: "Premium essentials, clean cuts, and comfortable fabrics. Shop the latest collection made for Kuwait delivery.",
          ctaShop: "Shop new arrivals",
          ctaBest: "Best sellers",
          trust1: "Fast Kuwait delivery",
          trust2: "Easy exchanges",
          trust3: "Secure checkout",
          offerLabel: "Today’s offer",
          offerTitleA: "Extra",
          offerTitleB: "10% off",
          offerTitleC: "on selected items",
          offerDesc: "Limited time. Browse the sale section and grab your size before it’s gone.",
          boxDeliveryLabel: "Delivery",
          boxDeliveryValue: "24–48 hrs",
          boxExchangeLabel: "Exchange",
          boxExchangeValue: "Easy",
          saleBtn: "Shop sale",
        };
  }, [language]);

  const Arrow = language === "ar" ? ArrowLeft : ArrowRight;

  return (
    <section dir={language === "ar" ? "rtl" : "ltr"} className="relative bg-white overflow-hidden">
      {/* Hero image */}
      <div className="mt-6 px-3 sm:px-4">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50">
          <img
            src="/images/img2.jpg"
            alt={language === "ar" ? "مجموعة جديدة" : "New collection"}
            className="w-full h-[260px] sm:h-[340px] md:h-[440px] object-cover"
            style={{ objectPosition: "50% 55%" }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-10 pb-16 sm:pb-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-end">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              {t.pill}
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-neutral-950 leading-[1.05]">
              {t.title1} <br className="hidden sm:block" />
              {language === "ar" ? (
                <span className="italic font-light text-neutral-700">{t.title2}</span>
              ) : (
                <>
                  everyday <span className="italic font-light text-neutral-700">confidence</span>
                </>
              )}
              {language === "en" && <>{/* keep original EN structure */}</>}
            </h1>

            {/* Keep original EN headline exactly, but translated for AR */}
            {language === "en" && (
              <h1 className="sr-only">Effortless fits for everyday confidence</h1>
            )}

            <p className="mt-4 text-sm sm:text-base text-neutral-600 max-w-xl">{t.desc}</p>

            {/* CTAs */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
              <Link
                to="/all-products"
                className="group inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800 transition">
                {t.ctaShop}
                <Arrow
                  className={
                    language === "ar"
                      ? "mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                      : "ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  }
                />
              </Link>

              <Link
                to="/category/best-sellers"
                className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition">
                {t.ctaBest}
              </Link>
            </div>

            {/* Small trust row */}
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-neutral-600">
              <span className="rounded-full border border-neutral-200 bg-white px-3 py-1">
                {t.trust1}
              </span>
              <span className="rounded-full border border-neutral-200 bg-white px-3 py-1">
                {t.trust2}
              </span>
              <span className="rounded-full border border-neutral-200 bg-white px-3 py-1">
                {t.trust3}
              </span>
            </div>
          </div>

          {/* Right (promo card) */}
          <div className="md:justify-self-end w-full md:max-w-sm">
            <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm p-5 sm:p-6">
              <p className="text-xs font-semibold text-neutral-500">{t.offerLabel}</p>

              <p className="mt-2 text-lg font-semibold text-neutral-900">
                {language === "ar" ? (
                  <>
                    {t.offerTitleA} <span className="text-emerald-600">{t.offerTitleB}</span>{" "}
                    {t.offerTitleC}
                  </>
                ) : (
                  <>
                    {t.offerTitleA} <span className="text-emerald-600">{t.offerTitleB}</span>{" "}
                    {t.offerTitleC}
                  </>
                )}
              </p>

              <p className="mt-2 text-sm text-neutral-600">{t.offerDesc}</p>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-neutral-500 text-xs">{t.boxDeliveryLabel}</p>
                  <p className="font-semibold text-neutral-900 mt-1">{t.boxDeliveryValue}</p>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-neutral-500 text-xs">{t.boxExchangeLabel}</p>
                  <p className="font-semibold text-neutral-900 mt-1">{t.boxExchangeValue}</p>
                </div>
              </div>

              <Link
                to="/sale"
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800 transition">
                {t.saleBtn}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Soft bottom glow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-yellow-100/60 via-pink-100/40 to-transparent" />
    </section>
  );
}
