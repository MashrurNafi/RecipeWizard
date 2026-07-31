import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "../src/generated/prisma/client"

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const SEED_RECIPES = [
  {
    title: "Classic Margherita Pizza",
    servings: 4,
    timeMinutes: 35,
    cuisine: "Italian",
    dietary: ["vegetarian"],
    ingredients: [
      { name: "Pizza dough", quantity: "1 lb" },
      { name: "San Marzano tomatoes", quantity: "1 can (14 oz)" },
      { name: "Fresh mozzarella", quantity: "8 oz" },
      { name: "Fresh basil", quantity: "6 leaves" },
      { name: "Extra virgin olive oil", quantity: "2 tbsp" },
      { name: "Salt", quantity: "to taste" },
    ],
    steps: [
      "Preheat oven to 500°F with a pizza stone or baking sheet inside.",
      "Roll out pizza dough on a floured surface to 12-inch round.",
      "Crush tomatoes by hand and spread evenly over dough, leaving a 1-inch border.",
      "Tear mozzarella into pieces and distribute over tomatoes.",
      "Slide pizza onto hot stone and bake 10-12 minutes until crust is golden and cheese bubbles.",
      "Top with fresh basil leaves, drizzle with olive oil, and season with salt.",
    ],
  },
  {
    title: "Chicken Tikka Masala",
    servings: 6,
    timeMinutes: 60,
    cuisine: "Indian",
    dietary: ["gluten-free"],
    ingredients: [
      { name: "Chicken thighs", quantity: "2 lbs" },
      { name: "Plain yogurt", quantity: "1 cup" },
      { name: "Garam masala", quantity: "2 tbsp" },
      { name: "Turmeric", quantity: "1 tsp" },
      { name: "Cumin", quantity: "1 tsp" },
      { name: "Heavy cream", quantity: "1 cup" },
      { name: "Tomato puree", quantity: "1 can (15 oz)" },
      { name: "Onion", quantity: "1 large" },
      { name: "Garlic", quantity: "4 cloves" },
      { name: "Ginger", quantity: "1 inch piece" },
    ],
    steps: [
      "Cut chicken into bite-sized pieces. Mix yogurt, garam masala, turmeric, and cumin. Marinate chicken for 30 minutes.",
      "Grill or broil chicken until charred, about 10 minutes. Set aside.",
      "Sauté diced onion in butter until golden. Add minced garlic and grated ginger, cook 1 minute.",
      "Add tomato puree, simmer 15 minutes. Stir in heavy cream.",
      "Add cooked chicken to sauce, simmer 10 minutes. Season with salt and cilantro.",
      "Serve with basmati rice or warm naan bread.",
    ],
  },
  {
    title: "Vegan Buddha Bowl",
    servings: 2,
    timeMinutes: 30,
    cuisine: "Mediterranean",
    dietary: ["vegan", "gluten-free", "dairy-free"],
    ingredients: [
      { name: "Quinoa", quantity: "1 cup" },
      { name: "Chickpeas", quantity: "1 can (15 oz)" },
      { name: "Sweet potato", quantity: "1 large" },
      { name: "Kale", quantity: "2 cups" },
      { name: "Tahini", quantity: "3 tbsp" },
      { name: "Lemon juice", quantity: "2 tbsp" },
      { name: "Olive oil", quantity: "3 tbsp" },
      { name: "Cumin", quantity: "1 tsp" },
      { name: "Paprika", quantity: "1 tsp" },
    ],
    steps: [
      "Cook quinoa according to package directions.",
      "Dice sweet potato into cubes, toss with olive oil, cumin, and paprika. Roast at 400°F for 20 minutes.",
      "Drain chickpeas, pat dry, and roast alongside sweet potato for 20 minutes until crispy.",
      "Massage kale with a drizzle of olive oil and a pinch of salt.",
      "Make dressing: whisk tahini, lemon juice, 2 tbsp warm water, and salt until smooth.",
      "Assemble bowls: quinoa base, topped with roasted sweet potato, crispy chickpeas, kale, and drizzle with tahini dressing.",
    ],
  },
  {
    title: "Beef Tacos with Fresh Salsa",
    servings: 4,
    timeMinutes: 25,
    cuisine: "Mexican",
    dietary: ["nut-free"],
    ingredients: [
      { name: "Ground beef", quantity: "1 lb" },
      { name: "Corn tortillas", quantity: "8 small" },
      { name: "Tomatoes", quantity: "3 medium" },
      { name: "White onion", quantity: "1/2 medium" },
      { name: "Cilantro", quantity: "1/4 cup" },
      { name: "Lime", quantity: "1" },
      { name: "Chili powder", quantity: "1 tbsp" },
      { name: "Cumin", quantity: "1 tsp" },
      { name: "Garlic powder", quantity: "1 tsp" },
      { name: "Avocado", quantity: "1" },
    ],
    steps: [
      "Dice tomatoes, onion, and cilantro. Mix with lime juice and salt for pico de gallo.",
      "Brown ground beef in a skillet over medium-high heat, breaking apart as it cooks.",
      "Add chili powder, cumin, garlic powder, salt, and 1/4 cup water. Simmer until liquid reduces.",
      "Warm tortillas in a dry skillet or directly over a gas flame.",
      "Slice avocado. Assemble tacos: beef, pico de gallo, and avocado slices.",
      "Serve with lime wedges and your favorite hot sauce.",
    ],
  },
  {
    title: "Miso Ramen with Soft Egg",
    servings: 2,
    timeMinutes: 45,
    cuisine: "Japanese",
    dietary: [],
    ingredients: [
      { name: "Ramen noodles", quantity: "2 packs" },
      { name: "White miso paste", quantity: "3 tbsp" },
      { name: "Chicken broth", quantity: "4 cups" },
      { name: "Eggs", quantity: "2" },
      { name: "Pork belly", quantity: "6 oz" },
      { name: "Green onions", quantity: "4" },
      { name: "Soy sauce", quantity: "1 tbsp" },
      { name: "Sesame oil", quantity: "1 tsp" },
      { name: "Garlic", quantity: "2 cloves" },
      { name: "Ginger", quantity: "1 tsp grated" },
      { name: "Corn kernels", quantity: "1/2 cup" },
      { name: "Nori sheets", quantity: "2 sheets" },
    ],
    steps: [
      "Bring water to boil, gently lower eggs in, boil exactly 6.5 minutes, then transfer to ice water.",
      "Slice pork belly into thin pieces. Sear in a hot pan until crispy on both sides.",
      "Sauté minced garlic and grated ginger in sesame oil until fragrant, about 1 minute.",
      "Add chicken broth, bring to simmer. Whisk in miso paste and soy sauce until fully dissolved.",
      "Cook ramen noodles according to package directions, drain well.",
      "Divide noodles between bowls, pour hot miso broth over. Top with sliced pork, halved soft-boiled egg, corn, sliced green onions, and nori.",
    ],
  },
  {
    title: "Greek Salad with Grilled Chicken",
    servings: 2,
    timeMinutes: 20,
    cuisine: "Greek",
    dietary: ["low-carb", "nut-free"],
    ingredients: [
      { name: "Chicken breast", quantity: "1 large" },
      { name: "Romaine lettuce", quantity: "1 head" },
      { name: "Cucumber", quantity: "1" },
      { name: "Cherry tomatoes", quantity: "1 cup" },
      { name: "Kalamata olives", quantity: "1/2 cup" },
      { name: "Feta cheese", quantity: "4 oz" },
      { name: "Red onion", quantity: "1/2" },
      { name: "Extra virgin olive oil", quantity: "3 tbsp" },
      { name: "Red wine vinegar", quantity: "1 tbsp" },
      { name: "Dried oregano", quantity: "1 tsp" },
    ],
    steps: [
      "Season chicken breast with salt, pepper, and oregano. Grill or pan-sear 6-7 minutes per side until cooked through.",
      "Let chicken rest 5 minutes, then slice against the grain.",
      "Chop romaine, dice cucumber and red onion, halve cherry tomatoes.",
      "Combine vegetables in a large bowl with olives.",
      "Make dressing: whisk olive oil, red wine vinegar, oregano, salt, and pepper.",
      "Toss salad with dressing, top with sliced chicken and crumbled feta cheese.",
    ],
  },
]

async function main() {
  console.log("Seeding recipes...")

  for (const recipe of SEED_RECIPES) {
    await prisma.recipe.create({
      data: {
        ...recipe,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        isPublic: true,
        userId: "seed",
      },
    })
    console.log(`  Created: ${recipe.title}`)
  }

  console.log("Seeding complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
