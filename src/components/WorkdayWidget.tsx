import SunCalc from 'suncalc';
import { useGeolocation } from '@/hooks/useNaturalTime';
import { useI18n, cityName } from '@/lib/i18n';

const hm = (min: number) => `${Math.floor(min / 60)}:${String(Math.round(min % 60)).padStart(2, '0')}`;

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
  const rows = [
    { l: ar ? 'اليوم' : 'Today', d: new Date() },
    { l: ar ? 'أطول نهار' : 'Longest day', d: new Date(y, north ? 5 : 11, 21, 12) },
    { l: ar ? 'أقصر نهار' : 'Shortest day', d: new Date(y, north ? 11 : 5, 21, 12) },
  ].map(r => {
    const L = dayLen(r.d, location.latitude, location.longitude);
    return { ...r, L, seasonal: (L * 8) / 12, morning: L - 480 };
  });
  const city = location.city ? cityName(location.city, lang) : `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`;

  return (
    <aside className="border border-border rounded-lg p-5 md:p-6 my-4">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">{ar ? 'احسبها لمدينتك' : 'Calculate for your city'}</p>
      <h3 className="text-xl font-semibold mb-4">{city}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm tabular-nums">
          <thead className="text-muted-foreground text-start">
            <tr className="border-b border-border">
              <th className="py-2 text-start font-medium"></th>
              <th className="py-2 text-start font-medium">{ar ? 'طول النهار' : 'Daylight'}</th>
              <th className="py-2 text-start font-medium">{ar ? '8 ساعات زمانية' : '8 seasonal h'}</th>
              <th className="py-2 text-start font-medium">{ar ? 'بكور قبل الدوام المستوي' : 'Morning before equal shift'}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.l} className="border-b border-border last:border-0">
                <td className="py-2 font-medium">{r.l}</td>
                <td className="py-2">{hm(r.L)}</td>
                <td className="py-2">{hm(r.seasonal)}</td>
                <td className="py-2">{r.morning > 0 ? hm(r.morning) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
        {ar ? 'الدوام المستوي: 8 ساعات من 4:00 نهاراً حتى 12:00 (الغروب). البكور هو الوقت بين الشروق وبداية الدوام.'
            : 'Equal shift: 8 hours from 4:00 day to 12:00 (sunset). Morning is the time between sunrise and the start of the shift.'}
      </p>
    </aside>
  );
}
