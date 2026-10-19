# AutoEscola 3ESA — Front-End Remodelado (React + TypeScript + Vite + Tailwind CSS)

Interface SaaS moderna projetada para se conectar diretamente ao Back-End `.NET 8` (`Auto-Escola-Back-End`), com **Controle de Acesso por Perfil (RBAC)**, **Wizard de Agendamento em 3 Passos** e **Modo Simulação Híbrido**.

---

## Como Rodar o Projeto

1. Extraia o arquivo `.zip` e instale as dependências:
   ```bash
   npm install
   ```

2. (Opcional) Caso a sua API `.NET` esteja rodando em uma porta diferente de `5000`, crie um arquivo `.env` na raiz (ou edite a URL) apontando para a porta exibida no terminal do `dotnet run`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

---

## Funcionalidades Implementadas

1. **Login Split-Screen + Demo Mode (1-Clique):**
   * Autenticação real via JWT (`POST /api/auth/login`) aceitando **E-mail ou CPF**.
   * **3 Botões de Acesso Rápido** (*Visão Aluno*, *Visão Instrutor* e *Visão Admin*). Se o Back-End `.NET` estiver rodando, faz login real na API; se estiver desligado, ativa automaticamente o **Modo Simulação Local** para você navegar e testar todas as telas sem travar.
2. **Portal do Aluno (`StudentDashboard.tsx`):**
   * **Tracker de Progresso da CNH:** Barra de evolução (`12/20 aulas práticas = 60%`) e cards das 4 etapas do DETRAN (*Exame Médico*, *Curso Teórico*, *Prática de Direção* e *Exame Prático*).
   * **Wizard de Agendamento em 3 Passos:** Escolha de Data -> Consulta de slots livres (`GET /api/lessons/available-slots`) -> Escolha da dupla Instrutor + Veículo e confirmação (`POST /api/lessons`).
   * **Cancelamento Transparente:** Botão de cancelar aula integrado à validação de 24h do Back-End.
3. **Painel do Instrutor (`InstructorDashboard.tsx`):**
   * Agenda diária com modal de **Check-out de Aula** (`PATCH /api/lessons/{id}/complete`), avaliação de 1 a 5 estrelas e observações pedagógicas que incrementam automaticamente o progresso do aluno.
4. **Painel da Secretaria / Admin (`AdminDashboard.tsx`):**
   * KPIs operacionais em tempo real (`GET /api/dashboard/admin`).
   * Controle rápido de frota alternando veículos entre `ACTIVE` e `MAINTENANCE`.
   * Formulário de matrícula de novos alunos (`POST /api/management/students`) que gera a senha temporária com os 6 primeiros dígitos do CPF.
