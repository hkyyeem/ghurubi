import { Link } from 'react-router-dom';
import { SeoHead } from '@/components/SeoHead';
import { SimpleHeader } from '@/components/SimpleHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { useI18n, type Lang } from '@/lib/i18n';

type Section = { h: string; p: string[] };
type Content = {
  title: string; desc: string; kicker: string; h1: string; lead: string;
  sections: Section[]; ctaH: string; cta: { to: string; label: string }[];
};

const C: Record<Lang, Content> = {
  ar: {
    title: 'قصة غروبي وفلسفته — لماذا يبدأ اليوم من الغروب؟ | غروبي',
    desc: 'تعرّف على فلسفة غروبي: الغروب 00:00 والليل أولاً، الجذور التاريخية للتوقيت الغروبي، والفرق بين الساعات المستوية والزمانية.',
    kicker: 'القصة والفلسفة',
    h1: 'لماذا يبدأ اليوم من الغروب؟',
    lead: 'غروبي ساعة الأرض الطبيعية: تعيد قياس الوقت إلى الشمس نفسها، فيكون الغروب لحظة الصفر ويأتي الليل أولاً ثم النهار.',
    sections: [
      { h: 'الغروب نقطة الصفر', p: [
        'في التوقيت الغروبي، الساعة 00:00 هي لحظة غروب الشمس في موقعك تماماً. يمتد الليل حتى الشروق، ثم يبدأ النهار حتى الغروب التالي.',
        'لا ترتبط الساعة بخطوط المناطق الزمنية، بل بموقعك الجغرافي الفعلي؛ لذلك تُحسب لكل مدينة بإحداثياتها.',
      ]},
      { h: 'جذور ممتدة عبر الحضارات', p: [
        'في الحضارة الإسلامية يبدأ اليوم من المغرب: ليلة الجمعة تسبق نهارها، ورؤية الهلال تكون عند الغروب.',
        'وفي العهد العثماني اعتُمد «التوقيت الأذاني» (الألاتوركا)، فكانت ساعات المساجد والأبراج تُصفَّر عند الغروب.',
        'وفي التراث العبري يبدأ اليوم مساءً، وتُقسَّم أوقات العبادة بالساعات الزمانية. كما عرفت حضارات قديمة تقسيم الليل والنهار إلى اثنتي عشرة ساعة لكل منهما.',
      ]},
      { h: 'لماذا اختفى؟ ولماذا يعود الآن؟', p: [
        'الساعة الميكانيكية تدور بسرعة ثابتة، بينما يتغير وقت الغروب كل يوم. لذلك احتاجت ساعات التوقيت الغروبي إلى ضبط يدوي شبه يومي، فتراجعت أمام التوقيت الزوالي الثابت.',
        'اليوم يحسب غروبي موضع الشمس فلكياً لموقعك لحظة بلحظة، فيعود التوقيت الطبيعي دون أي ضبط.',
      ]},
      { h: 'ساعتان في ساعة واحدة', p: [
        'الساعات المستوية: ساعات ثابتة من 60 دقيقة تبدأ من الغروب. هي التي تستطيع أن تضبط بها ساعة يدك العادية مرة عند كل غروب.',
        'الساعات الزمانية: يُقسم الليل إلى 12 ساعة والنهار إلى 12 ساعة، فتطول ساعات الليل شتاءً وساعات النهار صيفاً. الساعة السادسة دائماً منتصف الليل أو منتصف النهار.',
        'يجمع غروبي النظامين: الأول جسر مع الساعات التي نملكها، والثاني الإيقاع الطبيعي الأصيل.',
      ]},
      { h: 'ثورة هادئة في علاقتك بالزمن', p: [
        'أن تعرف كم بقي من نهارك، وأن تشعر بأن الليل بداية لا نهاية، تغيير بسيط في النظرة إلى الوقت.',
        'يبدأ هذا التغيير فردياً، ومع انتشاره قد يصبح وعياً مجتمعياً يعيد وصل الناس بإيقاع الأرض.',
      ]},
    ],
    ctaH: 'جرّب غروبي',
    cta: [
      { to: '/', label: 'الوقت الآن في موقعك' },
      { to: '/watch', label: 'وجه الساعة' },
      { to: '/cities', label: 'مدن العالم' },
      { to: '/compare', label: 'مقارنة المدن' },
    ],
  },
  en: {
    title: 'The Story & Philosophy of Ghurubi — Why the Day Starts at Sunset | Ghurubi',
    desc: 'Discover Ghurubi: sunset is 00:00 and night comes first. The history of sunset-based time and the difference between equal and seasonal hours.',
    kicker: 'Story & Philosophy',
    h1: 'Why does the day begin at sunset?',
    lead: 'Ghurubi is the Earth Clock: it measures time by the sun itself. Sunset is zero, night comes first, then day.',
    sections: [
      { h: 'Sunset is zero', p: [
        'In Ghurubi time, 00:00 is the exact moment the sun sets where you are. Night runs until sunrise, then day runs until the next sunset.',
        'The clock follows your real geographic position, not time-zone lines, so every city is calculated from its own coordinates.',
      ]},
      { h: 'Roots across civilizations', p: [
        'In Islamic tradition the day begins at Maghrib: Friday night comes before Friday, and the new moon is sighted at sunset.',
        'The Ottomans kept “ezanî” (alaturka) time: mosque and tower clocks were reset to zero at sunset.',
        'In Hebrew tradition the day begins in the evening and worship times use seasonal hours. Ancient civilizations also split night and day into twelve hours each.',
      ]},
      { h: 'Why it faded — and why it returns', p: [
        'A mechanical clock runs at a fixed speed, while sunset shifts every day. Sunset clocks needed resetting almost daily, so fixed civil time won.',
        'Today Ghurubi computes the sun’s position for your location in real time, so natural time returns with no adjustment.',
      ]},
      { h: 'Two clocks in one', p: [
        'Equal hours: fixed 60-minute hours counted from sunset — the kind you can set a regular wristwatch to at each sunset.',
        'Seasonal hours: night and day are each divided into 12 hours, stretching and shrinking with the seasons. Hour 6 is always mid-night or mid-day.',
        'Ghurubi offers both: one bridges to the clocks we own, the other is the original natural rhythm.',
      ]},
      { h: 'A quiet revolution in how you live time', p: [
        'Knowing how much daylight is left, and feeling night as a beginning rather than an end, is a small shift in perspective.',
        'It starts personally; as it spreads, it can become a shared awareness that reconnects people with the rhythm of the Earth.',
      ]},
    ],
    ctaH: 'Try Ghurubi',
    cta: [
      { to: '/', label: 'Time at your location' },
      { to: '/watch', label: 'Watch face' },
      { to: '/cities', label: 'World cities' },
      { to: '/compare', label: 'Compare cities' },
    ],
  },
  tr: {
    title: 'Ghurubi’nin Hikâyesi ve Felsefesi — Gün Neden Gün Batımında Başlar? | Ghurubi',
    desc: 'Ghurubi: gün batımı 00:00, önce gece. Ezanî saatin tarihi ve eşit saatler ile zamanî saatler arasındaki fark.',
    kicker: 'Hikâye ve Felsefe',
    h1: 'Gün neden gün batımında başlar?',
    lead: 'Ghurubi, Dünya Saati: zamanı güneşin kendisiyle ölçer. Gün batımı sıfırdır; önce gece, sonra gündüz gelir.',
    sections: [
      { h: 'Gün batımı sıfırdır', p: [
        'Ghurubi saatinde 00:00, bulunduğunuz yerde güneşin battığı andır. Gece gün doğumuna kadar, gündüz bir sonraki gün batımına kadar sürer.',
        'Saat, saat dilimi çizgilerine değil gerçek konumunuza bağlıdır; her şehir kendi koordinatlarıyla hesaplanır.',
      ]},
      { h: 'Medeniyetler boyunca kökler', p: [
        'İslam geleneğinde gün akşamla başlar: Cuma gecesi Cuma gününden önce gelir, hilal gün batımında gözlenir.',
        'Osmanlı’da ezanî (alaturka) saat kullanıldı; cami ve kule saatleri gün batımında sıfırlanırdı.',
        'İbrani geleneğinde gün akşam başlar ve ibadet vakitleri zamanî saatlerle belirlenir. Eski medeniyetler de geceyi ve gündüzü on ikişer saate bölmüştür.',
      ]},
      { h: 'Neden kayboldu, neden geri dönüyor?', p: [
        'Mekanik saat sabit hızda döner, gün batımı ise her gün değişir. Ezanî saatler neredeyse her gün ayar gerektirdi ve sabit saat kazandı.',
        'Bugün Ghurubi güneşin konumunu anlık hesaplar; doğal saat hiçbir ayar gerekmeden geri döner.',
      ]},
      { h: 'Bir saatte iki saat', p: [
        'Eşit saatler: gün batımından itibaren sayılan sabit 60 dakikalık saatler — kol saatinizi her gün batımında ayarlayabileceğiniz düzen.',
        'Zamanî saatler: gece ve gündüz 12’şer saate bölünür, mevsimlerle uzar ve kısalır. 6. saat her zaman gecenin ya da gündüzün ortasıdır.',
        'Ghurubi ikisini birleştirir: biri sahip olduğumuz saatlere köprü, diğeri asıl doğal ritim.',
      ]},
      { h: 'Zamanla ilişkinizde sessiz bir devrim', p: [
        'Gündüzden ne kadar kaldığını bilmek ve geceyi bir son değil başlangıç olarak hissetmek, bakışta küçük bir değişimdir.',
        'Bireysel başlar; yayıldıkça insanları Dünya’nın ritmine yeniden bağlayan ortak bir bilince dönüşebilir.',
      ]},
    ],
    ctaH: 'Ghurubi’yi deneyin',
    cta: [
      { to: '/', label: 'Konumunuzdaki saat' },
      { to: '/watch', label: 'Saat kadranı' },
      { to: '/cities', label: 'Dünya şehirleri' },
      { to: '/compare', label: 'Şehir karşılaştır' },
    ],
  },
  he: {
    title: 'הסיפור והפילוסופיה של Ghurubi — למה היום מתחיל בשקיעה? | Ghurubi',
    desc: 'Ghurubi: השקיעה היא 00:00 והלילה קודם. שורשי זמן השקיעה וההבדל בין שעות שוות לשעות זמניות.',
    kicker: 'סיפור ופילוסופיה',
    h1: 'למה היום מתחיל בשקיעה?',
    lead: 'Ghurubi הוא שעון כדור הארץ: הוא מודד זמן לפי השמש עצמה. השקיעה היא אפס, הלילה קודם ואחריו היום.',
    sections: [
      { h: 'השקיעה היא אפס', p: [
        'בזמן Ghurubi, 00:00 הוא רגע השקיעה המדויק במקומך. הלילה נמשך עד הזריחה, והיום עד השקיעה הבאה.',
        'השעון עוקב אחר מיקומך הגיאוגרפי האמיתי ולא אחר קווי אזורי זמן, כך שכל עיר מחושבת לפי הקואורדינטות שלה.',
      ]},
      { h: 'שורשים בין התרבויות', p: [
        'במסורת היהודית היום מתחיל בערב — "ויהי ערב ויהי בוקר" — וזמני התפילה נקבעים בשעות זמניות.',
        'במסורת האסלאמית היום מתחיל במגרב, והעות׳מאנים השתמשו ב"זמן אזאני" שבו השעונים אופסו בשקיעה.',
        'גם תרבויות עתיקות חילקו את הלילה ואת היום לשתים־עשרה שעות כל אחד.',
      ]},
      { h: 'למה נעלם — ולמה הוא חוזר', p: [
        'שעון מכני נע במהירות קבועה, ואילו השקיעה משתנה מדי יום. שעוני שקיעה דרשו כיוון כמעט יומי, ולכן הזמן האזרחי הקבוע ניצח.',
        'כיום Ghurubi מחשב את מיקום השמש עבור מיקומך בזמן אמת, והזמן הטבעי חוזר ללא כל כיוון.',
      ]},
      { h: 'שני שעונים בשעון אחד', p: [
        'שעות שוות: שעות קבועות של 60 דקות שנספרות מהשקיעה — אפשר לכוון אליהן שעון יד רגיל בכל שקיעה.',
        'שעות זמניות: הלילה והיום מחולקים כל אחד ל־12 שעות, שמתארכות ומתקצרות עם העונות. השעה השישית היא תמיד אמצע הלילה או אמצע היום.',
        'Ghurubi משלב את שתיהן: האחת גשר לשעונים שבידינו, והשנייה הקצב הטבעי המקורי.',
      ]},
      { h: 'מהפכה שקטה ביחסך לזמן', p: [
        'לדעת כמה נותר מן היום, ולחוש את הלילה כהתחלה ולא כסוף — זהו שינוי קטן בנקודת המבט.',
        'הוא מתחיל באופן אישי, ועם התפשטותו עשוי להפוך למודעות משותפת המחברת אנשים מחדש לקצב של כדור הארץ.',
      ]},
    ],
    ctaH: 'נסו את Ghurubi',
    cta: [
      { to: '/', label: 'הזמן במיקומך' },
      { to: '/watch', label: 'פני השעון' },
      { to: '/cities', label: 'ערי העולם' },
      { to: '/compare', label: 'השוואת ערים' },
    ],
  },
};

export const ABOUT_LABEL: Record<Lang, string> = { ar: 'عن غروبي', en: 'About', tr: 'Hakkında', he: 'אודות' };

const AboutPage = () => {
  const { lang } = useI18n();
  const c = C[lang];
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SeoHead path="/about" title={c.title} desc={c.desc} />
      <SimpleHeader />
      <main className="container-narrow py-12 md:py-20 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">{c.kicker}</p>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-6">{c.h1}</h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-14">{c.lead}</p>

        <ol className="space-y-14">
          {c.sections.map((s, i) => (
            <li key={i} className="grid md:grid-cols-[4rem_1fr] gap-4 border-t border-border pt-8">
              <span className="text-sm font-semibold text-muted-foreground tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <section>
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">{s.h}</h2>
                <div className="space-y-3 text-muted-foreground leading-relaxed">
                  {s.p.map((p, j) => <p key={j}>{p}</p>)}
                </div>
              </section>
            </li>
          ))}
        </ol>

        <section className="border-t border-border mt-16 pt-8">
          <h2 className="text-xl font-semibold mb-5">{c.ctaH}</h2>
          <div className="flex flex-wrap gap-3">
            {c.cta.map(l => (
              <Link key={l.to} to={l.to}
                className="px-4 py-2 border border-border rounded-md text-sm hover:bg-foreground hover:text-background transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default AboutPage;
