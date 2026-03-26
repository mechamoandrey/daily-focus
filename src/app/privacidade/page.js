import Link from "next/link";

export const metadata = {
  title: "Privacidade — Daily Focus",
  description: "Como o Daily Focus trata dados locais.",
};

export default function PrivacidadePage() {
  return (
    <div className="mx-auto min-h-dvh max-w-2xl px-4 py-16 md:px-8">
      <Link
        href="/"
        className="text-sm font-medium text-[var(--accent-bright)] transition-opacity hover:opacity-90"
      >
        Voltar ao app
      </Link>
      <h1 className="font-display mt-8 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
        Privacidade
      </h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-[var(--muted)]">
        <p>
          O Daily Focus armazena metas e progresso apenas no seu navegador (localStorage).
          Não há conta, servidor ou análise de uso nesta versão.
        </p>
        <p>
          Ao limpar dados do site ou trocar de navegador, o histórico local some. Faça cópia
          manual se precisar guardar.
        </p>
      </div>
    </div>
  );
}
