# Ambiente Supabase local — AI Business Autopilot

Este diretório prepara um Supabase **local e isolado** para desenvolvimento. O projeto local usa o identificador `ai-business-autopilot-local`, portas locais e credenciais temporárias emitidas pelo Supabase CLI.

## Regra de segurança

- Não ligar este ambiente ao projeto Supabase de produção.
- Não executar `supabase link`, `supabase db push --remote`, `supabase config push` nem comandos remotos neste fluxo.
- Não copiar chaves, passwords, utilizadores, encomendas ou outros dados de produção para o ambiente local.
- Nunca colocar `service_role`, secret keys, passwords ou tokens no Git.
- O Supabase local é apenas para desenvolvimento e não deve ser exposto à Internet.

## Estado atual e limitação conhecida

A configuração local está preparada e o GitHub Actions confirmou que o Supabase local inicia, verifica os serviços e encerra corretamente.

A reprodução integral da base de dados ainda não está pronta. A leitura **somente de metadados** do projeto remoto identificou 23 tabelas públicas com RLS ativo e 16 versões de migração registadas no histórico do Supabase. Contudo, os ficheiros SQL correspondentes não estão disponíveis no caminho convencional `supabase/migrations/` da branch; várias tentativas de leitura dos ficheiros esperados devolveram 404. O repositório contém uma migração antiga e incompleta para `autopilot_state`, sem a extensão `.sql` esperada pelo CLI.

Por segurança, não foi criada uma versão aproximada do esquema nem foram removidas as restrições administrativas. Fazer isso poderia produzir testes que passam num esquema diferente daquele que está em produção.

## Como iniciar o serviço local

Requisitos: Node.js, Docker Desktop ou outro runtime compatível com Docker e Supabase CLI v3.

Na raiz do repositório:

```bash
npx supabase --version
npx supabase start
npx supabase status
```

O primeiro arranque descarrega imagens e pode demorar. O CLI mostra os endereços locais e as chaves temporárias. Para parar:

```bash
npx supabase stop
```

Não introduzas credenciais do projeto remoto nestes comandos.

## O que falta para os testes reais

1. Recuperar e rever os ficheiros SQL originais das migrações registadas, ou produzir um baseline de esquema fiel a partir de metadados revistos.
2. Incluir as políticas RLS, funções, triggers, índices, constraints e relações atuais.
3. Validar o baseline exclusivamente no Supabase local, sem dados de produção.
4. Criar utilizadores exclusivamente locais através do Auth local.
5. Testar login, logout, isolamento entre duas contas e persistência no Postgres local.
6. Executar os testes no GitHub Actions antes de considerar qualquer alteração de produção.

Até estes passos estarem concluídos, os testes atuais com Supabase simulado continuam a ser a única validação da camada de persistência da aplicação.
