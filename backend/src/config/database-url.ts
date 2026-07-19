/**
 * Constrói a URL de conexão MySQL a partir das variáveis de ambiente MYSQL_*.
 *
 * Regras críticas (ver backend-nestjs-rules):
 * - user e password são codificados com encodeURIComponent para que
 *   caracteres como @ # : / ? & = não corrompam a URL.
 * - a URL termina com ?charset=utf8mb4.
 *
 * É usada tanto pelo driver adapter em runtime (PrismaService) quanto pela
 * CLI do Prisma em prisma.config.ts (migrations).
 */
export function buildDatabaseUrl(): string {
  const host = process.env.MYSQL_HOST ?? 'localhost';
  const port = process.env.MYSQL_PORT ?? '3306';
  const user = encodeURIComponent(process.env.MYSQL_USER ?? 'root');
  const password = encodeURIComponent(process.env.MYSQL_PASSWORD ?? '');
  const database = process.env.MYSQL_DATABASE ?? 'g5';

  return `mysql://${user}:${password}@${host}:${port}/${database}?charset=utf8mb4`;
}
