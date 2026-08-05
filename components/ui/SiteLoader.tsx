/**
 * Заставка при загрузке сайта. Исчезает через чистую CSS-анимацию
 * (см. .site-loader в globals.css) — не зависит от гидратации React,
 * поэтому не может «зависнуть» из-за медленной сети или ошибки JS.
 */
export function SiteLoader() {
  return (
    <div
      className="site-loader pointer-events-none fixed inset-0 z-[200] flex items-center justify-center bg-charcoal"
      aria-hidden
    >
      <p className="neon-text font-display text-4xl">ITMINOT</p>
    </div>
  );
}
