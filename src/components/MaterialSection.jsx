import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "./Reveal";
import clsx from "clsx";

const materials = [
  {
    id: "pistachio",
    name: "Pistachio", // shortened from "Pistachio Green"
    description: "Luxurious pistachio green velvet with rich texture and depth",
    image: "/material-oak-macro.png",
    backgroundImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/new-source_bloom_max_1x.jpg-t1V6yfeAZKKcEvWEkPn7Pfx7hkHDMf.jpeg",
    tint: "bg-green-50",
  },
  {
    id: "lunar",
    name: "Lunar", // shortened from "Lunar Gray"
    description: "Sophisticated lunar gray with subtle metallic undertones",
    image: "/material-walnut-macro.png",
    backgroundImage: "/lunar-gray-interior.png",
    tint: "bg-gray-100",
  },
  {
    id: "martian",
    name: "Martian", // shortened from "Martian Red"
    description: "Bold martian red with warm terracotta influences",
    image: "/material-steel-macro.png",
    backgroundImage: "/martian-red-interior.png",
    tint: "bg-red-50",
  },
];

export function MaterialsSection() {
  const [activeMaterial, setActiveMaterial] = useState("pistachio");

  const activeMaterialData = materials.find((m) => m.id === activeMaterial) || materials[0];

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
    <section
      className="relative min-h-screen  flex items-center justify-center overflow-hidden"
      id="materials">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {materials.map((material) => (
          <motion.div
            key={material.id}
            className="absolute inset-0"
            initial={{ opacity: material.id === activeMaterial ? 1 : 0 }}
            animate={{ opacity: material.id === activeMaterial ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}>
            <img
              src={material.backgroundImage || "/placeholder.svg"}
              alt={`${material.name} interior scene`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Heading + text */}
      <div className="absolute top-[80px] md:top-[120px] left-0 right-0 z-10">
        <div className="container-custom text-white px-4 sm:px-6">
          <Reveal>
            <div>
              <AnimatePresence mode="wait">
                <motion.h2
                  key={activeMaterial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="font-bold mb-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center md:text-left">
                  <AnimatedText text={activeMaterialData.name} delay={0.2} />
                </motion.h2>
              </AnimatePresence>
              <p className="text-base p-5 sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl text-center md:text-left mx-auto md:mx-0">
                Every piece begins with the finest materials, carefully selected for their beauty,
                durability, and sustainable origins. Our craftspeople honor traditional techniques
                while embracing modern precision.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Material Buttons */}
      <div className="absolute bottom-6 md:bottom-8 left-0 right-0 z-10">
        <div className="container-custom">
          <Reveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {materials.map((material) => (
                <motion.button
                  key={material.id}
                  className={clsx(
                    "px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 backdrop-blur-md",
                    activeMaterial === material.id
                      ? "bg-white text-neutral-900"
                      : "bg-white/20 text-white hover:bg-white/30"
                  )}
                  onClick={() => setActiveMaterial(material.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}>
                  {material.name}
                </motion.button>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
