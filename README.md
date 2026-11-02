# DESENROLAE — Plataforma Inteligente de Organização de Estudos

Plataforma moderna, profissional e completa para organização de estudos com cronograma de consistência, gráfico burnup, gerenciamento de matérias e temas, quadro Kanban de pendências, metas diárias/semanais/mensais, temporizador Pomodoro & Cronômetro, sistema de conquistas e persistência com IndexedDB e exportação JSON/CSV.

---

## 🛠️ 1. Aplicativos e Ferramentas Necessárias

Para criar e rodar este aplicativo no seu computador do zero, você precisará instalar apenas **3 programas gratuitos**:

1. **Node.js (versão 18 ou superior - LTS recomendada)**
   - O que é: O motor que executa o JavaScript/TypeScript e gerencia as dependências do projeto.
   - Onde baixar: [nodejs.org](https://nodejs.org/) (baixe a versão LTS).
   - Como testar se instalou: abra o terminal (Prompt de Comando ou PowerShell no Windows, Terminal no Mac/Linux) e digite:
     ```bash
     node -v
     npm -v
     ```

2. **VS Code (Visual Studio Code)**
   - O que é: O editor de código mais utilizado e recomendado para programar em React e TypeScript.
   - Onde baixar: [code.visualstudio.com](https://code.visualstudio.com/)
   - Extensões recomendadas no VS Code:
     - *Tailwind CSS IntelliSense*
     - *ES7+ React/Redux/React-Native snippets*
     - *Prettier - Code formatter*

3. **Navegador Web Moderno**
   - Google Chrome, Microsoft Edge, Brave ou Firefox para abrir o aplicativo (`http://localhost:3000`).

---

## 📁 2. Estrutura Completa de Pastas e Arquivos

Crie ou verifique a seguinte estrutura no seu projeto:

```text
desenrolae/
├── index.html                  # Arquivo HTML principal com fontes e títulos
├── package.json                # Lista de pacotes e scripts do projeto
├── tsconfig.json               # Configurações do TypeScript
├── vite.config.ts              # Configuração do Vite e Tailwind CSS v4
├── .env.example                # Exemplo de variáveis de ambiente
├── src/
│   ├── main.tsx                # Ponto de entrada do React
│   ├── index.css               # Estilos globais e Tailwind CSS v4
│   ├── App.tsx                 # Componente raiz com navegação e modais
│   │
│   ├── types/
│   │   └── index.ts            # Interfaces TypeScript (Subject, Task, Goal, etc.)
│   │
│   ├── services/
│   │   ├── calculations.ts     # Central de regras matemáticas e progresso
│   │   ├── achievements.ts     # Sistema de conquistas e marcos
│   │   └── storage.ts          # Persistência IndexedDB e LocalStorage
│   │
│   ├── context/
│   │   └── AppContext.tsx      # Gerenciamento global de estado e CRUD
│   │
│   ├── components/
│   │   ├── Sidebar.tsx                 # Barra lateral de navegação e disciplinas
│   │   ├── Header.tsx                  # Cabeçalho com ações e perfil
│   │   ├── ConsistencyCalendar.tsx     # Calendário de consistência e streak
│   │   ├── MiniCalendar.tsx            # Calendário mensal com dias ativos
│   │   ├── BurnupChart.tsx             # Gráfico Burnup em SVG interativo
│   │   ├── WeeklyGoalsBanner.tsx       # Banner de metas da semana
│   │   ├── DisciplinesRankingTable.tsx # Tabela ranking de matérias
│   │   ├── QuickTimerFloatingButton.tsx# Botão flutuante analógico
│   │   ├── StudyTimerModal.tsx         # Modal do Pomodoro e Cronômetro
│   │   ├── TaskModal.tsx               # Modal de criação/edição de tarefas
│   │   ├── SubjectModal.tsx            # Modal de cadastro de matérias
│   │   ├── GoalModal.tsx               # Modal de criação de metas
│   │   ├── ConfirmModal.tsx            # Modal de confirmação de exclusão
│   │   └── Toast.tsx                   # Notificações visuais de feedback
│   │
│   ├── pages/
│   │   ├── DashboardPage.tsx           # Painel geral com KPIs e gráficos
│   │   ├── PendingTasksPage.tsx        # Página de pendências (Lista e Kanban)
│   │   ├── SubjectsPage.tsx            # Galeria de matérias
│   │   ├── SubjectDetailPage.tsx       # Página detalhada de uma matéria
│   │   ├── GoalsPage.tsx               # Página de planejamento de metas
│   │   ├── AchievementsPage.tsx        # Página de medalhas e histórico
│   │   └── BackupSettingsPage.tsx      # Exportação JSON/CSV e restauração
│   │
│   └── tests/
│       └── calculations.test.ts        # Testes unitários das regras de negócio
```

---

## 🚀 3. Passo a Passo de Execução no Terminal

### Passo 1: Criar a pasta do projeto com Vite
Abra o seu terminal e execute:
```bash
npm create vite@latest desenrolae -- --template react-ts
cd desenrolae
```

### Passo 2: Instalar as dependências necessárias
Execute o seguinte comando para instalar todas as bibliotecas usadas:
```bash
npm install lucide-react canvas-confetti motion express dotenv
npm install -D @tailwindcss/vite tailwindcss @types/canvas-confetti tsx
```

### Passo 3: Inserir os arquivos de código
Abra a pasta `desenrolae` no VS Code (`code .` no terminal).  
Copie o conteúdo de cada arquivo exatamente no caminho indicado na seção 2.

### Passo 4: Executar o aplicativo
No terminal do VS Code, execute:
```bash
npm run dev
```
O terminal exibirá uma mensagem como:
```
  VITE v8.3.0  ready in 200 ms

  ➜  Local:   http://localhost:3000/
```
Abra o link no navegador para ver o DESENROLAE funcionando 100%!

### Passo 5: Rodar os testes unitários das regras de negócio
Para verificar se todos os cálculos matemáticos e regras de status estão corretos:
```bash
npm test
```
Saída esperada:
```
--- EXECUTING BUSINESS LOGIC TESTS FOR DESENROLAE ---
✓ PASS: Clamps > 100% to 100%
✓ PASS: Status from progress rules
✓ PASS: Average of 100%, 50%, 0% is 50%
✓ PASS: Sub1 progress is 75%
✓ PASS: Identifies task due today
✓ PASS: All business logic tests passed!
```

---

## 💾 4. Recursos de Armazenamento e Segurança dos Dados
- **Zero Dependência de Contas Externas**: Funciona localmente usando a API nativa de **IndexedDB** do navegador com fallback automático para **LocalStorage**.
- **Backup & Restauração**: Você pode baixar um arquivo `.json` completo a qualquer momento na página **Backup & Dados** e restaurá-lo em qualquer outro computador.
- **Exportação CSV**: Permite exportar a lista de tarefas para planilhas como Excel e Google Sheets.
