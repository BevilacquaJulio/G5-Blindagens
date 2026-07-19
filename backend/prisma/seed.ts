import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '../generated/prisma/client';
import { buildDatabaseUrl } from '../src/config/database-url';

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(buildDatabaseUrl()),
});

async function main(): Promise<void> {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@g5.local';
  const adminSenha = process.env.SEED_ADMIN_PASSWORD ?? 'admin123';

  const senhaHash = await bcrypt.hash(adminSenha, 10);
  await prisma.usuario.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      nome: 'Administrador',
      email: adminEmail,
      senha: senhaHash,
      cargo: 'ADMINISTRADOR',
    },
  });

  const categorias = ['Vidros', 'Aço', 'Manta Balística', 'Acessórios'];
  for (const nome of categorias) {
    await prisma.categoria.upsert({
      where: { nome },
      update: {},
      create: { nome },
    });
  }

  const categoriasDespesa = ['Operacional', 'Materiais', 'Salários', 'Impostos'];
  for (const nome of categoriasDespesa) {
    await prisma.categoriaDespesa.upsert({
      where: { nome },
      update: {},
      create: { nome },
    });
  }

  const financeiroSenha = process.env.SEED_FINANCEIRO_SENHA ?? 'financeiro123';
  const financeiroSenhaHash = await bcrypt.hash(financeiroSenha, 10);
  await prisma.configSistema.upsert({
    where: { id: 1 },
    update: { financeiroSenhaHash },
    create: { id: 1, financeiroSenhaHash },
  });

  // eslint-disable-next-line no-console
  console.log(`Seed concluído. Admin: ${adminEmail} / senha: ${adminSenha}`);
  // eslint-disable-next-line no-console
  console.log(`Senha financeiro (desbloqueio): ${financeiroSenha}`);
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
