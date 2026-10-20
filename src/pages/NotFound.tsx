import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { SimpleHeader } from "@/components/SimpleHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useI18n, useLangPath, type Lang } from "@/lib/i18n";

/**
 * Client-side 404. Lovable's static host rewrites every path that is not a
 * real file to index.html with HTTP 200 (SPA fallback), so this route cannot
 * set the status code. The noindex meta keeps the URL out of search indexes.
 * A real HTTP 404 needs prerender/SSG (known HTML files + a 404 document) or
 * a host rule that knows the route table.
 */
const COPY: Record<Lang, { title: string; desc: string; h1: string; p: string; home: string }> = {
  ar: {
    title: "الصفحة غير موجودة | غروبي",
    desc: "هذا العنوان لا يطابق صفحة في غروبي.",
    h1: "الصفحة غير موجودة",
    p: "لا توجد صفحة على هذا العنوان. يمكنك العودة إلى التوقيت الغروبي.",
    home: "العودة إلى الرئيسية",
  },
  en: {
    title: "Page not found | Ghurubi",
    desc: "This address does not match a page on Ghurubi.",
    h1: "Page not found",
    p: "There is no page at this address. You can return to the sunset clock.",
    home: "Back to home",
  },
  tr: {
    title: "Sayfa bulunamadı | Ghurubi",
    desc: "Bu adres Ghurubi üzerinde bir sayfaya karşılık gelmiyor.",
    h1: "Sayfa bulunamadı",
    p: "Bu adreste bir sayfa yok. Gün batımı saatine dönebilirsiniz.",
    home: "Ana sayfaya dön",
  },
  he: {
    title: "הדף לא נמצא | Ghurubi",
    desc: "כתובת זו אינה תואמת דף ב-Ghurubi.",
    h1: "הדף לא נמצא",
    p: "אין דף בכתובת הזו. אפשר לחזור לשעון השקיעה.",
    home: "חזרה לדף הבית",
  },
};

const NotFound = () => {
  const location = useLocation();
  const { lang } = useI18n();
  const lp = useLangPath();
  const c = COPY[lang];

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Helmet>
        <title>{c.title}</title>
        <meta name="description" content={c.desc} />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <SimpleHeader />
      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-md">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">404</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{c.h1}</h1>
          <p className="text-muted-foreground leading-relaxed mb-8">{c.p}</p>
          <Link
            to={lp("/")}
            className="inline-flex items-center px-5 py-2.5 border border-border rounded-md text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
          >
            {c.home}
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default NotFound;
