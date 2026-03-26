import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Daily Focus — plano diário",
  description:
    "Metas, subtarefas e progresso diário para execução consistente rumo ao emprego.",
  openGraph: {
    title: "Daily Focus",
    description: "Plano diário com metas, subtarefas e histórico local.",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Focus",
    description: "Plano diário com metas e progresso.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg-base)] text-[var(--foreground)]">
        <a className="skip-link" href="#conteudo-principal">
          Ir para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
