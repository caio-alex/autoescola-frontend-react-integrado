# 🚀 Front-End Application — Plataforma Web Moderna

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

> **Uma aplicação web de alta performance, escalável e responsiva, construída com o ecossistema mais moderno de desenvolvimento Front-End.**

---

## 🌟 Sobre o Projeto

Este projeto consiste na interface **Front-End** de uma plataforma web moderna, projetada para oferecer uma **experiência de utilizador (UX) fluida, intuitiva e rápida**. Desenvolvida sob uma arquitetura baseada em componentes reutilizáveis e tipagem estática rigorosa, a aplicação garante segurança no código, facilidade de manutenção e carregamento instantâneo.

---

## ✨ Principais Funcionalidades

* 💻 **Interface Moderna e Responsiva (Mobile-First):** Layout adaptável que proporciona uma experiência perfeita em smartphones, tablets e desktops.
* ⚡ **Navegação SPA (Single Page Application):** Transições de página e atualizações de estado instantâneas, sem necessidade de recarregar o navegador.
* 🔄 **Integração Dinâmica com API REST:** Consumo assíncrono de dados em tempo real com tratamento inteligente de estados de carregamento (*loading*), sucesso e erro.
* 🔍 **Listagem, Pesquisa e Filtragem Dinâmica:** Visualização organizada de registos com busca rápida e atualização reativa da interface.
* 📝 **Formulários Interativos com Validação:** Entrada de dados segura com feedback visual imediato para o utilizador antes do envio das informações.
* 🔔 **Feedback Visual e Notificações:** Alertas intuitivos, modais de confirmação e indicadores de progresso para todas as ações do utilizador.
* 🧩 **Arquitetura Componentizada:** Componentes de UI modulares (botões, cards, inputs, cabeçalhos e modais) padronizados para manter a consistência visual em todo o sistema.

---

## 🛠️ Tecnologias Utilizadas e Porquê

O projeto utiliza uma stack moderna focada em **produtividade, performance e qualidade de código**:

### Core Front-End
* **[React.js](https://react.dev/):** Biblioteca líder de mercado para criação de interfaces declarativas e reativas através de Hooks (`useState`, `useEffect`, `useContext`, etc.) e componentes funcionais.
* **[TypeScript](https://www.typescriptlang.org/):** Adiciona tipagem estática inteligente ao JavaScript, documentando as estruturas de dados (`interfaces` e `types`), melhorando o autocompletar da IDE e eliminando bugs comuns antes mesmo do código ir para produção.
* **[Vite](https://vitejs.dev/):** Ferramenta de *build* de última geração com *Hot Module Replacement (HMR)* instantâneo em desenvolvimento e empacotamento altamente otimizado (via Rollup) para produção.

### Estilização, Rotas e Comunicação
* **CSS Moderno / Tailwind CSS:** Estilização ágil, responsiva e consistente, garantindo fidelidade visual e suporte a animações suaves.
* **React Router DOM:** Gestão de rotas no lado do cliente (*Client-Side Routing*) para navegação fluida entre diferentes páginas e vistas da aplicação.
* **Fetch API / Axios:** Camada de serviços dedicada para comunicação HTTP assíncrona com o Back-End.
* **Lucide Icons / React Icons:** Biblioteca de ícones vetoriais leves e modernos para enriquecer a usabilidade da interface.

### Qualidade de Código e DevOps
* **ESLint:** Análise estática de código para manter o padrão de escrita e seguir as melhores práticas do React e TypeScript.
* **Git & GitHub:** Controlo de versão distribuído e hospedagem do código-fonte.
* **[Vercel](https://vercel.com/):** Infraestrutura Cloud com pipeline de **CI/CD (Integração e Entrega Contínua)** — cada `git push` na branch principal gera automaticamente um novo deploy otimizado em CDN global.

---

## 📁 Arquitetura e Estrutura de Pastas

O projeto foi organizado seguindo padrões de mercado (*Clean Architecture / Feature-based*) para facilitar a escalabilidade:

```text
├── public/              # Ativos estáticos públicos (favicon, imagens diretas)
├── src/                 # Código-fonte principal da aplicação
│   ├── assets/          # Imagens, ícones customizados e estilos globais
│   ├── components/      # Componentes de UI reutilizáveis ( Navbar, Footer, Cards, Buttons )
│   ├── contexts/        # Gestão de estado global da aplicação (Context API)
│   ├── hooks/           # Custom Hooks para lógica reutilizável
│   ├── pages/           # Vistas principais e páginas associadas às rotas
│   ├── services/        # Configuração de clientes HTTP e chamadas à API
│   ├── types/           # Interfaces e tipagens globais do TypeScript
│   ├── utils/           # Funções utilitárias e formatadores (datas, moedas, textos)
│   ├── App.tsx          # Componente raiz e configuração de provedores/rotas
│   └── main.tsx         # Ponto de entrada que injeta o React na DOM
├── .gitignore           # Ficheiros ignorados pelo Git (node_modules, dist, .env)
├── index.html           # Template HTML principal otimizado para SEO
├── package.json         # Manifesto do projeto, dependências e scripts
├── tsconfig.json        # Regras rigorosas do compilador TypeScript
└── vite.config.ts       # Configurações de build e plugins do Vite
```

---

## ⚙️ Como Executar o Projeto Localmente

Segue o passo a passo abaixo para testar e desenvolver o projeto na tua máquina:

### 📋 Pré-requisitos
* **[Node.js](https://nodejs.org/)** (versão 18 LTS ou superior)
* **[Git](https://git-scm.com/)** instalado

### 🚀 Passo a Passo

1. **Clona o repositório:**
   ```bash
   git clone <URL_DO_TEU_REPOSITORIO>
   cd <NOME_DA_PASTA_DO_PROJETO>
   ```

2. **Instala todas as dependências:**
   ```bash
   npm install
   ```

3. **Configura as Variáveis de Ambiente (Opcional):**
   Cria um ficheiro `.env` na raiz do projeto caso precises apontar para uma API específica:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. **Inicia o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acede no navegador:**
   Abre [http://localhost:5173](http://localhost:5173) para ver a aplicação a funcionar em tempo real!

---

## 📦 Scripts Disponíveis

| Script | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento com recarregamento instantâneo (HMR). |
| `npm run build` | Compila o TypeScript e gera a versão minificada e otimizada para produção na pasta `dist/`. |
| `npm run preview` | Simula localmente o servidor de produção a partir da pasta `dist/`. |
| `npm run lint` | Verifica a qualidade do código em busca de erros de sintaxe ou tipagem. |

---
