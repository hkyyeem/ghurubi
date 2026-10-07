import { SeoHead } from '@/components/SeoHead';
import { SimpleHeader } from '@/components/SimpleHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { useX } from '@/lib/i18nExtra';

const PrivacyPage = () => {
  const x = useX();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SeoHead path="/privacy" title={x.privacyTitle} desc={x.privacyDesc} />
      <SimpleHeader />
      <main className="container-narrow py-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">{x.privacyH1}</h1>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          {x.privacyP.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default PrivacyPage;
