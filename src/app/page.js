import { DailyFocusClient } from "@/components/DailyFocusClient";

export const metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <DailyFocusClient />;
}
