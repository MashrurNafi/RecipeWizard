import "dotenv/config"
import { app } from "./app"
import { purgeExpiredTrash } from "./modules/recipe/recipe.service"

const PORT = process.env.PORT || 3001

const TRASH_RETENTION_MS = 30 * 24 * 60 * 60 * 1000

async function cleanupExpiredTrash() {
  try {
    const purged = await purgeExpiredTrash(TRASH_RETENTION_MS)
    if (purged > 0) console.log(`[trash] permanently deleted ${purged} expired recipe(s)`)
  } catch (error) {
    console.error("[trash] cleanup failed:", error)
  }
}

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
  cleanupExpiredTrash()
  setInterval(cleanupExpiredTrash, 24 * 60 * 60 * 1000)
})
