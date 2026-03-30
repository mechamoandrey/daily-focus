import { filterGoalsForCalendarDay, linkedinForProgressOnDate } from "@/lib/goalModel";
export function computeOverallPercent(allGoals, dateYmd, linkedinFriday) {
  const goals = filterGoalsForCalendarDay(allGoals, dateYmd);
  const li = linkedinForProgressOnDate(linkedinFriday, dateYmd);
  let total = 0;
  let done = 0;
  for (const g of goals) {
    for (const s of g.subtasks) {
      total += 1;
      if (s.done) done += 1;
    }
  }
  if (li) {
    for (const s of li.subtasks) {
      total += 1;
      if (s.done) done += 1;
    }
  }
  if (total === 0) return 0;
  return Math.round(done / total * 100);
}
export function computeGoalPercent(goal) {
  const n = goal.subtasks.length;
  if (n === 0) return 0;
  const d = goal.subtasks.filter(s => s.done).length;
  return Math.round(d / n * 100);
}
export function countStats(allGoals, dateYmd, linkedinFriday) {
  const goals = filterGoalsForCalendarDay(allGoals, dateYmd);
  const li = linkedinForProgressOnDate(linkedinFriday, dateYmd);
  let subDone = 0;
  let subTotal = 0;
  let goalsComplete = 0;
  let goalsTotal = goals.length;
  if (li) goalsTotal += 1;
  for (const g of goals) {
    subTotal += g.subtasks.length;
    const gd = g.subtasks.filter(s => s.done).length;
    subDone += gd;
    if (g.subtasks.length > 0 && gd === g.subtasks.length) goalsComplete += 1;
  }
  if (li) {
    const lis = li.subtasks;
    subTotal += lis.length;
    subDone += lis.filter(s => s.done).length;
    if (lis.length > 0 && lis.every(s => s.done)) goalsComplete += 1;
  }
  return {
    subDone,
    subTotal,
    goalsComplete,
    goalsTotal
  };
}
