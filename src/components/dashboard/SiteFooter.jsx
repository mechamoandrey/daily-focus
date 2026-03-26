export function SiteFooter() {
  return (
    <footer
      className="border-t border-[var(--border)] bg-[var(--bg-base)]/90 py-10 pb-14"
      role="contentinfo"
    >
      <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="max-w-md text-sm leading-relaxed text-[var(--muted)]">
          Dados guardados só neste navegador (localStorage). Nada é enviado para servidor.
        </p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-[var(--muted)]">
          <a
            href="/privacidade"
            className="transition-colors duration-200 hover:text-[var(--foreground)]"
          >
            Privacidade
          </a>
          <a
            href="/termos"
            className="transition-colors duration-200 hover:text-[var(--foreground)]"
          >
            Termos
          </a>
        </nav>
      </div>
    </footer>
  );
}
