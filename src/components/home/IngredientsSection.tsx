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
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text and ingredient cards */}
          <div className="animate-fade-in-up">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Pure Natural Ingredients
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              We carefully select the finest plant-based ingredients to create products that are gentle yet effective
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
            <div className="rounded-3xl overflow-hidden shadow-medium">
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
