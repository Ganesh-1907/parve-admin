import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

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
    description:
      "Replenish moisture and restore your skin's natural barrier with deeply hydrating formulas.",
  },
  {
    id: "oily",
    name: "Oily Skin",
    image: oilySkin,
    symptoms: "Excess shine, enlarged pores, breakouts",
    description:
      "Balance sebum production and achieve a fresh, matte complexion without over-drying.",
  },
  {
    id: "acne",
    name: "Acne",
    image: acne,
    symptoms: "Pimples, blackheads, inflammation",
    description:
      "Gently clear blemishes and prevent future breakouts with soothing ingredients.",
  },
  {
    id: "sensitive",
    name: "Sensitive Skin",
    image: sensitiveSkin,
    symptoms: "Redness, irritation, reactive skin",
    description:
      "Calm and protect delicate skin with gentle, fragrance-free formulations.",
  },
  {
    id: "combination",
    name: "Combination Skin",
    image: combinationSkin,
    symptoms: "Oily T-zone, dry cheeks, uneven texture",
    description:
      "Address multiple concerns with balanced products that hydrate and control oil.",
  },
];

export function ConcernsSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const autoplay = useRef(
    Autoplay({
      delay: 3500,
      stopOnInteraction: false,
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
    },
    [autoplay.current]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => {
      if (emblaApi) emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Shop by Skin Concerns
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Find the perfect products tailored to your unique skin needs
          </p>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden -mx-4 md:-mx-4" ref={emblaRef}>
          <div className="flex items-center">
            {skinConcerns.map((concern, index) => {
              const isActive = index === selectedIndex;

              return (
                <div
                  key={concern.id}
                  className="
                    flex-[0_0_100%]
                    md:flex-[0_0_50%]
                    lg:flex-[0_0_33.333%]
                    min-w-0
                    px-4
                  "
                >
                  <Link
                    to={`/products?concern=${concern.id}`}
                    className={`
                      block transition-all duration-500
                      ${isActive ? "scale-100 z-20" : "scale-90 opacity-70"}
                      lg:${isActive ? "" : index < selectedIndex ? "-rotate-6" : "rotate-6"}
                    `}
                  >
                    <div className="bg-card rounded-3xl shadow-medium overflow-hidden">
                      {/* Image */}
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={concern.image}
                          alt={concern.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="font-serif text-xl font-semibold mb-2">
                          {concern.name}
                        </h3>
                        <p className="text-sm text-primary mb-2">
                          {concern.symptoms}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {concern.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
