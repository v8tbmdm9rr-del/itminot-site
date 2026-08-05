import Image from "next/image";
import { Clock3, Flame, HandPlatter, Leaf, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const FEATURES = [
  {
    icon: Clock3,
    title: "Тесто длительной ферментации",
    text: "Более 24 часов холодной ферментации — тесто получается лёгким, воздушным и легко усваиваемым.",
  },
  {
    icon: Flame,
    title: "Настоящая дровяная печь",
    text: "Пицца выпекается при высокой температуре на дровах — с характерным ароматом и лёгкой обугленной корочкой.",
  },
  {
    icon: Leaf,
    title: "Итальянские ингредиенты",
    text: "Моцарелла, пармезан, вяленые томаты и оливковое масло — только качественные продукты в основе вкуса.",
  },
  {
    icon: HandPlatter,
    title: "Ручное приготовление",
    text: "Каждая пицца формуется вручную — без прессов и заготовок, так, как это делают в Неаполе.",
  },
  {
    icon: Users,
    title: "Атмосфера для своих",
    text: "Уютный зал для семейных обедов, встреч с друзьями и тихих вечеров вдвоём.",
  },
];

const GALLERY = [
  { src: "/images/interior/exterior-dusk.webp", alt: "Фасад пиццерии ITMINOT с неоновой вывеской в сумерках" },
  { src: "/images/interior/dining-room.webp", alt: "Зал пиццерии ITMINOT с круглой неоновой вывеской и столиками" },
  { src: "/images/interior/counter-bar.webp", alt: "Барная стойка пиццерии ITMINOT" },
  { src: "/images/interior/exterior-day.webp", alt: "Фасад пиццерии ITMINOT днём" },
];

export function About() {
  return (
    <section id="about" className="relative bg-charcoal py-24 sm:py-32">
      <Container>
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              kicker="О пиццерии"
              title="Неаполь, привезённый в Гудермес"
              subtitle="ITMINOT — пиццерия, вдохновлённая традициями Неаполя. Мы бережно следуем классической технологии: долгая ферментация теста, дровяная печь и продукты, которые формируют настоящий вкус Италии."
            />

            <div className="mt-12 space-y-8">
              {FEATURES.map((feature, index) => (
                <Reveal key={feature.title} delay={index * 0.08} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-olive/40 text-gold">
                    <feature.icon size={22} aria-hidden />
                  </div>
                  <div>
                    <p className="font-display text-xl text-cream">{feature.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-cream/65">{feature.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {GALLERY.map((photo, index) => (
              <Reveal key={photo.src} delay={index * 0.1}>
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 22vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
