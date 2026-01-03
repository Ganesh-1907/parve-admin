import { Link } from "react-router-dom";
import drySkin from "@/assets/concern-dry-skin.jpg";
import oilySkin from "@/assets/concern-oily-skin.jpg";
import acne from "@/assets/concern-acne.jpg";
import sensitiveSkin from "@/assets/concern-sensitive-skin.jpg";
import combinationSkin from "@/assets/concern-combination-skin.jpg";

const skinConcerns = [
  { id: "dry", name: "Dry Skin", image: drySkin },
  { id: "oily", name: "Oily Skin", image: oilySkin },
  { id: "acne", name: "Acne", image: acne },
  { id: "sensitive", name: "Sensitive Skin", image: sensitiveSkin },
  { id: "combination", name: "Combination Skin", image: combinationSkin },
];

export function ConcernsSection() {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Shop by Skin Concerns
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find the perfect products tailored to your unique skin needs
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {skinConcerns.map((concern, index) => (
            <Link
              key={concern.id}
              to={`/products?concern=${concern.id}`}
              className={`group animate-fade-in-up stagger-${(index % 5) + 1}`}
            >
              <div className="bg-background rounded-xl overflow-hidden shadow-soft hover-lift transition-all group-hover:shadow-glow">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={concern.image}
                    alt={concern.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-serif font-semibold group-hover:text-primary transition-colors">
                    {concern.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
