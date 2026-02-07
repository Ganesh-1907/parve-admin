import ingredientsImage from "@/assets/ingredients-flatlay.jpg";

const ingredientsList = [
  { name: "Aloe Vera", description: "Deep hydration" },
  { name: "Green Tea", description: "Antioxidant protection" },
  { name: "Lavender", description: "Calming & soothing" },
  { name: "Vitamin C", description: "Brightening" },
  { name: "Tea Tree", description: "Natural purification" },
  { name: "Rose Extract", description: "Nourishing care" },
];

export function IngredientsSection() {
  return (
    <section className="py-8 md:py-8 bg-background">
      <div className="container">
        
        {/* TOP - Heading (Full Width) */}
        <div className="mb-16 animate-fade-in-up text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Pure Natural Ingredients
          </h2>
          <p className="text-muted-foreground mb-2">
            Carefully chosen plant-based ingredients designed to nourish, protect,
            and enhance your skin naturally.
          </p>
        </div>

        {/* BOTTOM - Content + Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left side - Description + Cards */}
          <div className="animate-fade-in-up ">
            <p className="text-muted-foreground mb-4">
              Designed for modern skin needs, our ingredients work deep beneath
              the surface to hydrate, protect, and refresh. Lightweight,
              non-greasy, and effective — perfect for daily use without
              irritation or heaviness.
            </p>

            <p className="text-muted-foreground mb-8">
              Each ingredient is carefully selected for its proven benefits,
              ensuring your skin receives nourishment without unnecessary
              additives.
            
  Crafted with care and tested for quality, our products deliver results you can trust - every single day.
</p>

            <div className="grid grid-cols-2 gap-4">
              {ingredientsList.map((ingredient, index) => (
                <div
                  key={ingredient.name}
                  className={`bg-card border border-primary/20 rounded-xl p-5 hover-lift animate-fade-in-up stagger-${(index % 4) + 1}`}
                >
                  <h3 className="font-serif font-semibold text-lg text-primary mb-1">
                    {ingredient.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {ingredient.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Image */}
          <div className="animate-slide-in-right">
            <div className="rounded-3xl overflow-hidden shadow-medium max-h-[520px]">
              <img
                src={ingredientsImage}
                alt="Natural skincare ingredients - aloe vera, lavender, citrus, and botanicals"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
