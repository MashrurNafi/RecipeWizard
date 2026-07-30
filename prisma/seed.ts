import "dotenv/config"
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "../src/generated/prisma/client"

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const seedRecipes = [
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
      { name: "Fresh basil", quantity: "1/4 cup" },
      { name: "Extra virgin olive oil", quantity: "2 tbsp" },
      { name: "Salt", quantity: "to taste" },
    ],
    steps: [
      "Preheat oven to 500°F (260°C) with a pizza stone or inverted baking sheet inside.",
      "Roll out pizza dough on a floured surface into a 12-inch circle.",
      "Crush the San Marzano tomatoes by hand and spread evenly over the dough, leaving a 1-inch border.",
      "Tear fresh mozzarella into pieces and distribute over the sauce.",
      "Bake for 10-12 minutes until the crust is golden and cheese is bubbling.",
      "Top with fresh basil leaves, drizzle with olive oil, and season with salt. Slice and serve immediately.",
    ],
  },
  {
    title: "Chicken Tikka Masala",
    servings: 4,
    timeMinutes: 45,
    cuisine: "Indian",
    dietary: ["gluten-free"],
    ingredients: [
      { name: "Chicken thighs", quantity: "1.5 lbs" },
      { name: "Plain yogurt", quantity: "1 cup" },
      { name: "Garam masala", quantity: "2 tbsp" },
      { name: "Tomato puree", quantity: "1 can (14 oz)" },
      { name: "Heavy cream", quantity: "1/2 cup" },
      { name: "Onion", quantity: "1 large" },
      { name: "Garlic", quantity: "4 cloves" },
      { name: "Ginger", quantity: "1-inch piece" },
    ],
    steps: [
      "Cut chicken thighs into bite-sized pieces. Mix with yogurt, 1 tbsp garam masala, and salt. Marinate for at least 30 minutes.",
      "Grill or broil the marinated chicken until charred. Set aside.",
      "Finely chop onion, garlic, and ginger. Sauté in oil until golden, about 8 minutes.",
      "Add tomato puree, remaining garam masala, and simmer for 15 minutes.",
      "Stir in heavy cream and cooked chicken. Simmer for 10 more minutes.",
      "Serve over basmati rice with fresh cilantro on top.",
    ],
  },
  {
    title: "Vegan Buddha Bowl",
    servings: 2,
    timeMinutes: 30,
    cuisine: "Mediterranean",
    dietary: ["vegan", "gluten-free"],
    ingredients: [
      { name: "Quinoa", quantity: "1 cup" },
      { name: "Chickpeas", quantity: "1 can (15 oz)" },
      { name: "Sweet potato", quantity: "1 large" },
      { name: "Kale", quantity: "2 cups" },
      { name: "Tahini", quantity: "3 tbsp" },
      { name: "Lemon juice", quantity: "2 tbsp" },
      { name: "Olive oil", quantity: "3 tbsp" },
    ],
    steps: [
      "Cook quinoa according to package directions. Drain and set aside.",
      "Dice sweet potato into cubes, toss with olive oil and salt, and roast at 400°F for 20 minutes.",
      "Drain chickpeas, pat dry, and roast alongside sweet potato for 20 minutes until crispy.",
      "Massage kale with a drizzle of olive oil and a pinch of salt.",
      "Make dressing: whisk tahini, lemon juice, 2 tbsp warm water, and salt until smooth.",
      "Assemble bowls with quinoa, roasted vegetables, chickpeas, and kale. Drizzle with tahini dressing.",
    ],
  },
  {
    title: "Quick Beef Stir-Fry",
    servings: 3,
    timeMinutes: 20,
    cuisine: "Chinese",
    dietary: ["dairy-free"],
    ingredients: [
      { name: "Beef sirloin", quantity: "1 lb" },
      { name: "Broccoli florets", quantity: "2 cups" },
      { name: "Bell pepper", quantity: "1" },
      { name: "Soy sauce", quantity: "3 tbsp" },
      { name: "Sesame oil", quantity: "1 tbsp" },
      { name: "Garlic", quantity: "3 cloves" },
      { name: "Cornstarch", quantity: "1 tbsp" },
    ],
    steps: [
      "Slice beef thinly against the grain. Toss with 1 tbsp soy sauce and cornstarch.",
      "Heat sesame oil in a wok over high heat until smoking.",
      "Stir-fry beef for 2-3 minutes until browned. Remove from wok.",
      "Add broccoli florets and sliced bell pepper. Stir-fry for 3 minutes.",
      "Add minced garlic and cook for 30 seconds until fragrant.",
      "Return beef to wok, add remaining soy sauce, and toss everything together for 1 minute. Serve over steamed rice.",
    ],
  },
  {
    title: "Greek Salad with Grilled Chicken",
    servings: 2,
    timeMinutes: 25,
    cuisine: "Greek",
    dietary: ["low-carb"],
    ingredients: [
      { name: "Chicken breast", quantity: "2" },
      { name: "Cucumber", quantity: "1" },
      { name: "Cherry tomatoes", quantity: "1 cup" },
      { name: "Feta cheese", quantity: "4 oz" },
      { name: "Kalamata olives", quantity: "1/3 cup" },
      { name: "Red onion", quantity: "1/2" },
      { name: "Greek dressing", quantity: "1/4 cup" },
    ],
    steps: [
      "Season chicken breasts with salt, pepper, and oregano. Grill over medium-high heat for 6-7 minutes per side until cooked through.",
      "Chop cucumber, halve cherry tomatoes, thinly slice red onion.",
      "Combine vegetables in a large bowl with olives.",
      "Cube feta cheese and add to the bowl.",
      "Toss with Greek dressing.",
      "Slice grilled chicken and arrange on top of the salad. Serve immediately.",
    ],
  },
  {
    title: "Spicy Thai Basil Noodles (Pad Krapow)",
    servings: 2,
    timeMinutes: 20,
    cuisine: "Thai",
    dietary: [],
    ingredients: [
      { name: "Rice noodles", quantity: "8 oz" },
      { name: "Ground pork", quantity: "1 lb" },
      { name: "Thai basil", quantity: "1 cup" },
      { name: "Bird eye chilies", quantity: "4" },
      { name: "Garlic", quantity: "4 cloves" },
      { name: "Fish sauce", quantity: "2 tbsp" },
      { name: "Soy sauce", quantity: "1 tbsp" },
      { name: "Sugar", quantity: "1 tsp" },
    ],
    steps: [
      "Cook rice noodles according to package directions. Drain and set aside.",
      "Mince garlic and chilies together in a mortar or food processor.",
      "Heat oil in a wok over high heat. Fry garlic-chili paste for 30 seconds.",
      "Add ground pork and stir-fry, breaking it apart, until cooked through, about 5 minutes.",
      "Season with fish sauce, soy sauce, and sugar. Stir well.",
      "Add Thai basil leaves and cooked noodles. Toss for 1 minute until basil wilts. Serve with a fried egg on top.",
    ],
  },
]

async function main() {
  console.log("Seeding recipes...")

  for (const recipe of seedRecipes) {
    await prisma.recipe.create({
      data: {
        ...recipe,
        userId: "seed",
        isPublic: true,
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
  .finally(async () => {
    await prisma.$disconnect()
  })
