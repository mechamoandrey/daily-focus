import { HistoryClient } from "@/components/HistoryClient";

export const metadata = {
  title: "History",
  description:
    "See completion trends, streaks, and day-by-day execution across your goals.",
  alternates: {
    canonical: "/history",
  },
  openGraph: {
    title: "History · Daily Focus",
    description:
      "See completion trends, streaks, and day-by-day execution across your goals.",
    url: "/history",
  },
  twitter: {
    title: "History · Daily Focus",
    description:
      "See completion trends, streaks, and day-by-day execution across your goals.",
  },
};
export default function HistoryPage() {
  return <HistoryClient />;
}
