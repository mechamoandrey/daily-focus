export const LINKEDIN_FRIDAY_META = {
  id: "linkedin-friday",
  title: "Post no LinkedIn (sexta)",
  description: "Rotina semanal de presença profissional: tema forte, texto revisado e engajamento logo após publicar."
};
export const INITIAL_LINKEDIN_SUBTASKS = [{
  id: "li-1",
  label: "Definir tema ou insight da semana",
  hint: "O que você aprendeu, entregou ou mudou de ideia — algo específico que outra pessoa possa copiar ou questionar."
}, {
  id: "li-2",
  label: "Esboçar gancho e estrutura",
  hint: "Linha 1 com tensão ou promessa; depois contexto → insight → exemplo → pergunta ou CTA leve."
}, {
  id: "li-3",
  label: "Escrever o corpo com exemplo concreto",
  hint: "Número, antes/depois, trecho de código, print ou mini-case — prova de que não é texto vazio."
}, {
  id: "li-4",
  label: "Revisar tom, clareza e CTA",
  hint: "Ler em voz alta; cortar adjetivos; garantir uma linha que peça comentário (dúvida ou opinião)."
}, {
  id: "li-5",
  label: "Formato e publicação",
  hint: "Texto, bullets ou carrossel; hashtag só se fizer sentido; publicar no horário em que você costuma estar online."
}, {
  id: "li-6",
  label: "Primeiros 60–90 min pós-post",
  hint: "Responder comentários, reagir a respostas e comentar de forma útil em 2–3 posts da sua área."
}];
export function emptyLinkedinFridayFromTemplate() {
  return {
    visibleDays: ["friday"],
    subtasks: INITIAL_LINKEDIN_SUBTASKS.map(t => ({
      id: t.id,
      label: t.label,
      hint: t.hint,
      done: false
    }))
  };
}
