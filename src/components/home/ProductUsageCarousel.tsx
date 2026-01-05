import { useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const productUsageImages = [
  {
    id: 1,
    title: "Gentle Face Cleansing",
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80",
  },
  {
    id: 2,
    title: "Applying Nourishing Serum",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
  },
  {
    id: 3,
    title: "Moisturizing Routine",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80",
  },
  {
    id: 4,
    title: "Natural Skincare",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80",
  },
  {
    id: 5,
    title: "Daily Cream Application",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
  },
  {
    id: 6,
    title: "Skincare Moments",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80",
  },
];

export function ProductUsageCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Your Daily Skincare Ritual
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            See how our customers embrace natural beauty with PARVE products
          </p>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 md:gap-6">
            {productUsageImages.map((item) => (
              <div
                key={item.id}
                className="flex-[0_0_80%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-medium group">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-serif text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
