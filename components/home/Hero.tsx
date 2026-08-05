"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100svh] w-full overflow-hidden bg-charcoal">
      <motion.div style={{ y, scale: 1.08 }} className="absolute inset-0">
        <Image
          src="/images/hero/pizza-hero.webp"
          alt="Неаполитанская пицца ITMINOT свежая из дровяной печи"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-charcoal" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent,rgba(0,0,0,0.55))]" />

      <motion.div style={{ opacity }} className="relative z-10 flex h-full flex-col">
        <Container className="flex flex-1 flex-col items-center justify-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-5 text-xs font-semibold uppercase tracking-[0.4em] text-gold"
          >
            Неаполитанская пиццерия
          </motion.p>
          <div className="relative">
            <div
              className="neon-glow-ambient pointer-events-none absolute inset-0 -z-10 scale-150"
              aria-hidden
            />
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="neon-text font-display text-6xl tracking-wide sm:text-7xl lg:text-8xl"
            >
              ITMINOT
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <LinkButton href="/menu" size="lg">
              Посмотреть меню
            </LinkButton>
            <LinkButton href="/booking" size="lg" variant="outline">
              Забронировать столик
            </LinkButton>
          </motion.div>
        </Container>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex justify-center pb-10"
        >
          <ChevronDown className="animate-bounce text-cream/60" size={26} aria-hidden />
        </motion.div>
      </motion.div>
    </section>
  );
}
