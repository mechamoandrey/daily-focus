export function interpretNumberLine(kind, snapshot, t) {
  switch (kind) {
    case "avg7":
      {
        const n = snapshot.avg7;
        if (n == null) return t("history.interpret.insufficient");
        if (n >= 80) return t("history.interpret.avg7.high");
        if (n >= 50) return t("history.interpret.avg7.mid");
        return t("history.interpret.avg7.low");
      }
    case "avg30":
      {
        const n = snapshot.avg30;
        if (n == null) return t("history.interpret.insufficient");
        if (n >= 70) return t("history.interpret.avg30.high");
        if (n >= 45) return t("history.interpret.avg30.mid");
        return t("history.interpret.avg30.low");
      }
    case "streak":
      return snapshot.currentStreak > 0 ? t("history.interpret.streak.on") : t("history.interpret.streak.off");
    case "bestStreak":
      return snapshot.bestStreak > 0 ? t("history.interpret.bestStreak.yes") : t("history.interpret.bestStreak.no");
    case "fullDayRate":
      if (snapshot.fullDayRatePct == null) return "—";
      if (snapshot.fullDayRatePct >= 50) return t("history.interpret.fullDay.high");
      if (snapshot.fullDayRatePct >= 20) return t("history.interpret.fullDay.mid");
      return t("history.interpret.fullDay.low");
    case "consistency":
      if (snapshot.consistencyPct == null) return "—";
      if (snapshot.consistencyPct >= 60) return t("history.interpret.consistency.high");
      if (snapshot.consistencyPct >= 30) return t("history.interpret.consistency.mid");
      return t("history.interpret.consistency.low");
    case "trend":
      {
        const trend = snapshot.trend;
        if (trend.direction === "insufficient") return t("history.interpret.trend.insufficient");
        if (trend.direction === "up") return t("history.interpret.trend.up");
        if (trend.direction === "down") return t("history.interpret.trend.down");
        return t("history.interpret.trend.stable");
      }
    default:
      return null;
  }
}
