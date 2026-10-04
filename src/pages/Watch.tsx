import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Maximize, Moon, Sun, Hourglass, Clock, Hash, LocateFixed } from 'lucide-react';
import { useGeolocation, useNaturalTime } from '@/hooks/useNaturalTime';
import { useStoredState } from '@/hooks/useWatchPrefs';
import { STORAGE_KEYS } from '@/hooks/useLocalStorage';

const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0');

export default function Watch() {
  const { location, retryLocation, loading } = useGeolocation();
  const [seasonal, setSeasonal] = useStoredState<boolean>(STORAGE_KEYS.SEASONAL_HOURS, false);
  const [digital, setDigital] = useStoredState('ghurubi-watch-digital', false);
  const time = useNaturalTime(location, seasonal);
  const [ambient, setAmbient] = useState(false);

  useEffect(() => {
    document.title = 'Ghurubi Watch';
    // Always refresh the real location when the watch opens (saved city may be stale)
    retryLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!time) return <div className="min-h-screen bg-black" />;

  // 12-hour dial: 12 at top = sunset (night cycle) / sunrise (day cycle in seasonal)
  const h12 = time.hours % 12;
  const hourFrac = (h12 + time.minutes / 60 + time.seconds / 3600) / 12;
  const minFrac = (time.minutes + time.seconds / 60) / 60;
  const secFrac = time.seconds / 60;
  const cd = time.sunsetCountdown;
  const night = seasonal ? time.hours < 12 : time.isNight;
  const accent = night ? 'hsl(210 90% 70%)' : 'hsl(38 95% 60%)';
  const dim = ambient ? 0.45 : 1;
  const cycleLabel = night ? 'ليل' : 'نهار';
  const modeLabel = seasonal ? 'Seasonal Hours' : 'Natural Time';

  const hand = (frac: number, len: number, w: number, color: string) => (
    <line
      x1="100" y1="100" x2="100" y2={100 - len}
      stroke={color} strokeWidth={w} strokeLinecap="round"
      transform={`rotate(${frac * 360} 100 100)`}
    />
  );

  const btn = (active: boolean) => ({ background: '#111', color: active ? accent : undefined });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4" style={{ background: '#000' }}>
      <div
        className="relative rounded-full overflow-hidden"
        style={{ width: 'min(90vw, 90vh, 420px)', aspectRatio: '1', background: '#000', boxShadow: '0 0 0 6px #1a1a1a' }}
        onClick={() => setAmbient(a => !a)}
      >
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" style={{ opacity: dim }}>
          <circle cx="100" cy="100" r="97" fill="none" stroke="#222" strokeWidth="2" />
          <circle cx="100" cy="100" r="97" fill="none" stroke={accent} strokeWidth="2"
            strokeDasharray={`${(1 - cd.totalSeconds / 86400) * 609.5} 609.5`}
            transform="rotate(-90 100 100)" />
          {!digital && (
            <>
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
              {hand(hourFrac, 44, 4.5, '#fff')}
              {hand(minFrac, 64, 2.5, '#ddd')}
              {!ambient && hand(secFrac, 70, 1, accent)}
              <circle cx="100" cy="100" r="3" fill={accent} />
            </>
          )}
        </svg>

        {digital ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ opacity: dim }}>
            <div className="flex items-center gap-1" style={{ color: accent, fontSize: 'min(3.2vw, 13px)' }}>
              {night ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />} {cycleLabel}
            </div>
            <div className="font-bold tabular-nums leading-none" dir="ltr" style={{ color: '#fff', fontSize: 'min(17vw, 76px)' }}>
              {pad(time.hours)}:{pad(time.minutes)}
            </div>
            {!ambient && <div className="tabular-nums" dir="ltr" style={{ color: '#888', fontSize: 'min(6vw, 24px)' }}>{pad(time.seconds)}</div>}
            <div className="tabular-nums mt-1" dir="ltr" style={{ color: accent, fontSize: 'min(3.2vw, 13px)' }}>
              ↓ {pad(cd.hours)}:{pad(cd.minutes)}{!ambient && `:${pad(cd.seconds)}`}
            </div>
            <div style={{ color: '#777', fontSize: 'min(2.6vw, 10px)' }}>
              {location.city?.nameAr || location.city?.name || ''} · {modeLabel}
            </div>
          </div>
        ) : (
          <>
            <div className="absolute inset-x-0 top-[30%] flex justify-center items-center gap-1 pointer-events-none" style={{ opacity: dim, color: accent, fontSize: 'min(2.8vw, 11px)' }}>
              {night ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />} {cycleLabel}
            </div>
            <div className="absolute inset-x-0 top-[60%] flex flex-col items-center pointer-events-none" style={{ opacity: dim }}>
              <div className="font-semibold tabular-nums" dir="ltr" style={{ color: '#fff', fontSize: 'min(5.5vw, 22px)' }}>
                {pad(time.hours)}:{pad(time.minutes)}{!ambient && <span style={{ color: '#888' }}>:{pad(time.seconds)}</span>}
              </div>
              <div className="tabular-nums" dir="ltr" style={{ color: accent, fontSize: 'min(3vw, 12px)' }}>
                ↓ {pad(cd.hours)}:{pad(cd.minutes)}{!ambient && `:${pad(cd.seconds)}`}
              </div>
              <div style={{ color: '#777', fontSize: 'min(2.4vw, 9px)' }}>
                {location.city?.nameAr || location.city?.name || ''} · {modeLabel}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap justify-center" style={{ color: '#999' }}>
        <Link to="/" className="p-2 rounded-full" style={{ background: '#111' }} aria-label="Back"><ArrowLeft className="w-5 h-5" /></Link>
        <button className="p-2 rounded-full" style={btn(seasonal)} onClick={() => setSeasonal(!seasonal)} aria-label="Seasonal Hours" title="Seasonal Hours"><Hourglass className="w-5 h-5" /></button>
        <button className="p-2 rounded-full" style={btn(digital)} onClick={() => setDigital(!digital)} aria-label="Analog / Digital" title="Analog / Digital">{digital ? <Clock className="w-5 h-5" /> : <Hash className="w-5 h-5" />}</button>
        <button className="p-2 rounded-full" style={btn(loading)} onClick={() => retryLocation()} aria-label="Locate" title="Update location"><LocateFixed className={`w-5 h-5 ${loading ? "animate-pulse" : ""}`} /></button>
        <button className="p-2 rounded-full" style={btn(ambient)} onClick={() => setAmbient(a => !a)} aria-label="Ambient"><Moon className="w-5 h-5" /></button>
        <button className="p-2 rounded-full" style={{ background: '#111' }} onClick={() => document.documentElement.requestFullscreen?.()} aria-label="Fullscreen"><Maximize className="w-5 h-5" /></button>
      </div>
    </div>
  );
}
