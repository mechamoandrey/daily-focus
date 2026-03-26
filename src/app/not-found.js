import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--bg-base)] px-6 text-center">
      <p className="font-display text-xs font-medium tracking-[0.2em] text-[var(--muted)]">
        404
      </p>
      <h1 className="font-display mt-3 max-w-md text-balance text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
        Esta página não existe
      </h1>
      <p className="mt-3 max-w-sm text-pretty text-sm leading-relaxed text-[var(--muted)]">
        O endereço pode ter mudado ou o link está incorreto. Volte ao painel do dia.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-[var(--accent-muted)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] ring-1 ring-[var(--border)] transition-[transform,background-color] duration-200 hover:bg-[rgba(62,154,138,0.22)] active:translate-y-px"
      >
        Abrir Daily Focus
      </Link>
    </div>
  );
}
