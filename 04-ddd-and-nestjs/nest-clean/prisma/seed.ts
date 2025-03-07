import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
  const notificationAcc = await prisma.user.upsert({
    where: { id: '6bc178c7-64c6-4587-ace5-79371dce016c' },
    update: {},
    create: {
      id: '6bc178c7-64c6-4587-ace5-79371dce016c',
      name: 'notification account',
      email: 'notiication@mail.com',
      password: '$2a$06$yvFcX.HRU2ZInPZMMJFZgeKRfcIExTSHWHzQUxt2K8wCYyMpwB/eG', // 123456
    },
  })
  const notification = await prisma.notification.upsert({
    where: { id: 'e1ecc3ea-02af-42ba-939a-7d7ba6ae518c' },
    update: {},
    create: {
      id: 'e1ecc3ea-02af-42ba-939a-7d7ba6ae518c',
      recipientId: '6bc178c7-64c6-4587-ace5-79371dce016c',
      title: 'Sample notification',
      content:
        'This is a seeded notification if you want to see the current notifications in the database, run `npx prisma studio` and open the notifications table',
    },
  })
  console.log({ notificationAcc, notification })
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
