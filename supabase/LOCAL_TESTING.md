# Ambiente Supabase local — AI Business Autopilot

Este diretório prepara um Supabase **local e isolado** para desenvolvimento. O projeto local usa o identificador `ai-business-autopilot-local`, portas locais e credenciais temporárias emitidas pelo Supabase CLI.

## Regra de segurança

- Não ligar este ambiente ao projeto Supabase de produção.
- Não executar `supabase link`, `supabase db push --remote`, `supabase config push` nem comandos remotos neste fluxo.
- Não copiar chaves, passwords, utilizadores, encomendas ou outros dados de produção para o ambiente local.
- Nunca colocar `service_role`, secret keys, passwords ou tokens no Git.
- O Supabase local é apenas para desenvolvimento e não deve ser exposto à Internet.

## Estado atual e limitação conhecida

A configuração local está preparada, mas **a reprodução integral da base de dados ainda não está pronta**. O repositório contém apenas uma migração antiga e incompleta para `autopilot_state`; não contém o baseline das 23 tabelas, constraints, funções e políticas RLS atuais. A migração existente também não tem a extensão `.sql` esperada pelo CLI.

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

1. Criar uma migração baseline fiel, obtida e revista sem dados de produção.
2. Incluir as políticas RLS, funções, triggers, índices e relações atuais.
3. Criar utilizadores exclusivamente locais através do Auth local.
4. Testar login, logout, isolamento entre duas contas e persistência no Postgres local.
5. Executar os testes no GitHub Actions antes de considerar qualquer alteração de produção.

Até estes passos estarem concluídos, os testes atuais com Supabase simulado continuam a ser a única validação da camada de persistência da aplicação.
