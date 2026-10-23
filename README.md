# DSENG Propostas

Sistema de propostas comerciais da **DSENG DESIGNER**. O Douglas entra no painel
com login, cria a proposta de cada cliente (nome, empresa, projeto, valor e
validade), salva e o sistema gera um **link público só daquele cliente**
(`/p/<código>`). Se ele editar a proposta depois, **o mesmo link se atualiza** —
não precisa gerar link novo. O painel também mostra quantas vezes cada proposta
foi visualizada.

- **Painel:** `/admin` (precisa de login)
- **Proposta pública:** `/p/<código>` (só abre se a proposta estiver publicada)
- **Demonstração local:** `/p/exemplo`

Stack: Next.js 15 + TypeScript + Tailwind + Prisma. No computador, o banco é
SQLite (um arquivo, sem instalar nada); na internet, PostgreSQL (Neon) na
Vercel — o passo a passo está no fim deste arquivo. O `prisma/schema.prisma`
vai commitado já com o provider `postgresql` (produção); para o teste local
com SQLite, o provider é trocado só temporariamente (o topo do schema
explica).

## Imagens (embutidas no código)

Não há arquivos de imagem em `public/` — a pasta não guarda nenhum asset.
Todas as imagens vão **embutidas como data URL** em módulos TypeScript em
`src/assets/`, porque o envio deste código para o GitHub é feito por snapshot
de arquivos de texto (binários não passam):

| Módulo | Conteúdo |
|---|---|
| `src/assets/logo.ts` | Logo DS branca (`LOGO_DS_BRANCA`) |
| `src/assets/douglas.ts` | Foto do Douglas (`FOTO_DOUGLAS`), convertida de PNG para WebP (679 KB → 99 KB) |
| `src/assets/trabalhos.ts` | Os 12 trabalhos do portfólio (`TRABALHOS`) |

Os módulos são gerados por script a partir dos originais — a logo e os
trabalhos estão em `~/workspace/dseng-brand/` e a foto é a do Douglas. Para
trocar uma imagem, substitua o original e regenere o módulo correspondente;
não edite o data URL na mão.

---

## Rodando no seu computador (teste local)

Precisa do Node.js instalado. Na pasta do projeto:

> **Antes dos comandos do Prisma:** o schema está commitado com provider
> `postgresql` (produção). Para o teste local, troque temporariamente o
> provider para `sqlite` em `prisma/schema.prisma` e use
> `DATABASE_URL="file:./dev.db"` — **não commite essa troca**.

```bash
npm install
npx prisma db push         # cria o banco local (SQLite)
npm run db:seed            # cria a proposta de demonstração /p/exemplo
npm run dev                # abre em http://localhost:3000
```

Antes de rodar, crie o arquivo `.env.local` (copie do `.env.example`) com as
suas variáveis. **Detalhe:** os comandos do Prisma (`db push`, `db:seed`)
leem o arquivo `.env` (e não o `.env.local`) — copie a linha `DATABASE_URL`
do `.env.local` para um arquivo `.env` na raiz do projeto (ele também está
no `.gitignore`). O site em si (Next) lê o `.env.local` normalmente. **Login de teste que já vem neste repositório local**
(`.env.local`, só para o seu computador, **nunca** use em produção):

- E-mail: `admin@dseng.local`
- Senha: `dseng-teste-local-2026`

O `.env.local` está no `.gitignore`: ele **não** vai para o GitHub.

---

## A senha do admin (2 jeitos de definir)

O login usa o e-mail da variável `ADMIN_EMAIL` e a senha de **uma** destas
variáveis — as duas ficam **somente no servidor**, nunca aparecem no navegador:

### Opção A — senha em texto puro (a mais simples) ✅

Defina a variável `ADMIN_PASSWORD` com a sua senha, direto no `.env.local`
(no computador) ou no painel de variáveis da Vercel (na internet). Não precisa
gerar nada.

> ⚠️ Como a senha vai "aberta" na variável, use uma **senha longa**: 20
> caracteres ou mais, misturando letras e números, e que você não use em
> nenhum outro lugar.

### Opção B — hash da senha (mais protegido)

Gere o hash no computador e cadastre o resultado em `ADMIN_PASSWORD_HASH`:

```bash
npm run hash -- "sua-senha-aqui"
```

Se `ADMIN_PASSWORD_HASH` existir, **ele tem prioridade** e a Opção A é
ignorada (apague a `ADMIN_PASSWORD` para não confundir).

Nos dois jeitos, troque também o `AUTH_SECRET` por um texto longo e aleatório
só seu: é ele que assina o cookie de sessão de 7 dias do painel.

---

## Como o Douglas usa no dia a dia

1. Entra em `/admin` com e-mail e senha.
2. Clica em **+ Nova proposta** e preenche: cliente, empresa, WhatsApp do
   cliente (opcional), projeto, valores e validade. Os padrões já vêm do
   serviço de logotipo (R$ 230).
3. Deixa o status como **Publicada** e salva.
4. No painel, clica em **Copiar link** — ou em **Enviar no WhatsApp**, que já
   abre a conversa com o cliente com a mensagem pronta e o link.
5. Para corrigir qualquer coisa, abre a proposta, edita e salva: **o link do
   cliente é o mesmo** e já mostra a versão nova.
6. Rascunho não abre para o cliente; a coluna de visualizações mostra se (e
   quando) ele abriu a proposta.

---

## Publicando na internet (Vercel + Neon)

Os toques de conta são do Douglas (ele cria o repositório e importa o projeto,
como fez com o DS Bio). Na ordem:

1. **GitHub:** criar um repositório novo e subir esta pasta para ele.
2. **Vercel:** importar o repositório (Add New → Project). Framework: Next.js,
   sem mudar mais nada.
3. **Banco Neon:** na Vercel, aba **Storage** do projeto → Create Database →
   **Neon** (Postgres). A Vercel cria e já preenche a `DATABASE_URL` sozinha.
   Nenhuma troca no código é necessária: o `prisma/schema.prisma` já vai com
   provider `postgresql`.
4. **Variáveis de ambiente** (Vercel → Settings → Environment Variables):
   - `DATABASE_URL` (vem do passo 3, automática)
   - `AUTH_SECRET` — um texto longo e aleatório, novo (não o do teste local)
   - `ADMIN_EMAIL` — o seu e-mail de login
   - `ADMIN_PASSWORD` — a sua senha longa (Opção A) **ou** `ADMIN_PASSWORD_HASH`
     (Opção B)
   - `NEXT_PUBLIC_APP_URL` — o endereço do projeto na Vercel
     (ex.: `https://proposta-dseng.vercel.app`)
5. **Redeploy:** aba Deployments → ⋯ → Redeploy. O comando de build já cria as
   tabelas no Neon (`prisma db push` roda no `vercel-build`).
6. Abrir o endereço, entrar em `/admin`, criar a primeira proposta de verdade
   e testar o link `/p/...` numa guia anônima.

> A proposta de demonstração (`/p/exemplo`) é criada pelo seed no computador.
> Na produção ela não existe até você criar — o que é o comportamento certo.

## Comandos úteis

| Comando | O que faz |
|---|---|
| `npm run dev` | Roda o site local (porta 3000) |
| `npm run build` | Gera a versão de produção e confere o código |
| `npm run db:seed` | Cria/atualiza a proposta de demonstração |
| `npm run db:studio` | Abre uma tela para ver o banco de dados |
| `npm run hash -- "senha"` | Gera o hash da Opção B |
