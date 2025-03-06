import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mail.com' },
    update: {},
    create: {
      name: 'admin',
      email: 'admin@mail.com',
      role: 'ADMIN',
      password_hash:
        '$2a$06$yvFcX.HRU2ZInPZMMJFZgeKRfcIExTSHWHzQUxt2K8wCYyMpwB/eG', // 123456
    },
  })
  const member = await prisma.user.upsert({
    where: { email: 'member@mail.com' },
    update: {},
    create: {
      name: 'member',
      email: 'member@mail.com',
      role: 'MEMBER',
      password_hash:
        '$2a$06$TGLolYUQ9jmRL3vPdokOIOr28rV.kgS.Nd/XGh9g/XyadTbm7hYoW', // 123456
    },
  })
  console.log({ admin, member })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
