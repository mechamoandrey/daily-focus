/**
 * Canonical goal structure — used for defaults and migrations.
 * Subtask `done` is hydrated from localStorage at runtime.
 */
export const INITIAL_GOALS = [
  {
    id: "study-english",
    title: "Estudar inglês todos os dias",
    description: "Vocabulário, input e output — o combo que aparece em entrevistas.",
    subtasks: [
      { id: "study-english-1", label: "Revisar vocabulário" },
      { id: "study-english-2", label: "Fazer listening" },
      { id: "study-english-3", label: "Fazer speaking ou writing" },
      { id: "study-english-4", label: "Estudar uma estrutura gramatical" },
      { id: "study-english-5", label: "Registrar o que aprendi" },
    ],
  },
  {
    id: "personal-site",
    title: "Fazer parte do meu site todos os dias",
    description: "Construir presença online com entregas pequenas e constantes.",
    subtasks: [
      { id: "personal-site-1", label: "Escolher a seção ou feature do dia" },
      { id: "personal-site-2", label: "Implementar UI" },
      { id: "personal-site-3", label: "Ajustar responsividade" },
      { id: "personal-site-4", label: "Refatorar ou melhorar código" },
      { id: "personal-site-5", label: "Revisar resultado final" },
    ],
  },
  {
    id: "portfolio-sites",
    title: "Fazer sites para simular portfólio todos os dias",
    description: "Projetos demonstráveis que contam história no GitHub.",
    subtasks: [
      { id: "portfolio-sites-1", label: "Definir ideia do projeto" },
      { id: "portfolio-sites-2", label: "Fazer layout principal" },
      { id: "portfolio-sites-3", label: "Implementar seção relevante" },
      { id: "portfolio-sites-4", label: "Publicar no GitHub" },
      { id: "portfolio-sites-5", label: "Anotar o que virou material de portfólio" },
    ],
  },
  {
    id: "forge-ai",
    title: "Tocar meu projeto pessoal Forge AI",
    description: "Avançar o que te diferencia — com clareza e próximos passos.",
    subtasks: [
      { id: "forge-ai-1", label: "Definir próxima tarefa" },
      { id: "forge-ai-2", label: "Implementar ou pesquisar" },
      { id: "forge-ai-3", label: "Validar resultado" },
      { id: "forge-ai-4", label: "Registrar próximos passos" },
    ],
  },
];
