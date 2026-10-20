import { SeoHead } from '@/components/SeoHead';
import { SimpleHeader } from '@/components/SimpleHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { useI18n, type Lang } from '@/lib/i18n';
import { Download } from 'lucide-react';

type Content = {
  title: string; desc: string; kicker: string; h1: string; lead: string;
  featuresH: string; features: { h: string; p: string }[];
  installH: string; install: string[];
  download: string; note: string;
};

const C: Record<Lang, Content> = {
  ar: {
    title: 'غروبي على ساعة Wear OS — وجه الساعة | غروبي',
    desc: 'وجه ساعة غروبي لساعات Wear OS: التوقيت الغروبي على معصمك، ساعات مستوية وزمانية، والصلاة القادمة. حمّل المشروع وثبّته على ساعتك.',
    kicker: 'Wear OS',
    h1: 'غروبي على معصمك',
    lead: 'وجه ساعة Wear OS يضع التوقيت الغروبي على معصمك: الغروب 12 في الأعلى، الليل أولاً، والصلاة القادمة بنقرة واحدة.',
    featuresH: 'الميزات',
    features: [
      { h: 'قرص الغروب', p: 'الرقم 12 في الأعلى هو لحظة الغروب؛ العقارب تقيس الليل ثم النهار منه.' },
      { h: 'ساعتان في وجه واحد', p: 'انقر الشاشة للتبديل بين الساعات المستوية (60 دقيقة ثابتة) والساعات الزمانية (12 ليلاً و12 نهاراً)، مع لون مميز لكل وضع.' },
      { h: 'الصلاة القادمة', p: 'انقر أسفل الشاشة للتنقل بين ثلاث حالات: وقت الصلاة القادمة بالتوقيت الغروبي، العد التنازلي لها، أو إخفاؤها تماماً.' },
      { h: 'يعمل بلا اتصال', p: 'كل الحسابات الفلكية تتم على الساعة نفسها من موقعك؛ لا إنترنت ولا حساب.' },
    ],
    installH: 'التثبيت',
    install: [
      'حمّل حزمة المشروع وافتحها في Android Studio.',
      'فعّل تصحيح ADB عبر Wi‑Fi في ساعتك (إعدادات المطوّر).',
      'نفّذ Pair ثم Connect من جهازك إلى عنوان الساعة.',
      'شغّل التطبيق من Android Studio، ثم اختر وجه Ghurubi من قائمة الوجوه.',
    ],
    download: 'تحميل حزمة المشروع (ZIP)',
    note: 'قيد التجهيز للنشر الرسمي على Google Play.',
  },
  en: {
    title: 'Ghurubi on Wear OS — Watch Face | Ghurubi',
    desc: 'The Ghurubi watch face for Wear OS: sunset time on your wrist, equal and seasonal hours, and the next prayer. Download and install on your watch.',
    kicker: 'Wear OS',
    h1: 'Ghurubi on your wrist',
    lead: 'A Wear OS watch face that puts sunset time on your wrist: sunset is 12 at the top, night comes first, and the next prayer is one tap away.',
    featuresH: 'Features',
    features: [
      { h: 'The sunset dial', p: '12 at the top marks sunset; the hands measure night then day from it.' },
      { h: 'Two clocks in one face', p: 'Tap the screen to switch between equal hours (fixed 60 minutes) and seasonal hours (12 for night, 12 for day), each with its own accent color.' },
      { h: 'Next prayer', p: 'Tap the lower part of the screen to cycle three states: next prayer in Ghurubi time, a countdown to it, or hidden.' },
      { h: 'Works offline', p: 'All solar calculations run on the watch from your location; no internet, no account.' },
    ],
    installH: 'Install',
    install: [
      'Download the project bundle and open it in Android Studio.',
      'Enable ADB debugging over Wi‑Fi on your watch (developer settings).',
      'Pair, then connect from your computer to the watch address.',
      'Run the app from Android Studio, then pick the Ghurubi face from the watch face picker.',
    ],
    download: 'Download project bundle (ZIP)',
    note: 'Being prepared for official release on Google Play.',
  },
  tr: {
    title: 'Wear OS’te Ghurubi — Saat Kadranı | Ghurubi',
    desc: 'Wear OS için Ghurubi saat kadranı: bileğinizde gün batımı saati, eşit ve zamanî saatler ve bir sonraki namaz. İndirin ve saatinize kurun.',
    kicker: 'Wear OS',
    h1: 'Ghurubi bileğinizde',
    lead: 'Gün batımı saatini bileğinize getiren bir Wear OS kadranı: gün batımı üstte 12, önce gece gelir ve bir sonraki namaz bir dokunuş uzakta.',
    featuresH: 'Özellikler',
    features: [
      { h: 'Gün batımı kadranı', p: 'Üstteki 12 gün batımını işaretler; akrep ve yelkovan geceyi ve gündüzü ondan ölçer.' },
      { h: 'Tek kadranda iki saat', p: 'Eşit saatler (sabit 60 dakika) ile zamanî saatler (gece 12, gündüz 12) arasında geçiş için ekrana dokunun; her modun kendi rengi var.' },
      { h: 'Bir sonraki namaz', p: 'Ekranın alt kısmına dokunarak üç durum arasında geçiş yapın: Ghurubi saatiyle bir sonraki namaz, geri sayım veya gizli.' },
      { h: 'Çevrimdışı çalışır', p: 'Tüm güneş hesapları konumunuzdan saat üzerinde yapılır; internet yok, hesap yok.' },
    ],
    installH: 'Kurulum',
    install: [
      'Proje paketini indirin ve Android Studio’da açın.',
      'Saatinizde Wi‑Fi üzerinden ADB hata ayıklamayı açın (geliştirici ayarları).',
      'Bilgisayarınızdan saatin adresine Pair ardından Connect yapın.',
      'Uygulamayı Android Studio’dan çalıştırın, sonra kadran listesinden Ghurubi’yi seçin.',
    ],
    download: 'Proje paketini indir (ZIP)',
    note: 'Google Play’de resmî yayın için hazırlanıyor.',
  },
  he: {
    title: 'Ghurubi ב‑Wear OS — פני שעון | Ghurubi',
    desc: 'פני השעון של Ghurubi ל‑Wear OS: זמן שקיעה על שורש היד, שעות שוות וזמניות, והתפילה הבאה. הורידו והתקינו בשעון.',
    kicker: 'Wear OS',
    h1: 'Ghurubi על שורש היד',
    lead: 'פני שעון ל‑Wear OS שמניחים את זמן השקיעה על שורש ידך: השקיעה היא 12 למעלה, הלילה קודם, והתפילה הבאה במרחק נגיעה.',
    featuresH: 'תכונות',
    features: [
      { h: 'חוגת השקיעה', p: 'ה‑12 למעלה מסמן את השקיעה; המחוגים מודדים את הלילה ואז את היום ממנה.' },
      { h: 'שני שעונים בפני אחד', p: 'הקישו על המסך למעבר בין שעות שוות (60 דקות קבועות) לשעות זמניות (12 ללילה ו־12 ליום), לכל מצב צבע משלו.' },
      { h: 'התפילה הבאה', p: 'הקישו בחלק התחתון של המסך כדי לעבור בין שלושה מצבים: התפילה הבאה בזמן Ghurubi, ספירה לאחור, או הסתרה.' },
      { h: 'עובד ללא חיבור', p: 'כל החישובים האסטרונומיים מתבצעים על השעון מהמיקום שלך; בלי אינטרנט ובלי חשבון.' },
    ],
    installH: 'התקנה',
    install: [
      'הורידו את חבילת הפרויקט ופתחו אותה ב‑Android Studio.',
      'הפעילו ניפוי ADB דרך Wi‑Fi בשעון (הגדרות מפתח).',
      'בצעו Pair ואז Connect מהמחשב לכתובת השעון.',
      'הריצו את האפליקציה מ‑Android Studio ובחרו את פני Ghurubi מרשימת פני השעון.',
    ],
    download: 'הורדת חבילת הפרויקט (ZIP)',
    note: 'בהכנה לפרסום רשמי ב‑Google Play.',
  },
};

export const WEAR_LABEL: Record<Lang, string> = { ar: 'ساعة Wear OS', en: 'Wear OS', tr: 'Wear OS', he: 'Wear OS' };

/** Static mock of the Wear OS dial: sunset 12 at top, hands, day label, prayer line. Ghurubi time only. */
function DialMock() {
  const accent = 'hsl(210 90% 70%)';
  const hand = (frac: number, len: number, w: number, color: string) => (
    <line x1="100" y1="100" x2="100" y2={100 - len} stroke={color} strokeWidth={w} strokeLinecap="round"
      transform={`rotate(${frac * 360} 100 100)`} />
  );
  return (
    <div className="rounded-full mx-auto" style={{ width: 'min(70vw, 300px)', aspectRatio: '1', background: '#000', boxShadow: '0 0 0 6px #1a1a1a' }}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="97" fill="none" stroke="#222" strokeWidth="2" />
        <circle cx="100" cy="100" r="97" fill="none" stroke={accent} strokeWidth="2"
          strokeDasharray="380 609.5" transform="rotate(-90 100 100)" />
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i / 60) * 2 * Math.PI;
          const major = i % 5 === 0;
          const r1 = major ? 84 : 90, r2 = 93;
          return (
            <line key={i}
              x1={100 + r1 * Math.sin(a)} y1={100 - r1 * Math.cos(a)}
              x2={100 + r2 * Math.sin(a)} y2={100 - r2 * Math.cos(a)}
              stroke={i === 0 ? accent : major ? '#bbb' : '#444'} strokeWidth={major ? 2 : 0.8} />
          );
        })}
        {Array.from({ length: 12 }).map((_, i) => {
          const h = i === 0 ? 12 : i;
          const a = (i / 12) * 2 * Math.PI;
          return (
            <text key={i} x={100 + 72 * Math.sin(a)} y={100 - 72 * Math.cos(a) + 4}
              textAnchor="middle" fontSize={i === 0 ? 13 : 11} fontWeight={i === 0 ? 700 : 500}
              fill={i === 0 ? accent : '#ddd'} fontFamily="sans-serif">
              {h}
            </text>
          );
        })}
        <text x="100" y="66" textAnchor="middle" fontSize="10" fill={accent} fontFamily="sans-serif">ليلة الجمعة</text>
        {hand(0.22, 44, 4.5, '#fff')}
        {hand(0.65, 64, 2.5, '#ddd')}
        {hand(0.4, 70, 1, accent)}
        <circle cx="100" cy="100" r="3" fill={accent} />
        <text x="100" y="148" textAnchor="middle" fontSize="9" fill="#fff" fontFamily="sans-serif">الفجر 09:30</text>
      </svg>
    </div>
  );
}

const WearPage = () => {
  const { lang } = useI18n();
  const c = C[lang];
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SeoHead path="/wear" title={c.title} desc={c.desc} />
      <SimpleHeader />
      <main className="container-narrow py-12 md:py-20 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">{c.kicker}</p>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-6">{c.h1}</h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12">{c.lead}</p>

        <div className="mb-14">
          <DialMock />
        </div>

        <section className="mb-14">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">{c.featuresH}</h2>
          <ol className="space-y-8">
            {c.features.map((f, i) => (
              <li key={i} className="grid md:grid-cols-[4rem_1fr] gap-4 border-t border-border pt-6">
                <span className="text-sm font-semibold text-muted-foreground tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{f.h}</h3>
                  <p className="text-muted-foreground leading-relaxed">{f.p}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-border pt-8 mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">{c.installH}</h2>
          <ol className="list-decimal ps-5 space-y-2 text-muted-foreground leading-relaxed">
            {c.install.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </section>

        <section className="border-t border-border pt-8">
          <a href="/ghurubi-wear.zip" download
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-md text-sm font-medium hover:bg-foreground hover:text-background transition-colors">
            <Download className="w-4 h-4" />
            {c.download}
          </a>
          <p className="text-xs text-muted-foreground mt-3">{c.note}</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default WearPage;
