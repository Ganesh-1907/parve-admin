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
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => {
      if (emblaApi) emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-16 md:py-12 bg-background">
      <div className="container">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Your Daily Skincare Ritual
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            See how our customers embrace natural beauty with PARVE products
          </p>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden -mx-2 md:-mx-3" ref={emblaRef}>
          <div className="flex">
            {productUsageImages.map((item) => (
              <div
                key={item.id}
                className="
                  flex-[0_0_100%]
                  md:flex-[0_0_50%]
                  lg:flex-[0_0_25%]
                  min-w-0
                  px-2 md:px-3
                "
              >
                <div className="relative rounded-2xl overflow-hidden shadow-medium group">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />

                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-serif text-lg font-semibold text-white">
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
