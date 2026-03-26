/**
 * Metas fixas e subtarefas iniciais.
 * IDs estáveis para persistência e reset diário (apenas `done` é limpo).
 */

export const INITIAL_GOALS = [
  {
    id: "goal-en",
    title: "Estudar inglês todos os dias",
    description: "Consistência no idioma abre portas e entrevistas em inglês.",
    subtasks: [
      { id: "en-1", title: "Revisar vocabulário", done: false },
      { id: "en-2", title: "Fazer listening", done: false },
      { id: "en-3", title: "Fazer speaking ou writing", done: false },
      { id: "en-4", title: "Estudar uma estrutura gramatical", done: false },
      { id: "en-5", title: "Registrar o que aprendi", done: false },
    ],
  },
  {
    id: "goal-site",
    title: "Fazer parte do meu site todos os dias",
    description: "Seu site é o cartão de visitas vivo do seu trabalho.",
    subtasks: [
      { id: "site-1", title: "Escolher a seção ou feature do dia", done: false },
      { id: "site-2", title: "Implementar UI", done: false },
      { id: "site-3", title: "Ajustar responsividade", done: false },
      { id: "site-4", title: "Refatorar ou melhorar código", done: false },
      { id: "site-5", title: "Revisar resultado final", done: false },
    ],
  },
  {
    id: "goal-portfolio",
    title: "Fazer sites para simular portfólio todos os dias",
    description: "Volume de projetos mostra execução e criterio de entrega.",
    subtasks: [
      { id: "pf-1", title: "Definir ideia do projeto", done: false },
      { id: "pf-2", title: "Fazer layout principal", done: false },
      { id: "pf-3", title: "Implementar seção relevante", done: false },
      { id: "pf-4", title: "Publicar no GitHub", done: false },
      { id: "pf-5", title: "Anotar o que virou material de portfólio", done: false },
    ],
  },
  {
    id: "goal-forge",
    title: "Tocar meu projeto pessoal Forge AI",
    description: "Projeto próprio demonstra iniciativa e profundidade técnica.",
    subtasks: [
      { id: "fg-1", title: "Definir próxima tarefa", done: false },
      { id: "fg-2", title: "Implementar ou pesquisar", done: false },
      { id: "fg-3", title: "Validar resultado", done: false },
      { id: "fg-4", title: "Registrar próximos passos", done: false },
    ],
  },
];

export function cloneGoals(goals) {
  return goals.map((g) => ({
    ...g,
    subtasks: g.subtasks.map((s) => ({ ...s })),
  }));
}
