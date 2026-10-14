import SunCalc from 'suncalc';
import { useGeolocation } from '@/hooks/useNaturalTime';
import { useI18n, cityName } from '@/lib/i18n';

function dur(min: number, ar: boolean) {
  const m = Math.max(0, Math.round(min));
  const h = Math.floor(m / 60), r = m % 60;
  if (ar) return [h ? `${h} س` : '', r ? `${r} د` : ''].filter(Boolean).join(' و') || '0 د';
  return [h ? `${h}h` : '', r ? `${r}m` : ''].filter(Boolean).join(' ') || '0m';
}

function dayLen(d: Date, lat: number, lon: number) {
  const t = SunCalc.getTimes(d, lat, lon, 0);
  return (t.sunset.getTime() - t.sunrise.getTime()) / 60000;
}

export function WorkdayWidget() {
  const { lang } = useI18n();
  const { location } = useGeolocation();
  const ar = lang === 'ar';
  const y = new Date().getFullYear();
  const north = location.latitude >= 0;
  const { latitude: la, longitude: lo } = location;
  const today = dayLen(new Date(), la, lo);
  const summer = dayLen(new Date(y, north ? 5 : 11, 21, 12), la, lo);
  const winter = dayLen(new Date(y, north ? 11 : 5, 21, 12), la, lo);
  const seas = (L: number) => (L * 8) / 12;
  const city = location.city ? cityName(location.city, lang) : `${la.toFixed(2)}, ${lo.toFixed(2)}`;

  const Stat = ({ k, v }: { k: string; v: string }) => (
    <div className="flex items-baseline justify-between gap-3 py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{k}</span>
      <span className="font-semibold tabular-nums text-end">{v}</span>
    </div>
  );

  return (
    <aside className="border border-border rounded-lg p-5 md:p-6 my-4">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">{ar ? 'احسبها لمدينتك' : 'Calculate for your city'}</p>
      <h3 className="text-xl font-semibold">{city}</h3>
      <p className="text-sm text-muted-foreground mb-5">
        {ar ? 'طول النهار اليوم: ' : 'Daylight today: '}<span className="text-foreground font-medium">{dur(today, ar)}</span>
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-md bg-muted/40 p-4">
          <h4 className="font-semibold mb-1">{ar ? 'السيناريو الأول: ساعات زمانية' : 'Scenario 1: seasonal hours'}</h4>
          <p className="text-xs text-muted-foreground mb-3">{ar ? 'من 4:00 نهاراً حتى الغروب — المدة تتغير مع الفصول' : 'From 4:00 day to sunset — length changes with seasons'}</p>
          <Stat k={ar ? 'دوامك اليوم' : 'Your shift today'} v={dur(seas(today), ar)} />
          <Stat k={ar ? 'في الصيف' : 'In summer'} v={dur(seas(summer), ar)} />
          <Stat k={ar ? 'في الشتاء' : 'In winter'} v={dur(seas(winter), ar)} />
        </section>
        <section className="rounded-md bg-muted/40 p-4">
          <h4 className="font-semibold mb-1">{ar ? 'السيناريو الثاني: 8 ساعات مستوية' : 'Scenario 2: 8 equal hours'}</h4>
          <p className="text-xs text-muted-foreground mb-3">{ar ? 'تنتهي دائماً مع الغروب — والوقت الحر قبلها يتغير' : 'Always ends at sunset — free morning before it varies'}</p>
          <Stat k={ar ? 'صباح حر قبل الدوام اليوم' : 'Free morning today'} v={dur(today - 480, ar)} />
          <Stat k={ar ? 'في الصيف' : 'In summer'} v={dur(summer - 480, ar)} />
          <Stat k={ar ? 'في الشتاء' : 'In winter'} v={dur(winter - 480, ar)} />
        </section>
      </div>
    </aside>
  );
}
