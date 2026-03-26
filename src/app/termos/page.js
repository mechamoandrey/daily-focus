import Link from "next/link";

export const metadata = {
  title: "Termos — Daily Focus",
  description: "Uso do Daily Focus.",
};

export default function TermosPage() {
  return (
    <div className="mx-auto min-h-dvh max-w-2xl px-4 py-16 md:px-8">
      <Link
        href="/"
        className="text-sm font-medium text-[var(--accent-bright)] transition-opacity hover:opacity-90"
      >
        Voltar ao app
      </Link>
      <h1 className="font-display mt-8 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
        Termos de uso
      </h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-[var(--muted)]">
        <p>
          Esta aplicação é fornecida como está, para organização pessoal. O uso é por sua conta
          e risco; não há garantia de disponibilidade ou de preservação de dados locais.
        </p>
        <p>
          Você é responsável pelas informações que registrar e por manter cópias se precisar.
        </p>
      </div>
    </div>
  );
}
