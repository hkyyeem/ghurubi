import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Maximize, Moon } from 'lucide-react';
import { useGeolocation, useNaturalTime } from '@/hooks/useNaturalTime';
import { useStoredState } from '@/hooks/useWatchPrefs';

const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0');

export default function Watch() {
  const { location } = useGeolocation();
  const [seasonal] = useStoredState('ghurubi-watch-seasonal', false);
  const time = useNaturalTime(location, seasonal);
  const [ambient, setAmbient] = useState(false);

  useEffect(() => {
    document.title = 'Ghurubi Watch';
  }, []);

  if (!time) return <div className="min-h-screen bg-black" />;

  // Analog: 24h dial, sunset (00) at top
  const hourFrac = (time.hours + time.minutes / 60 + time.seconds / 3600) / 24;
  const minFrac = (time.minutes + time.seconds / 60) / 60;
  const secFrac = time.seconds / 60;
  const cd = time.sunsetCountdown;
  const accent = time.isNight ? 'hsl(210 90% 70%)' : 'hsl(38 95% 60%)';
  const dim = ambient ? 0.45 : 1;

  const hand = (frac: number, len: number, w: number, color: string) => (
    <line
      x1="100" y1="100" x2="100" y2={100 - len}
      stroke={color} strokeWidth={w} strokeLinecap="round"
      transform={`rotate(${frac * 360} 100 100)`}
    />
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4" style={{ background: '#000' }}>
      <div
        className="relative rounded-full overflow-hidden"
        style={{ width: 'min(90vw, 90vh, 420px)', aspectRatio: '1', background: '#000', boxShadow: '0 0 0 6px #1a1a1a' }}
        onClick={() => setAmbient(a => !a)}
      >
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" style={{ opacity: dim }}>
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * 2 * Math.PI;
            const major = i % 6 === 0;
            const r1 = major ? 84 : 89, r2 = 94;
            return (
              <line key={i}
                x1={100 + r1 * Math.sin(a)} y1={100 - r1 * Math.cos(a)}
                x2={100 + r2 * Math.sin(a)} y2={100 - r2 * Math.cos(a)}
                stroke={major ? accent : '#555'} strokeWidth={major ? 2 : 1} />
            );
          })}
          {[0, 6, 12, 18].map(h => {
            const a = (h / 24) * 2 * Math.PI;
            return (
              <text key={h} x={100 + 74 * Math.sin(a)} y={100 - 74 * Math.cos(a) + 3}
                textAnchor="middle" fontSize="9" fill="#aaa" fontFamily="sans-serif">
                {pad(h)}
              </text>
            );
          })}
          {/* countdown arc: remaining fraction to sunset */}
          <circle cx="100" cy="100" r="97" fill="none" stroke="#222" strokeWidth="2" />
          <circle cx="100" cy="100" r="97" fill="none" stroke={accent} strokeWidth="2"
            strokeDasharray={`${(1 - cd.totalSeconds / 86400) * 609.5} 609.5`}
            transform="rotate(-90 100 100)" />
          {hand(hourFrac, 45, 4, '#fff')}
          {hand(minFrac, 62, 2.5, '#ddd')}
          {!ambient && hand(secFrac, 68, 1, accent)}
          <circle cx="100" cy="100" r="3" fill={accent} />
        </svg>
        <div className="absolute inset-x-0 top-[58%] flex flex-col items-center pointer-events-none" style={{ opacity: dim }}>
          <div className="font-semibold tabular-nums" dir="ltr" style={{ color: '#fff', fontSize: 'min(6vw, 26px)' }}>
            {pad(time.hours)}:{pad(time.minutes)}{!ambient && <span style={{ color: '#888' }}>:{pad(time.seconds)}</span>}
          </div>
          <div className="tabular-nums" dir="ltr" style={{ color: accent, fontSize: 'min(3vw, 12px)' }}>
            ↓ {pad(cd.hours)}:{pad(cd.minutes)}{!ambient && `:${pad(cd.seconds)}`}
          </div>
          <div style={{ color: '#777', fontSize: 'min(2.6vw, 10px)' }}>
            {location.city?.nameAr || location.city?.name || ''}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3" style={{ color: '#999' }}>
        <Link to="/" className="p-2 rounded-full" style={{ background: '#111' }} aria-label="Back"><ArrowLeft className="w-5 h-5" /></Link>
        <button className="p-2 rounded-full" style={{ background: '#111', color: ambient ? accent : undefined }} onClick={() => setAmbient(a => !a)} aria-label="Ambient"><Moon className="w-5 h-5" /></button>
        <button className="p-2 rounded-full" style={{ background: '#111' }} onClick={() => document.documentElement.requestFullscreen?.()} aria-label="Fullscreen"><Maximize className="w-5 h-5" /></button>
      </div>
    </div>
  );
}
