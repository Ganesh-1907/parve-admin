import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import drySkin from "@/assets/concern-dry-skin.jpg";
import oilySkin from "@/assets/concern-oily-skin.jpg";
import acne from "@/assets/concern-acne.jpg";
import sensitiveSkin from "@/assets/concern-sensitive-skin.jpg";
import combinationSkin from "@/assets/concern-combination-skin.jpg";

const skinConcerns = [
  {
    id: "dry",
    name: "Dry Skin",
    image: drySkin,
    symptoms: "Tightness, flakiness, rough texture",
    description: "Replenish moisture and restore your skin's natural barrier with deeply hydrating formulas.",
  },
  {
    id: "oily",
    name: "Oily Skin",
    image: oilySkin,
    symptoms: "Excess shine, enlarged pores, breakouts",
    description: "Balance sebum production and achieve a fresh, matte complexion without over-drying.",
  },
  {
    id: "acne",
    name: "Acne",
    image: acne,
    symptoms: "Pimples, blackheads, inflammation",
    description: "Gently clear blemishes and prevent future breakouts with soothing, non-irritating ingredients.",
  },
  {
    id: "sensitive",
    name: "Sensitive Skin",
    image: sensitiveSkin,
    symptoms: "Redness, irritation, reactive skin",
    description: "Calm and protect delicate skin with gentle, fragrance-free formulations.",
  },
  {
    id: "combination",
    name: "Combination Skin",
    image: combinationSkin,
    symptoms: "Oily T-zone, dry cheeks, uneven texture",
    description: "Address multiple concerns with balanced products that hydrate and control oil where needed.",
  },
];

export function ConcernsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Shop by Skin Concerns
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Find the perfect products tailored to your unique skin needs
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-card shadow-medium flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed -translate-x-4 md:-translate-x-6"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-card shadow-medium flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed translate-x-4 md:translate-x-6"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="overflow-hidden mx-6 md:mx-8" ref={emblaRef}>
            <div className="flex gap-4 md:gap-6">
              {skinConcerns.map((concern) => (
                <Link
                  key={concern.id}
                  to={`/products?concern=${concern.id}`}
                  className="flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_31%] min-w-0 group"
                >
                  <div className="bg-card rounded-2xl overflow-hidden shadow-medium hover:shadow-glow transition-all h-full">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={concern.image}
                        alt={concern.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                        {concern.name}
                      </h3>
                      <p className="text-sm font-medium text-primary mb-2">
                        {concern.symptoms}
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {concern.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
