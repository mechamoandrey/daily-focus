/**
 * Modelos de domínio estáveis para evolução multiusuário (Supabase).
 * O runtime continua usando os mesmos objetos; campos novos degradam graciosamente.
 *
 * @see {@link ../normalizers/migratePersistedState.js} para migração de dados antigos
 */

/**
 * @typedef {string | null} UserIdRef
 * Identificador do utilizador autenticado; `null` = modo local single-user.
 */

/**
 * @typedef {Object} Subtask
 * @property {string} id
 * @property {string} [goalId] — preenchido na normalização quando em falta
 * @property {string} label
 * @property {boolean} done — usado pela UI atual
 * @property {boolean} [completed] — espelho para backend (`done` tem prioridade na UI)
 * @property {string} createdAt
 * @property {string} [updatedAt]
 * @property {string} [hint]
 */

/**
 * @typedef {Object} Goal
 * @property {string} id
 * @property {UserIdRef} [userId]
 * @property {string} title
 * @property {string} description
 * @property {string | null} category
 * @property {boolean} isSystem
 * @property {boolean} isVisible
 * @property {string[]} visibleDays
 * @property {number} order
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} [status]
 * @property {Subtask[]} subtasks
 */

/**
 * Snapshot de metas dentro do histórico (já existente em `history[].detail`).
 * @typedef {Object} GoalsSnapshotInHistory
 */

/**
 * @typedef {Object} HistoryEntry
 * Registo diário persistido (compatível com analytics).
 * @property {string} date — YYYY-MM-DD
 * @property {number} percentComplete
 * @property {boolean} completedFullDay
 * @property {object} [detail]
 */

/**
 * Vista de domínio para um dia fechado (alinhado a futura tabela `daily_records`).
 * @typedef {Object} DailyRecord
 * @property {string} [id] — opcional até existir PK de servidor
 * @property {UserIdRef} [userId]
 * @property {string} date
 * @property {number} progress — mesmo significado que `percentComplete`
 * @property {GoalsSnapshotInHistory | null} [goalsSnapshot]
 * @property {number} [subtasksCompleted]
 * @property {number} [subtasksTotal]
 * @property {boolean} isPerfectDay
 * @property {string} [createdAt]
 */

/**
 * @typedef {Object} UserPreferences
 * @property {string} [id]
 * @property {UserIdRef} [userId]
 * @property {string} [theme]
 * @property {Record<string, unknown>} [settings]
 * @property {string} [createdAt]
 * @property {string} [updatedAt]
 */

/**
 * @typedef {Object} DailyFocusPersistedState
 * @property {string} [lastResetDate]
 * @property {number} streak
 * @property {HistoryEntry[]} history
 * @property {Goal[]} goals
 * @property {unknown} linkedinFriday
 * @property {UserPreferences | null} [preferences]
 */

export {};
