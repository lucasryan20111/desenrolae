import { Subject, Task, Goal, StudySession, Achievement, AuditLog } from '../types';
import { INITIAL_ACHIEVEMENTS } from './achievements';

const DB_NAME = 'desenrolae_db';
const DB_VERSION = 1;

export interface AppDatabaseState {
  subjects: Subject[];
  tasks: Task[];
  goals: Goal[];
  sessions: StudySession[];
  achievements: Achievement[];
  auditLogs: AuditLog[];
}

// Initial realistic seed data matching the screenshot and requirements
const SEED_SUBJECTS: Subject[] = [
  {
    id: 'sub_faculdade',
    name: 'FACULDADE',
    description: 'Engenharia de Software e disciplinas acadêmicas',
    color: '#EF4444', // Red dot
    icon: 'GraduationCap',
    topics: [
      { id: 'top_eng_req', subjectId: 'sub_faculdade', name: 'Engenharia de Requisitos', createdAt: '2026-10-01' },
      { id: 'top_arq_sw', subjectId: 'sub_faculdade', name: 'Arquitetura de Software', createdAt: '2026-10-01' },
    ],
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'sub_ingles',
    name: 'INGLÊS',
    description: 'Fluência técnica e conversação diária',
    color: '#EC4899', // Pink dot
    icon: 'Languages',
    topics: [
      { id: 'top_gram', subjectId: 'sub_ingles', name: 'Grammar & Phrasal Verbs', createdAt: '2026-10-02' },
      { id: 'top_speak', subjectId: 'sub_ingles', name: 'Technical Speaking', createdAt: '2026-10-02' },
    ],
    createdAt: '2026-10-02T10:00:00Z',
    updatedAt: '2026-10-02T10:00:00Z',
  },
  {
    id: 'sub_filosofia',
    name: 'FILOSOFIA PRÁTICA',
    description: 'Modelos mentais e estoicismo aplicado',
    color: '#6366F1', // Indigo dot
    icon: 'BookOpen',
    topics: [
      { id: 'top_est', subjectId: 'sub_filosofia', name: 'Estoicismo & Disciplina', createdAt: '2026-10-03' },
    ],
    createdAt: '2026-10-03T10:00:00Z',
    updatedAt: '2026-10-03T10:00:00Z',
  },
  {
    id: 'sub_concursos',
    name: 'CONCURSOS',
    description: 'Preparação para carreiras públicas de TI',
    color: '#06B6D4', // Cyan dot
    icon: 'Trophy',
    topics: [
      { id: 'top_dir_const', subjectId: 'sub_concursos', name: 'Direito Constitucional', createdAt: '2026-10-04' },
      { id: 'top_redes', subjectId: 'sub_concursos', name: 'Redes & Segurança', createdAt: '2026-10-04' },
    ],
    createdAt: '2026-10-04T10:00:00Z',
    updatedAt: '2026-10-04T10:00:00Z',
  },
  {
    id: 'sub_sistemas_dist',
    name: 'SISTEMAS DISTRIBUÍDOS',
    description: 'Consenso, mensageria e alta disponibilidade',
    color: '#8B5CF6', // Purple dot
    icon: 'Network',
    topics: [
      { id: 'top_kafka', subjectId: 'sub_sistemas_dist', name: 'Apache Kafka & Event-Driven', createdAt: '2026-10-05' },
      { id: 'top_raft', subjectId: 'sub_sistemas_dist', name: 'Algoritmo Raft', createdAt: '2026-10-05' },
    ],
    createdAt: '2026-10-05T10:00:00Z',
    updatedAt: '2026-10-05T10:00:00Z',
  },
  {
    id: 'sub_estrutura_dados',
    name: 'ESTRUTURA DE DADOS',
    description: 'Árvores, grafos e algoritmos de ordenação em Java',
    color: '#F59E0B', // Amber dot
    icon: 'Binary',
    topics: [
      { id: 'top_arvores', subjectId: 'sub_estrutura_dados', name: 'Árvores AVL e Rubro-Negra', createdAt: '2026-10-06' },
      { id: 'top_grafos', subjectId: 'sub_estrutura_dados', name: 'Algoritmo de Dijkstra', createdAt: '2026-10-06' },
    ],
    createdAt: '2026-10-06T10:00:00Z',
    updatedAt: '2026-10-06T10:00:00Z',
  },
  {
    id: 'sub_cripto',
    name: 'CRIPTOGRAFIA E SEGURANÇA',
    description: 'Criptografia assimétrica, TLS 1.3 e Zero Knowledge',
    color: '#10B981', // Emerald dot
    icon: 'Shield',
    topics: [
      { id: 'top_rsa', subjectId: 'sub_cripto', name: 'Curvas Elípticas & RSA', createdAt: '2026-10-07' },
      { id: 'top_auth', subjectId: 'sub_cripto', name: 'OAuth2 & OIDC', createdAt: '2026-10-07' },
    ],
    createdAt: '2026-10-07T10:00:00Z',
    updatedAt: '2026-10-07T10:00:00Z',
  },
  {
    id: 'sub_compiladores',
    name: 'COMPILADORES',
    description: 'Análise léxica, sintática e geradores de código LLVM',
    color: '#F43F5E', // Rose dot
    icon: 'Cpu',
    topics: [
      { id: 'top_analisador', subjectId: 'sub_compiladores', name: 'Parsing LL(1) e LR', createdAt: '2026-10-08' },
    ],
    createdAt: '2026-10-08T10:00:00Z',
    updatedAt: '2026-10-08T10:00:00Z',
  },
];

const today = new Date();
const fmtDate = (d: Date) => d.toISOString().split('T')[0];
const addDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return fmtDate(d);
};

const SEED_TASKS: Task[] = [
  {
    id: 'task_1',
    title: 'Resolver 20 questões de Redes de Computadores',
    description: 'Foco no modelo OSI, TCP/IP e protocolos da camada de aplicação para concurso federal.',
    subjectId: 'sub_concursos',
    topicId: 'top_redes',
    startDate: addDays(-3),
    dueDate: addDays(0), // Hoje
    priority: 'alta',
    status: 'em_andamento',
    progress: 75,
    estimatedMinutes: 90,
    studiedMinutes: 70,
    notes: 'Revisar cabeçalhos TCP vs UDP',
    completedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task_2',
    title: 'Implementar Algoritmo Raft para Eleição de Líder',
    description: 'Criar simulação de nós distribuídos com timeout aleatório em Java/Go.',
    subjectId: 'sub_sistemas_dist',
    topicId: 'top_raft',
    startDate: addDays(-4),
    dueDate: addDays(2),
    priority: 'alta',
    status: 'em_andamento',
    progress: 45,
    estimatedMinutes: 180,
    studiedMinutes: 85,
    notes: 'Tratar partição de rede (Split Brain)',
    completedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task_3',
    title: 'Estudo de Curvas Elípticas (Ed25519 vs Secp256k1)',
    description: 'Comparativo matemático de performance e segurança em assinaturas digitais.',
    subjectId: 'sub_cripto',
    topicId: 'top_rsa',
    startDate: addDays(-2),
    dueDate: addDays(1),
    priority: 'media',
    status: 'em_andamento',
    progress: 80,
    estimatedMinutes: 105,
    studiedMinutes: 86,
    notes: 'Excelente artigo lido na RFC 8032',
    completedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task_4',
    title: 'Prática de Listening em Inglês Técnico (Tech Talks)',
    description: 'Assistir a 2 palestras da QCon sobre arquitetura de microsserviços sem legenda.',
    subjectId: 'sub_ingles',
    topicId: 'top_speak',
    startDate: addDays(-5),
    dueDate: addDays(-1), // Atrasada!
    priority: 'alta',
    status: 'em_andamento',
    progress: 50,
    estimatedMinutes: 60,
    studiedMinutes: 30,
    notes: 'Anotar vocabulário de resilience e circuit breaker',
    completedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task_5',
    title: 'Revisão de Árvores AVL: Rotações Simples e Duplas',
    description: 'Cálculo do fator de balanceamento e exercícios práticos no LeetCode.',
    subjectId: 'sub_estrutura_dados',
    topicId: 'top_arvores',
    startDate: addDays(-6),
    dueDate: addDays(-2),
    priority: 'media',
    status: 'concluida',
    progress: 100,
    estimatedMinutes: 120,
    studiedMinutes: 125,
    notes: 'Todos os testes passaram com O(log n)',
    completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task_6',
    title: 'Leitura de Cartas de Sêneca - Sobre a Brevidade da Vida',
    description: 'Capítulos 1 ao 5 com anotações de insights no diário de estudos.',
    subjectId: 'sub_filosofia',
    topicId: 'top_est',
    startDate: addDays(-1),
    dueDate: addDays(4),
    priority: 'baixa',
    status: 'concluida',
    progress: 100,
    estimatedMinutes: 45,
    studiedMinutes: 50,
    notes: 'Excelente reflexão sobre tempo ativo vs tempo perdido',
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task_7',
    title: 'Construção da Tabela de Análise Preditiva LL(1)',
    description: 'Calcular conjuntos FIRST e FOLLOW da gramática da linguagem de testes.',
    subjectId: 'sub_compiladores',
    topicId: 'top_analisador',
    startDate: addDays(0),
    dueDate: addDays(5),
    priority: 'media',
    status: 'nao_iniciada',
    progress: 0,
    estimatedMinutes: 90,
    studiedMinutes: 0,
    notes: '',
    completedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task_8',
    title: 'Diagrama C4 Model para Trabalho de Faculdade',
    description: 'Mapear Contexto, Contêineres e Componentes do sistema acadêmico.',
    subjectId: 'sub_faculdade',
    topicId: 'top_arq_sw',
    startDate: addDays(-1),
    dueDate: addDays(0), // Hoje
    priority: 'alta',
    status: 'concluida',
    progress: 100,
    estimatedMinutes: 60,
    studiedMinutes: 60,
    notes: 'Exportado em SVG e integrado à documentação',
    completedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const SEED_GOALS: Goal[] = [
  {
    id: 'goal_week_cripto',
    title: 'Criptografia e Segurança Semanal',
    description: 'Completar 1h45min de estudo dedicado',
    type: 'hours',
    period: 'semanal',
    targetValue: 1.75, // 1h45m
    currentValue: 1.43, // 1h26m -> 82%
    subjectId: 'sub_cripto',
    startDate: addDays(-4),
    dueDate: addDays(3),
    status: 'em_andamento',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'goal_week_concursos',
    title: 'Concursos: 20 Questões Semanais',
    description: 'Resolver bateria de questões de informática e direito',
    type: 'tasks',
    period: 'semanal',
    targetValue: 4,
    currentValue: 3,
    subjectId: 'sub_concursos',
    startDate: addDays(-4),
    dueDate: addDays(3),
    status: 'em_andamento',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'goal_week_sistemas',
    title: 'Sistemas Distribuídos: Leitura e Código',
    description: 'Meta de 1h45min de estudo focado',
    type: 'hours',
    period: 'semanal',
    targetValue: 1.75,
    currentValue: 0.75, // 45min -> 43%
    subjectId: 'sub_sistemas_dist',
    startDate: addDays(-4),
    dueDate: addDays(3),
    status: 'em_andamento',
    createdAt: new Date().toISOString(),
  },
];

const SEED_SESSIONS: StudySession[] = [
  {
    id: 'sess_1',
    subjectId: 'sub_concursos',
    taskId: 'task_1',
    durationMinutes: 70,
    date: fmtDate(new Date()),
    startedAt: new Date(Date.now() - 70 * 60000).toISOString(),
    endedAt: new Date().toISOString(),
    type: 'pomodoro',
    notes: 'Resolução intensiva de questões',
  },
  {
    id: 'sess_2',
    subjectId: 'sub_faculdade',
    taskId: 'task_8',
    durationMinutes: 60,
    date: fmtDate(new Date()),
    startedAt: new Date(Date.now() - 140 * 60000).toISOString(),
    endedAt: new Date(Date.now() - 80 * 60000).toISOString(),
    type: 'cronometro',
    notes: 'Diagramação no Draw.io',
  },
  {
    id: 'sess_3',
    subjectId: 'sub_cripto',
    taskId: 'task_3',
    durationMinutes: 86,
    date: addDays(-1),
    startedAt: new Date(Date.now() - 86400000).toISOString(),
    endedAt: new Date(Date.now() - 86400000 + 86 * 60000).toISOString(),
    type: 'pomodoro',
    notes: 'Curvas Elípticas',
  },
  {
    id: 'sess_4',
    subjectId: 'sub_filosofia',
    taskId: 'task_6',
    durationMinutes: 50,
    date: addDays(-2),
    startedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    endedAt: new Date(Date.now() - 86400000 * 2 + 50 * 60000).toISOString(),
    type: 'manual',
    notes: 'Leitura de Sêneca',
  },
  {
    id: 'sess_5',
    subjectId: 'sub_estrutura_dados',
    taskId: 'task_5',
    durationMinutes: 125,
    date: addDays(-3),
    startedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    endedAt: new Date(Date.now() - 86400000 * 3 + 125 * 60000).toISOString(),
    type: 'pomodoro',
    notes: 'Árvores AVL',
  },
  {
    id: 'sess_6',
    subjectId: 'sub_sistemas_dist',
    taskId: 'task_2',
    durationMinutes: 85,
    date: addDays(-4),
    startedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    endedAt: new Date(Date.now() - 86400000 * 4 + 85 * 60000).toISOString(),
    type: 'cronometro',
    notes: 'Consenso Raft',
  },
  {
    id: 'sess_7',
    subjectId: 'sub_ingles',
    taskId: 'task_4',
    durationMinutes: 45,
    date: addDays(-5),
    startedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    endedAt: new Date(Date.now() - 86400000 * 5 + 45 * 60000).toISOString(),
    type: 'pomodoro',
    notes: 'Prática auditiva',
  },
  {
    id: 'sess_8',
    subjectId: 'sub_compiladores',
    durationMinutes: 60,
    date: addDays(-6),
    startedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    endedAt: new Date(Date.now() - 86400000 * 6 + 60 * 60000).toISOString(),
    type: 'manual',
    notes: 'Gramáticas livres de contexto',
  },
];

const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_init_1',
    type: 'task_completed',
    title: 'Tarefa Concluída: Diagrama C4 Model',
    details: 'Finalizado com 100% de progresso e 60 min de foco.',
    timestamp: new Date().toISOString(),
    entityId: 'task_8',
  },
  {
    id: 'log_init_2',
    type: 'session_logged',
    title: 'Sessão de Foco Pomodoro',
    details: '70 minutos dedicados a Concursos (Redes de Computadores)',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    entityId: 'sess_1',
  },
  {
    id: 'log_init_3',
    type: 'task_completed',
    title: 'Tarefa Concluída: Leitura de Cartas de Sêneca',
    details: 'Finalizado com 100% de progresso.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    entityId: 'task_6',
  },
];

class StorageService {
  private dbPromise: Promise<IDBDatabase | null> | null = null;
  private readonly LOCAL_STORAGE_KEY = 'desenrolae_app_state_v1';

  constructor() {
    this.initIDB();
  }

  private initIDB(): Promise<IDBDatabase | null> {
    if (this.dbPromise) return this.dbPromise;

    if (typeof window === 'undefined' || !window.indexedDB) {
      this.dbPromise = Promise.resolve(null);
      return this.dbPromise;
    }

    this.dbPromise = new Promise(resolve => {
      try {
        const req = window.indexedDB.open(DB_NAME, DB_VERSION);

        req.onupgradeneeded = event => {
          const db = req.result;
          const stores = ['subjects', 'tasks', 'goals', 'sessions', 'achievements', 'auditLogs'];
          stores.forEach(s => {
            if (!db.objectStoreNames.contains(s)) {
              db.createObjectStore(s, { keyPath: 'id' });
            }
          });
        };

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => {
          console.warn('IndexedDB unavailable, falling back to LocalStorage.');
          resolve(null);
        };
      } catch (err) {
        console.warn('Error opening IndexedDB, falling back to LocalStorage', err);
        resolve(null);
      }
    });

    return this.dbPromise;
  }

  public async getInitialData(): Promise<AppDatabaseState> {
    // Check localStorage first for instant hydration
    let storedState: AppDatabaseState | null = null;
    try {
      const raw = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      if (raw) {
        storedState = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Error reading from localStorage', e);
    }

    if (storedState && storedState.subjects && storedState.tasks) {
      // Ensure achievements list has any new definition
      const mergedAchievements = INITIAL_ACHIEVEMENTS.map(initial => {
        const found = storedState!.achievements?.find(a => a.code === initial.code);
        return found ? { ...initial, unlockedAt: found.unlockedAt } : initial;
      });
      storedState.achievements = mergedAchievements;
      return storedState;
    }

    // Attempt to load from IndexedDB
    const db = await this.initIDB();
    if (db) {
      try {
        const stateFromIDB = await this.readAllFromIDB(db);
        if (stateFromIDB.subjects.length > 0) {
          this.saveToLocalStorage(stateFromIDB);
          return stateFromIDB;
        }
      } catch (e) {
        console.warn('Error loading from IDB', e);
      }
    }

    // If nothing exists, initialize with Seed Data!
    const defaultState: AppDatabaseState = {
      subjects: SEED_SUBJECTS,
      tasks: SEED_TASKS,
      goals: SEED_GOALS,
      sessions: SEED_SESSIONS,
      achievements: INITIAL_ACHIEVEMENTS,
      auditLogs: SEED_AUDIT_LOGS,
    };

    await this.saveAll(defaultState);
    return defaultState;
  }

  public async saveAll(state: AppDatabaseState): Promise<void> {
    // Always persist to localStorage for zero-latency instant reload
    this.saveToLocalStorage(state);

    // Also persist to IndexedDB asynchronously
    const db = await this.initIDB();
    if (!db) return;

    try {
      const tx = db.transaction(['subjects', 'tasks', 'goals', 'sessions', 'achievements', 'auditLogs'], 'readwrite');
      
      const syncStore = (storeName: string, items: any[]) => {
        const store = tx.objectStore(storeName);
        store.clear();
        items.forEach(item => store.put(item));
      };

      syncStore('subjects', state.subjects);
      syncStore('tasks', state.tasks);
      syncStore('goals', state.goals);
      syncStore('sessions', state.sessions);
      syncStore('achievements', state.achievements);
      syncStore('auditLogs', state.auditLogs);
    } catch (e) {
      console.warn('Error writing to IndexedDB', e);
    }
  }

  private saveToLocalStorage(state: AppDatabaseState) {
    try {
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('LocalStorage save failed (possible quota limit)', e);
    }
  }

  private readAllFromIDB(db: IDBDatabase): Promise<AppDatabaseState> {
    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(['subjects', 'tasks', 'goals', 'sessions', 'achievements', 'auditLogs'], 'readonly');
        const result: Partial<AppDatabaseState> = {};

        const readStore = (name: keyof AppDatabaseState) => {
          return new Promise<void>((res, rej) => {
            const req = tx.objectStore(name).getAll();
            req.onsuccess = () => {
              result[name] = req.result as any;
              res();
            };
            req.onerror = () => rej(req.error);
          });
        };

        Promise.all([
          readStore('subjects'),
          readStore('tasks'),
          readStore('goals'),
          readStore('sessions'),
          readStore('achievements'),
          readStore('auditLogs'),
        ])
          .then(() => {
            resolve({
              subjects: result.subjects || [],
              tasks: result.tasks || [],
              goals: result.goals || [],
              sessions: result.sessions || [],
              achievements: result.achievements || INITIAL_ACHIEVEMENTS,
              auditLogs: result.auditLogs || [],
            });
          })
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  public exportBackupJson(state: AppDatabaseState): string {
    return JSON.stringify({
      appName: 'DESENROLAE',
      exportVersion: 1,
      exportedAt: new Date().toISOString(),
      data: state,
    }, null, 2);
  }

  public validateAndImportBackup(rawJson: string): AppDatabaseState {
    const parsed = JSON.parse(rawJson);
    const data = parsed.data || parsed;
    if (!Array.isArray(data.subjects) || !Array.isArray(data.tasks)) {
      throw new Error('Arquivo de backup inválido: faltam entidades de matérias ou tarefas.');
    }
    return {
      subjects: data.subjects || [],
      tasks: data.tasks || [],
      goals: data.goals || [],
      sessions: data.sessions || [],
      achievements: data.achievements || INITIAL_ACHIEVEMENTS,
      auditLogs: data.auditLogs || [],
    };
  }

  public exportTasksCsv(tasks: Task[], subjects: Subject[]): string {
    const subMap = new Map(subjects.map(s => [s.id, s.name]));
    const headers = ['ID', 'Título', 'Matéria', 'Prioridade', 'Status', 'Progresso (%)', 'Início', 'Prazo', 'Minutos Estimados', 'Minutos Estudados'];
    const rows = tasks.map(t => [
      `"${t.id}"`,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${(subMap.get(t.subjectId) || '').replace(/"/g, '""')}"`,
      `"${t.priority}"`,
      `"${t.status}"`,
      t.progress,
      `"${t.startDate || ''}"`,
      `"${t.dueDate || ''}"`,
      t.estimatedMinutes || 0,
      t.studiedMinutes || 0,
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}

export const storageService = new StorageService();
