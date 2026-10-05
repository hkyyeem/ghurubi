// Single guarded service-worker registrar. Never registers in dev or Lovable preview.
export function registerSW() {
  if (!('serviceWorker' in navigator)) return;
  const h = location.hostname;
  const refused =
    !import.meta.env.PROD ||
    window.self !== window.top ||
    h.startsWith('id-preview--') || h.startsWith('preview--') ||
    h === 'lovableproject.com' || h.endsWith('.lovableproject.com') ||
    h === 'lovableproject-dev.com' || h.endsWith('.lovableproject-dev.com') ||
    h === 'beta.lovable.dev' || h.endsWith('.beta.lovable.dev') ||
    new URLSearchParams(location.search).get('sw') === 'off';

  if (refused) {
    navigator.serviceWorker.getRegistrations().then(regs =>
      regs.forEach(r => { if (r.active?.scriptURL.endsWith('/sw.js')) r.unregister(); })
    );
    return;
  }
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
