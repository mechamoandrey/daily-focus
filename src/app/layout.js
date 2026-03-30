import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});
const metadataBase = typeof process.env.VERCEL_URL === "string" && process.env.VERCEL_URL ? new URL(`https://${process.env.VERCEL_URL}`) : new URL("http://localhost:3000");
export const metadata = {
  metadataBase,
  title: {
    default: "Daily Focus — daily execution tracker",
    template: "%s · Daily Focus"
  },
  description: "Goal tracker with daily progress, streaks, and analytics — built for consistency.",
  openGraph: {
    title: "Daily Focus — daily execution tracker",
    description: "Goal tracker with daily progress, streaks, and analytics — built for consistency.",
    type: "website"
  }
};
export default function RootLayout({
  children
}) {
  return <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <Providers>{children}</Providers>
      </body>
    </html>;
}
