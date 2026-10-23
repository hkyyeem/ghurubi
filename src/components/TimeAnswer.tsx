import type { NaturalTime, SeasonalTime } from '@/hooks/useNaturalTime';
import { readBoot } from '@/lib/boot';
import { useI18n, type Lang } from '@/lib/i18n';

const ANSWER_H: Record<Lang, (c: string) => string> = {
  ar: c => `كم الساعة الآن بالتوقيت الغروبي في ${c}؟`,
  en: c => `What time is it now in ${c} in Ghurubi time?`,
  tr: c => `${c} için ezanî saat şimdi kaç?`,
  he: c => `מה השעה עכשיו ב${c} לפי זמן השקיעה?`,
};

type AnswerFn = (c: string, now: string, sunrise: string, night: string, day: string) => string;
const ANSWER_P: Record<Lang, AnswerFn> = {
  ar: (c, now, sr, n, d) => `الساعة الآن ${now} بالتوقيت الغروبي في ${c}. في هذا النظام يبدأ اليوم عند غروب الشمس (00:00 مع أذان المغرب)، فيأتي الليل أولاً ثم النهار. تشرق الشمس اليوم في ${c} عند الساعة ${sr} غروبي، ويستمر الليل ${n} والنهار ${d}. تُحسب الأوقات فلكياً من إحداثيات ${c} وفق معايير أم القرى، وتتغير يومياً مع حركة الشمس.`,
  en: (c, now, sr, n, d) => `It is ${now} Ghurubi time in ${c} now. In this system the day begins at sunset (00:00, at Maghrib), so night comes first, then day. Today in ${c} the sun rises at ${sr} Ghurubi time; the night lasts ${n} and the day ${d}. Times are computed astronomically from ${c}'s coordinates and shift daily with the sun.`,
  tr: (c, now, sr, n, d) => `${c} için ezanî saat şu anda ${now}. Bu sistemde gün, gün batımında (00:00, akşam ezanı) başlar; önce gece, sonra gündüz gelir. Bugün ${c} için güneş ezanî ${sr}'da doğar; gece ${n}, gündüz ${d} sürer. Saatler ${c} koordinatlarından astronomik olarak hesaplanır.`,
  he: (c, now, sr, n, d) => `השעה עכשיו ב${c} היא ${now} לפי זמן השקיעה. בשיטה זו היום מתחיל בשקיעה (00:00), הלילה קודם ואחריו היום. היום ב${c} הזריחה בשעה ${sr}; הלילה נמשך ${n} והיום ${d}. הזמנים מחושבים אסטרונומית לפי קואורדינטות ${c}.`,
};

const AS_OF: Record<Lang, (stamp: string) => string> = {
  en: s => `Times on this page were calculated at ${s} and update to the current moment when the page runs.`,
  ar: s => `حُسبت الأوقات في هذه الصفحة عند ${s}، وتتحدّث إلى اللحظة الحالية عند تشغيل الصفحة.`,
  tr: s => `Bu sayfadaki saatler ${s} itibarıyla hesaplandı; sayfa çalışınca güncel ana geçer.`,
  he: s => `הזמנים בעמוד זה חושבו ב־${s} ומתעדכנים לרגע הנוכחי כשהעמוד רץ.`,
};

const LIVE: Record<Lang, string> = {
  en: 'Showing the current Ghurubi time.',
  ar: 'يُعرض التوقيت الغروبي الحالي.',
  tr: 'Güncel ezanî saat gösteriliyor.',
  he: 'מוצג זמן השקיעה הנוכחי.',
};

const INTRO: Record<Lang, (c: string) => string> = {
  en: c => `Ghurubi time in ${c}: the day begins at sunset (00:00) and night comes first. The clock below is sunset-based time for this city, calculated from its coordinates.`,
  ar: c => `التوقيت الغروبي في ${c}: يبدأ اليوم عند غروب الشمس (00:00) ويأتي الليل أولاً. الساعة أدناه هي وقت غروبي لهذه المدينة، محسوباً من إحداثياتها.`,
  tr: c => `${c} için ezanî saat: gün, gün batımında (00:00) başlar ve önce gece gelir. Aşağıdaki saat, şehrin koordinatlarından hesaplanan gün batımı saatidir.`,
  he: c => `זמן שקיעה ב${c}: היום מתחיל בשקיעה (00:00) והלילה קודם. השעון למטה הוא הזמן לפי השקיעה לעיר הזו, מחושב לפי הקואורדינטות שלה.`,
};

const pad = (n: number) => String(n).padStart(2, '0');
const fmt = (h: number, m: number) => `${pad(h)}:${pad(m)}`;
const hm = (v: number): [number, number] => {
  const hours = v > 1000 ? v / 3600000 : v;
  const total = ((Math.round(hours * 60) % 1440) + 1440) % 1440;
  return [Math.floor(total / 60) % 24, total % 60];
};

function stamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.toISOString().slice(0, 16).replace('T', ' ')} UTC`;
}

/** Readable explanation for people and crawlers that do not run JavaScript. */
export function TimeAnswer({ cityLabel, time }: { cityLabel: string; time: NaturalTime | SeasonalTime | null }) {
  const { lang } = useI18n();
  const boot = time?.frozen ? readBoot() : null;
  const note = boot?.asOf ? AS_OF[lang](stamp(boot.asOf)) : LIVE[lang];
  const body = time
    ? (ANSWER_P[lang] ?? ANSWER_P.en)(
      cityLabel,
      fmt(time.hours, time.minutes),
      fmt(...hm((time.sunrise.getTime() - time.lastSunset.getTime()) / 3600000)),
      fmt(...hm(time.nightLength)),
      fmt(...hm(time.dayLength)),
    )
    : INTRO[lang](cityLabel);

  return (
    <section className="container-narrow mt-10 text-sm leading-relaxed text-muted-foreground max-w-2xl">
      <p className="text-xs min-h-[2.5rem] mb-2">{note}</p>
      <h2 className="font-semibold mb-2 text-foreground">{(ANSWER_H[lang] ?? ANSWER_H.en)(cityLabel)}</h2>
      <p className="min-h-[4.5rem]">{body}</p>
    </section>
  );
}
