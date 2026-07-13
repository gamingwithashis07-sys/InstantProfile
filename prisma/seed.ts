import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const settingsCount = await prisma.setting.count()
  if (settingsCount === 0) {
    const defaults = [
      ['site_name', 'InstantProfile'],
      ['site_description', 'Instagram Automation Platform — DM, Schedule, Analyze'],
      ['theme', 'dark'],
      ['accent_color', '#f4a261'],
      ['graph_api_version', 'v21.0'],
      ['fb_app_id', ''],
      ['fb_app_secret', ''],
      ['site_url', ''],
      ['admin_secret_code', 'admin2024'],
    ]
    for (const [key, value] of defaults) {
      await prisma.setting.upsert({
        where: { key: key as string },
        update: { value: value as string },
        create: { key: key as string, value: value as string },
      })
    }
    console.log('Default settings seeded')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
