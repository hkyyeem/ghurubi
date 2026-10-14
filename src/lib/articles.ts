import type { Lang } from '@/lib/i18n';

export type ArticleSection = { h: string; p: string[]; quote?: string | string[] };
export type ArticleBody = {
  title: string; desc: string; kicker: string; h1: string; lead: string;
  sections: ArticleSection[]; tweet: string;
};
export type Article = {
  slug: string;
  date: string; // ISO
  content: Partial<Record<Lang, ArticleBody>> & { ar: ArticleBody; en: ArticleBody };
};

export const ARTICLES: Article[] = [
  {
    slug: 'sunset-workday',
    date: '2026-10-14',
    content: {
      ar: {
        title: 'يوم العمل بتوقيت غروبي — كيف تعيد الشمس تعريف الدوام؟ | غروبي',
        desc: 'مقال فلسفي وتاريخي: كيف سيبدو يوم العمل لو اعتمدنا التوقيت الغروبي؟ سيناريوهان بالساعات الزمانية والساعات المستوية، والبركة في البكور.',
        kicker: 'مقال · العمل والزمن',
        h1: 'يوم العمل بتوقيت غروبي',
        lead: 'ماذا لو انتهى دوامك مع غروب الشمس تماماً، وبدأ يومك بالراحة لا بالعمل؟ تأمل في سيناريوهين لعمل يتبع الشمس بدل ساعة المصنع.',
        tweet: 'تخيّل أن ينتهي دوامك مع غروب الشمس، وأن يبدأ يومك بالراحة لا بالعمل. كيف يبدو يوم العمل بتوقيت غروبي؟',
        sections: [
          { h: 'ساعة المصنع', p: [
            'نظام الدوام الذي نعرفه اليوم، من التاسعة إلى الخامسة، ليس من صنع الطبيعة ولا من إيقاع الجسد. إنه ابن الثورة الصناعية، حين احتاجت المصانع إلى أوقات موحدة تدور مع الآلات لا مع الشمس.',
            'ثم جاءت السكك الحديدية والمناطق الزمنية في القرن التاسع عشر، فصار الوقت رقماً متفقاً عليه بين المدن، منفصلاً عن السماء فوق كل مدينة.',
            'والنتيجة مفارقة يعيشها الملايين: يستيقظ الموظف في الشتاء في الظلام ليلحق رقماً على الشاشة، ويخرج من عمله في الصيف والشمس ما تزال عالية، كأن النهار لا يعنيه.',
          ], quote: 'دوام التاسعة إلى الخامسة ابن المصنع، لا ابن الشمس.' },
          { h: 'البركة في البكور', p: [
            'دعا النبي ﷺ: «اللهم بارك لأمتي في بكورها»، وكان إذا بعث سرية أو جيشاً بعثهم أول النهار. ويروي راوي الحديث صخر الغامدي أنه كان تاجراً يبعث تجارته أول النهار فأثرى وكثر ماله (رواه أبو داود والترمذي).',
            'قامت على هذا المعنى أسواق المدن الإسلامية قروناً: يبدأ السعي بعد الفجر مع أول الضوء، ويهدأ عند القيلولة في الظهيرة، ثم يُختم النهار قبل المغرب.',
            'والقرآن يرسم هذا الإيقاع صراحة: «وجعلنا الليل لباساً، وجعلنا النهار معاشاً». النهار للسعي والليل للسكن، والحد بينهما هو الغروب.',
          ], quote: ['«اللهم بارك لأمتي في بكورها» — حديث نبوي', '«وجعلنا الليل لباساً، وجعلنا النهار معاشاً»'] },
          { h: 'الليل أولاً: يوم يبدأ بالراحة', p: [
            'في التوقيت الغروبي يبدأ اليوم عند الغروب (00:00). معنى ذلك عميق: يومك يفتتح بالعائلة والعشاء والنوم، ثم تدخل نهارك وقد أخذت حقك من الراحة.',
            'أما في التوقيت الزوالي فيبدأ اليوم في منتصف الليل، ويُختصر المساء إلى بقية منهكة بعد العمل. الفرق ليس في الأرقام، بل في ترتيب الأولويات.',
          ], quote: 'في التوقيت الغروبي يبدأ يومك بالراحة، لا بالعمل.' },
          { h: 'السيناريو الأول: الساعات الزمانية', p: [
            'هنا يُقسم النهار دائماً إلى 12 ساعة زمانية، أياً كان الفصل. في الصيف تطول الساعة لأن النهار طويل، وفي الشتاء تقصر.',
            'لو كان الدوام ثماني ساعات زمانية من الساعة 4 نهاراً إلى الغروب، فإنه يمتد في صيف الرياض إلى نحو تسع ساعات فعلية، وينكمش في الشتاء إلى نحو سبع ساعات ونصف. وفي المدن الشمالية يكون الفرق أكبر بكثير.',
            'هذا ليس عيباً بل فكرة: الإنسان يعمل أكثر حين يكثر الضوء وتعلو الطاقة، ويرتاح أكثر حين يطول الليل ويبرد الجو. وتأتي القيلولة عند الساعة السادسة نهاراً، منتصف النهار تماماً، لتقسم الجهد إلى شطرين.',
            'وهكذا عاشت المجتمعات قبل الساعة الميكانيكية: ساعات الصلاة والسوق والحقل كلها زمانية، تتنفس مع الفصول.',
          ]},
          { h: 'السيناريو الثاني: ثماني ساعات مستوية تنتهي بالغروب', p: [
            'هنا نحافظ على الساعة التي نعرفها، 60 دقيقة ثابتة، لكننا نغير المرساة: الدوام لا يبدأ عند رقم ثابت، بل ينتهي عند الغروب.',
            'يبدأ العمل الساعة 4:00 نهاراً بتوقيت غروبي، أي قبل الغروب بثماني ساعات كاملة، وينتهي الساعة 12:00، لحظة الغروب. ثماني ساعات بالضبط في كل فصل.',
            'الذي يتغير هو بدايتها بالنسبة للشروق: في الصيف تبدأ بعد الشروق بوقت طويل، فيتسع البكور للعبادة والرياضة والعائلة. وفي الشتاء تبدأ قريباً من الشروق، فيكون البكور نفسه عملاً.',
            'والشعور مختلف تماماً: يخرج الناس من أعمالهم مع احمرار الأفق. لا عمل إضافي يسرق المساء، لأن الغروب حد وضعته الطبيعة، يعلن يوماً جديداً وصلاة المغرب ومائدة البيت.',
          ], quote: 'يخرج الناس من أعمالهم مع احمرار الأفق؛ لا عمل إضافي يسرق المساء.' },
          { h: 'ماذا نكسب؟', p: [
            'انسجام الجسد مع الضوء: أبحاث الإيقاع اليومي تربط التعرض لضوء الصباح بنوم أفضل ومزاج أهدأ، وتربط العمل في الظلام بإرهاق مزمن.',
            'حدود واضحة للعمل: حين يكون الغروب نهاية الدوام، يصعب أن يتمدد العمل إلى الليل.',
            'معنى للوقت: يعرف كل شخص كم بقي من نهاره، فيصير الوقت شيئاً يُرى في السماء لا رقماً مجرداً.',
          ]},
          { h: 'والتحديات', p: [
            'العالم اليوم مترابط عبر المناطق الزمنية، والاجتماعات الدولية والطيران والأسواق تحتاج إلى مرجع موحد. لذلك لا يدعو غروبي إلى إلغاء التوقيت المدني، بل إلى إعادة الشمس مرجعاً شخصياً ومجتمعياً للحياة اليومية.',
            'قد تبدأ التجربة صغيرة: مكتب يختم يومه عند الغروب، أو شخص يرتب مهامه بحسب ساعات نهاره الحقيقية. ومن هناك يتسع الوعي.',
          ]},
        ],
      },
      en: {
        title: 'The Workday in Ghurubi Time — Letting the Sun Define Work | Ghurubi',
        desc: 'A philosophical and historical essay: what would a workday look like in sunset-based time? Two scenarios with seasonal and equal hours.',
        kicker: 'Essay · Work & Time',
        h1: 'The workday in Ghurubi time',
        lead: 'What if your workday ended exactly at sunset, and your day began with rest instead of work? Two scenarios for work that follows the sun, not the factory clock.',
        tweet: 'Imagine your workday ending exactly at sunset, and your day beginning with rest, not work. What does a workday look like in Ghurubi time?',
        sections: [
          { h: 'The factory clock', p: [
            'The nine-to-five we know is not a product of nature or of the body’s rhythm. It is a child of the Industrial Revolution, when factories needed shared hours that turned with machines, not with the sun.',
            'Railways and time zones in the 19th century then turned time into a number agreed between cities, detached from the sky above each one.',
            'The result: millions wake in winter darkness to chase a number on a screen, and leave work in summer with the sun still high.',
          ], quote: 'The nine-to-five is a child of the factory, not of the sun.' },
          { h: 'Blessing in the early hours', p: [
            'The Prophet ﷺ prayed: “O Allah, bless my nation in its early mornings.” The narrator, Sakhr al-Ghamidi, was a merchant who sent out his trade early in the day and prospered (Abu Dawud, Tirmidhi).',
            'For centuries markets in Islamic cities followed this rhythm: work began after dawn, paused for the midday rest, and closed before sunset.',
            'The Qur’an draws the same rhythm: “We made the night a covering, and made the day for livelihood.” Day is for striving, night for rest, and sunset is the line between them.',
          ], quote: ['“O Allah, bless my nation in its early mornings.” — Prophetic hadith', '“We made the night a covering, and made the day for livelihood.”'] },
          { h: 'Night first: a day that begins with rest', p: [
            'In Ghurubi time the day begins at sunset (00:00). Your day opens with family, dinner and sleep, and you enter daylight already rested.',
            'In civil time the day begins at midnight, and the evening shrinks to a tired remainder after work. The difference is not in numbers but in priorities.',
          ], quote: 'In Ghurubi time, your day begins with rest, not work.' },
          { h: 'Scenario one: seasonal hours', p: [
            'The day is always divided into 12 seasonal hours. In summer each hour is longer, in winter shorter.',
            'An eight-seasonal-hour shift from day hour 4 to sunset stretches to about nine real hours in a Riyadh summer and shrinks to about seven and a half in winter. In northern cities the swing is far larger.',
            'This is the idea, not a flaw: people work more when light and energy are abundant, and rest more when nights are long. The midday rest falls at hour 6, exactly mid-day.',
            'This is how societies lived before mechanical clocks: prayer, market and field hours were all seasonal.',
          ]},
          { h: 'Scenario two: eight equal hours ending at sunset', p: [
            'We keep the familiar 60-minute hour but change the anchor: the shift does not start at a fixed number, it ends at sunset.',
            'Work starts at 4:00 day in Ghurubi time — eight full hours before sunset — and ends at 12:00, the moment of sunset. Exactly eight hours, every season.',
            'What moves is its start relative to sunrise: in summer it starts long after dawn, leaving a wide morning for prayer, exercise and family; in winter it starts near sunrise.',
            'And the feeling changes: people leave work as the horizon turns red. No overtime steals the evening, because sunset is a boundary set by nature.',
          ], quote: 'People leave work as the horizon turns red; no overtime steals the evening.' },
          { h: 'What we gain', p: [
            'A body in tune with light: circadian research links morning light to better sleep and mood, and work in darkness to chronic fatigue.',
            'Clear limits: when sunset ends the shift, work struggles to spill into the night.',
            'Meaningful time: everyone knows how much daylight is left; time becomes something you see in the sky.',
          ]},
          { h: 'And the challenges', p: [
            'Today’s world is linked across time zones; flights, markets and global meetings need a shared reference. Ghurubi does not call to abolish civil time, but to restore the sun as a personal and communal reference for daily life.',
            'It can start small: an office that closes at sunset, or a person who plans tasks by real daylight hours.',
          ]},
        ],
      },
    },
  },
];

export const ARTICLES_LABEL: Record<Lang, string> = { ar: 'مقالات', en: 'Articles', tr: 'Makaleler', he: 'מאמרים' };

export function getArticle(slug: string) { return ARTICLES.find(a => a.slug === slug); }
export function articleBody(a: Article, lang: Lang): ArticleBody {
  return a.content[lang] ?? (lang === 'ar' ? a.content.ar : a.content.en);
}

export type DbArticle = {
  slug: string; published_at: string | null; created_at: string;
  title_ar: string; title_en: string; kicker_ar: string; kicker_en: string;
  desc_ar: string; desc_en: string; lead_ar: string; lead_en: string;
  tweet_ar: string; tweet_en: string; body_ar: string; body_en: string;
};

/** Body format: "## Heading" starts a section, "> text" is a tweetable quote, blank line = new paragraph. */
export function parseBody(body: string): ArticleSection[] {
  const out: ArticleSection[] = [];
  let cur: ArticleSection | null = null;
  const ensure = () => { if (!cur) { cur = { h: '', p: [] }; out.push(cur); } return cur; };
  for (const block of body.replace(/\r/g, '').split(/\n\s*\n/)) {
    const lines = block.split('\n');
    let para: string[] = [];
    const flush = () => { if (para.length) { ensure().p.push(para.join(' ').trim()); para = []; } };
    for (const raw of lines) {
      const l = raw.trim();
      if (!l) continue;
      if (l.startsWith('## ')) { flush(); cur = { h: l.slice(3).trim(), p: [] }; out.push(cur); }
      else if (l.startsWith('>')) {
        flush(); const s = ensure(); const q = l.replace(/^>\s*/, '');
        s.quote = s.quote ? [...(Array.isArray(s.quote) ? s.quote : [s.quote]), q] : q;
      } else para.push(l);
    }
    flush();
  }
  return out;
}

export function dbToArticle(r: DbArticle): Article {
  const mk = (l: 'ar' | 'en'): ArticleBody => {
    const h1 = r[`title_${l}`] || r.title_en || r.title_ar;
    return {
      title: `${h1} | ${l === 'ar' ? 'غروبي' : 'Ghurubi'}`, h1,
      desc: r[`desc_${l}`] || r[`lead_${l}`], kicker: r[`kicker_${l}`], lead: r[`lead_${l}`],
      tweet: r[`tweet_${l}`] || h1, sections: parseBody(r[`body_${l}`] || r.body_en || r.body_ar),
    };
  };
  return { slug: r.slug, date: (r.published_at || r.created_at).slice(0, 10), content: { ar: mk('ar'), en: mk('en') } };
}
