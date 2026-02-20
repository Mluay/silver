const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  await p.$connect();
  console.log('تم الاتصال بقاعدة البيانات بنجاح');
  const r = await p.$queryRaw`SELECT 1 as test`;
  console.log('نتيجة الاستعلام:', r);
  await p.$disconnect();
}

main().catch((e) => {
  console.error('فشل الاتصال:', e.message);
  process.exit(1);
});
