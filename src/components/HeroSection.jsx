import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { PackageCheck, Rocket, ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";
import BlurPanel from "./BlurPanel";
import test2 from "/images/img1.webp";

export function HeroSection() {
  const language = useSelector((state) => state.language.lang);

  const t = useMemo(() => {
    return language === "ar"
      ? {
          line1: "ارتقِ بإطلالتك",
          line2: "بأزياء خالدة.",
          desc: "مصممة في",
          desc2: "— ملابس متعددة الاستخدام لحياة عصرية.",
          fast: "توصيل سريع",
          kuwait: "مقرنا الكويت",
          offers: "عروض حصرية",
        }
      : {
          line1: "Elevate your style",
          line2: "with timeless fashion.",
          desc: "Designed in",
          desc2: "— versatile clothes for modern lives.",
          fast: "Fast delivery",
          kuwait: "Based in Kuwait",
          offers: "Exclusive offers",
        };
  }, [language]);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 0.95]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // ✅ Keep your animated text for English only (Arabic text breaks with char split)
  const AnimatedText = ({ text, delay = 0 }) => {
    if (language === "ar") {
      return (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}>
          {text}
        </motion.span>
      );
    }

    return (
      <span>
        {String(text)
          .split("")
          .map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: delay + index * 0.03,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              style={{ display: char === " " ? "inline" : "inline-block" }}>
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
      </span>
    );
  };

  return (
    <section
      ref={containerRef}
      dir={language === "ar" ? "rtl" : "ltr"}
      className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: imageScale, y: imageY }}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}>
        <div className="absolute inset-0">
          <img src={test2} alt="Hero" className="w-full h-full object-cover object-[50%_70%]" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex items-center justify-center"
        style={{ y: contentY, opacity: contentOpacity }}>
        <div className="container-custom text-center text-white">
          <Reveal>
            <h1 className="text-4xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-none tracking-tight mb-6">
              <AnimatedText text={t.line1} delay={0.5} />
              <br />
              <span className="italic font-light">
                <AnimatedText text={t.line2} delay={1.1} />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <motion.p
              className="text-lg px-4 md:text-xl text-white/90 mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}>
              {t.desc}{" "}
              <img
                src="https://flagcdn.com/w20/kw.png"
                alt="Kuwait Flag"
                className="w-5 h-5 inline-block"
              />{" "}
              {t.desc2}
            </motion.p>
          </Reveal>
        </div>
      </motion.div>

      {/* Info Strip */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}>
        <BlurPanel className="mx-6 mb-6 px-6 py-4 bg-black/24 backdrop-blur-md border-white/20">
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-green-400" />
              <span className="text-sm">{t.fast}</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-amber-400" />
              <span className="text-sm">{t.kuwait}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span className="text-sm">{t.offers}</span>
            </div>
          </div>
        </BlurPanel>
      </motion.div>
    </section>
  );
}
