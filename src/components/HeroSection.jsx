import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { PackageCheck, Rocket, ShieldCheck } from "lucide-react"; // Added PackageCheck, Rocket, and ShieldCheck icon imports
import Reveal from "./Reveal";
import BlurPanel from "./BlurPanel";
import test from "../assets/images/test.webp";
export function HeroSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 0.95]); // Reduced hero image shrink from 15% to 5%
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const AnimatedText = ({ text, delay = 0 }) => {
    return (
      <span>
        {text.split("").map((char, index) => (
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
    <section ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Background Image with Cinematic Effects */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: imageScale, y: imageY }}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}>
        {/* Use a wrapper for sizing if you want "fill"-like behavior */}
        <div className="absolute inset-0">
          <img src={test} alt="Test" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex items-center justify-center"
        style={{ y: contentY, opacity: contentOpacity }}>
        <div className="container-custom text-center text-white">
          <Reveal>
            <h1 className="text-4xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-none tracking-tight mb-6">
              <AnimatedText text="Elevate your style" delay={0.5} />
              <br />
              <span className="italic font-light">
                <AnimatedText text="with timeless fashion." delay={1.1} />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <motion.p
              className="text-lg px-4 md:text-xl text-white/90 mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}>
              Designed in{" "}
              <img
                src="https://flagcdn.com/w20/kw.png"
                alt="Kuwait Flag"
                className="w-5 h-5 inline-block"
              />{" "}
              — versatile clothes for modern lives.
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
          <div className="flex items-center justify-center gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-green-400" />
              <span className="text-sm">Fast delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-amber-400" />
              <span className="text-sm">Based in Kuwait</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span className="text-sm">Exclusive offers</span>
            </div>
          </div>
        </BlurPanel>
      </motion.div>
    </section>
  );
}
