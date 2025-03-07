import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
  const cpf = '18794371040' // random CPF
  const user = await prisma.user.upsert({
    where: { cpf },
    update: {},
    create: {
      name: 'admin',
      cpf,
      phone: '+99 999 9 9999 9999',
      password: '$2a$06$yvFcX.HRU2ZInPZMMJFZgeKRfcIExTSHWHzQUxt2K8wCYyMpwB/eG', // 123456
    },
  })

  const email = 'admin@mail.com'
  const admin = await prisma.admin.upsert({
    where: { email },
    update: {},
    create: {
      id: '607012d8-db76-41bc-bfac-eedad8bd4568',
      email,
      userId: user.id,
    },
  })

  console.log({ user, admin })
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
