/**
 * Título da seção principal conforme quantidade de metas visíveis no dia (incl. LinkedIn se aplicável).
 * @param {number} count
 * @param {(key: string, vars?: Record<string, string | number>) => string} t
 */
export function frentesExecucaoTitle(count, t) {
  const n = Math.max(0, Math.floor(Number(count)) || 0);
  if (n === 0) return t("dashboard.frentes0");
  if (n === 1) return t("dashboard.frentes1");
  return t("dashboard.frentesN", { n });
}
