# Ambiente Supabase local — AI Business Autopilot

Este diretório prepara um Supabase **local e isolado** para desenvolvimento. O projeto local usa o identificador `ai-business-autopilot-local`, portas locais e credenciais temporárias emitidas pelo Supabase CLI.

## Regra de segurança

- Não ligar este ambiente ao projeto Supabase de produção.
- Não executar `supabase link`, `supabase db push --remote`, `supabase config push` nem comandos remotos neste fluxo.
- Não copiar chaves, passwords, utilizadores, encomendas ou outros dados de produção para o ambiente local.
- Nunca colocar `service_role`, secret keys, passwords ou tokens no Git.
- O Supabase local é apenas para desenvolvimento e não deve ser exposto à Internet.

## Baselining do esquema

A branch contém agora duas migrações SQL reconhecidas pelo Supabase CLI:

1. `202610150001_create_autopilot_state.sql` — cria a tabela inicial de estado.
2. `20261114160300_reconstruct_live_schema.sql` — reconstrói o esquema final observado no projeto remoto em 14/11/2026, usando apenas metadados do catálogo PostgreSQL.

O snapshot inclui 23 tabelas públicas, constraints, chaves primárias e estrangeiras, índices, 48 políticas RLS, permissões de tabela, a função `rls_auto_enable` e o event trigger `ensure_rls`. Inclui também os comentários das colunas de entrega. Não inclui registos, utilizadores Auth, tokens, passwords, chaves ou outros dados de produção.

**Importante:** o histórico remoto tinha 16 versões de migração, mas os respetivos ficheiros SQL não estavam presentes na branch. O snapshot reconstrói o estado final do esquema, não a sequência histórica original de 16 alterações. A validação local irá confirmar se o baseline é executável e se a estrutura resultante coincide com os metadados capturados.

## Como iniciar e reconstruir localmente

Requisitos: Node.js, Docker Desktop ou outro runtime compatível com Docker e Supabase CLI v3.

Na raiz do repositório:

```bash
npx supabase --version
npx supabase start
npx supabase db reset --local
npx supabase migration list --local
npx supabase status
```

O comando `db reset --local` recria **apenas a base local** e aplica os ficheiros em `supabase/migrations/`. Nunca acrescentes `--remote` nem ligues esta pasta ao projeto de produção.

Para parar:

```bash
npx supabase stop
```

Não introduzas credenciais do projeto remoto nestes comandos.

## O que os testes locais vão validar

1. Arranque do Supabase local.
2. Aplicação das duas migrações locais e das 23 tabelas.
3. Existência das constraints, índices, políticas RLS e proteção automática para novas tabelas.
4. Verificação automática no CI de 23 tabelas, 48 políticas RLS, 78 índices, RLS ativo nas 23 tabelas e presença do event trigger de proteção.\n5. Preparação para criar utilizadores exclusivamente locais através do Auth local.
6. Testes de login, logout, isolamento entre duas contas e persistência no Postgres local.

Até os testes de Auth e persistência da aplicação estarem concluídos, não considerar a integração real validada. Os testes atuais com Supabase simulado continuam a validar apenas a lógica da aplicação.

## Limites de segurança

- Nenhuma migração foi aplicada ao projeto remoto.
- Nenhuma política RLS foi afrouxada.
- Nenhuma conta ou função administrativa foi criada ou alterada.
- Nenhuma compra, pagamento, campanha publicitária ou contacto com fornecedor é iniciado por este ambiente.
