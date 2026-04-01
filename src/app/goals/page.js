import { GoalsClient } from "@/components/GoalsClient";

export const metadata = {
  title: "Goals",
  description:
    "Define goals, break them into subtasks, and track progress day by day.",
  alternates: {
    canonical: "/goals",
  },
  openGraph: {
    title: "Goals · Daily Focus",
    description:
      "Define goals, break them into subtasks, and track progress day by day.",
    url: "/goals",
  },
  twitter: {
    title: "Goals · Daily Focus",
    description:
      "Define goals, break them into subtasks, and track progress day by day.",
  },
};
export default function GoalsPage() {
  return <GoalsClient />;
}
