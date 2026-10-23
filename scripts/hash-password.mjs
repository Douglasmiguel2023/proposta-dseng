#!/usr/bin/env node
/**
 * Gera o hash bcrypt da senha do admin.
 * Uso: npm run hash -- "minha-senha-forte"
 * Cole o resultado na variavel ADMIN_PASSWORD_HASH (.env.local / Vercel).
 * A senha em si nunca vai para arquivo nenhum.
 */
import bcrypt from "bcryptjs";

const senha = process.argv[2];
if (!senha || senha.length < 8) {
  console.error('Uso: npm run hash -- "senha-com-pelo-menos-8-caracteres"');
  process.exit(1);
}
console.log(bcrypt.hashSync(senha, 12));
