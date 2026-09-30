# Auto Escola — Front-end

Front-end em React (Vite) para a [API da Auto Escola](https://github.com/caio-alex/Auto-Escola-Back-End).

## Stack

- React 19 + Vite
- React Router (rotas e navegação)
- Axios (chamadas HTTP, com token JWT anexado automaticamente)

## Como rodar

### 1. Suba a API primeiro

Este front-end espera a API rodando em `http://localhost:8085` (o padrão do projeto
backend). Confirme que ela está no ar antes de continuar.

### 2. Instale as dependências

```bash
npm install
```

### 3. Rode em modo desenvolvimento

```bash
npm run dev
```

Abra `http://localhost:5173`. **Precisa ser essa porta** — o CORS da API só libera
`http://localhost:5173`. Se o Vite subir em outra porta (porque a 5173 já está em
uso), pare o outro processo e rode de novo.

### 4. Login

Use o usuário admin criado pela migration do backend:

- **Login:** `admin`
- **Senha:** `admin123`

## Configuração

A URL da API fica em `.env`:

```
VITE_API_URL=http://localhost:8085
```

## O que tem aqui

| Área | Rotas | Observação |
|---|---|---|
| Instrutores | listar, cadastrar, editar, excluir | detalhe e edição exigem perfil ADMIN |
| Alunos | listar, cadastrar, editar, excluir | detalhe e edição exigem perfil ADMIN |
| Instruções | listar, agendar, cancelar | listar/agendar liberado para ADMIN e USER |
| Usuários | listar, cadastrar | exige perfil ADMIN |

## Sobre permissões (ADMIN, USER, ALUNO, INSTRUTOR)

Depois do login, o front chama `GET /usuarios/me` para descobrir o perfil de quem
entrou (o token JWT em si não carrega essa informação). Com isso, o menu e as
telas se ajustam:

| Perfil | Vê no menu | Pode fazer |
|---|---|---|
| ADMIN | Instrutores, Alunos, Instruções, Usuários | tudo |
| USER | Instrutores, Alunos, Instruções | mesmo acesso de sempre, exceto gerenciar usuários |
| ALUNO | Instrutores (só visualizar), Instruções | ver instrutores, agendar e cancelar as **próprias** instruções |
| INSTRUTOR | Instruções | ver a **própria agenda** e cancelar (não agenda) |

Essa filtragem no front é só uma conveniência de UX (evita mostrar uma tela ou
botão que vai dar erro). A permissão de verdade é sempre aplicada pela API — se
alguém forçar uma URL fora do que o perfil permite, a API responde 403 e a tela
mostra a mensagem de permissão.

## Sobre a sessão

O token expira em 30 minutos (configurado no backend) e não há renovação
automática. Se as requisições começarem a falhar com "sessão expirada", faça login
de novo.

## Pendências conhecidas do backend (fora do controle deste front)

Algumas exceções da API ainda não têm tratamento específico (Fase 3 do backend) e
retornam **500** em vez do código HTTP correto — por exemplo, cadastrar um usuário
com login duplicado. O front trata esses casos com uma mensagem genérica de erro,
mas a mensagem específica só vai aparecer quando o backend tratar essas exceções.
