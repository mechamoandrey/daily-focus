export function frentesExecucaoTitle(count, t) {
  const n = Math.max(0, Math.floor(Number(count)) || 0);
  if (n === 0) return t("dashboard.frentes0");
  if (n === 1) return t("dashboard.frentes1");
  return t("dashboard.frentesN", {
    n
  });
}
