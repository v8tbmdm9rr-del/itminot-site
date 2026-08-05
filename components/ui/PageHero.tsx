import Image from "next/image";
import { Container } from "./Container";

export function PageHero({
  kicker,
  title,
  subtitle,
  image,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  image?: string;
}) {
  return (
    <section className="relative flex h-[46vh] min-h-[360px] w-full items-end overflow-hidden bg-charcoal-soft pb-14 pt-32">
      {image && (
        <>
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/40" />
        </>
      )}
      <Container className="relative">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">{kicker}</p>
        <h1 className="font-display text-5xl text-cream sm:text-6xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-xl text-base leading-relaxed text-cream/70">{subtitle}</p>}
      </Container>
    </section>
  );
}
