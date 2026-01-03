import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Leaf, FlaskConical, Rabbit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const slides = [hero1, hero2, hero3];

const features = [
  { icon: Leaf, title: "100% Natural", description: "Pure plant-based ingredients" },
  { icon: FlaskConical, title: "Dermatologically Tested", description: "Safe for all skin types" },
  { icon: Rabbit, title: "Cruelty-Free", description: "Never tested on animals" },
];

export function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);

    // Auto-scroll
    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(autoplay);
    };
  }, [emblaApi]);

  return (
    <section className="relative">
      {/* Full-width Carousel */}
      <div className="relative w-full">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {slides.map((slide, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0">
                <div className="relative h-[40vh] md:h-[50vh] lg:h-[55vh]">
                  <img
                    src={slide}
                    alt={`Natural beauty skincare ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-foreground/50 to-transparent" />
                  <div className="absolute inset-0 flex items-center">
                    <div className="container">
                      <div className="max-w-lg animate-fade-in-up">
                        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                          Nature's Best for Your Skin
                        </h1>
                        <p className="text-white/90 mb-6 text-sm md:text-lg drop-shadow-md">
                          Discover the power of natural ingredients crafted into premium skincare
                        </p>
                        <Link to="/products">
                          <Button size="lg" className="shadow-medium">
                            Shop Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={scrollNext}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                selectedIndex === index ? "bg-white w-6" : "bg-white/50"
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
            />
          ))}
        </div>
      </div>

      {/* Feature Cards Below Carousel */}
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`bg-card rounded-2xl p-8 shadow-soft hover-lift animate-fade-in-up stagger-${index + 1} flex items-center gap-5`}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-xl mb-1">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
