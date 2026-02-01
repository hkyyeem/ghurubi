import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { NaturalTime, SeasonalTime } from '@/hooks/useNaturalTime';

interface AnalogClockProps {
  time: NaturalTime | SeasonalTime | null;
  size?: number;
  showSeasonalMarkers?: boolean;
}

export function AnalogClock({ time, size = 320, showSeasonalMarkers = false }: AnalogClockProps) {
  const hourMarkers = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const radius = size / 2 - 30;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const number = i === 0 ? 12 : i;
      return { number, x, y, angle: i * 30 };
    });
  }, [size]);

  const minuteMarkers = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => {
      const angle = (i * 6 - 90) * (Math.PI / 180);
      const isHourMark = i % 5 === 0;
      const radius = size / 2 - (isHourMark ? 20 : 15);
      const innerRadius = size / 2 - 10;
      return {
        x1: Math.cos(angle) * radius,
        y1: Math.sin(angle) * radius,
        x2: Math.cos(angle) * innerRadius,
        y2: Math.sin(angle) * innerRadius,
        isHourMark,
      };
    });
  }, [size]);

  // Calculate hand rotations
  const hourRotation = time 
    ? ((time.hours % 12) * 30) + (time.minutes * 0.5) 
    : 0;
  const minuteRotation = time 
    ? (time.minutes * 6) + (time.seconds * 0.1) 
    : 0;
  const secondRotation = time 
    ? time.seconds * 6 
    : 0;

  const center = size / 2;

  return (
    <div 
      className="relative clock-shadow rounded-full"
      style={{ width: size, height: size }}
    >
      {/* Outer glow ring */}
      <div 
        className="absolute inset-0 rounded-full opacity-30"
        style={{
          background: `radial-gradient(circle at center, transparent 60%, hsl(var(--clock-ring) / 0.3) 100%)`,
        }}
      />
      
      {/* Clock face */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="relative z-10"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={center - 4}
          className="fill-clock-face stroke-clock-ring"
          strokeWidth="2"
        />
        
        {/* Inner decorative circle */}
        <circle
          cx={center}
          cy={center}
          r={center - 45}
          className="fill-none stroke-clock-ring"
          strokeWidth="0.5"
          opacity="0.3"
        />
        
        {/* Minute markers */}
        {minuteMarkers.map((marker, i) => (
          <line
            key={i}
            x1={center + marker.x1}
            y1={center + marker.y1}
            x2={center + marker.x2}
            y2={center + marker.y2}
            className={marker.isHourMark ? "stroke-clock-ring" : "stroke-clock-markers"}
            strokeWidth={marker.isHourMark ? 2 : 1}
            strokeLinecap="round"
            opacity={marker.isHourMark ? 1 : 0.5}
          />
        ))}
        
        {/* Hour numbers */}
        {hourMarkers.map(({ number, x, y }) => (
          <text
            key={number}
            x={center + x}
            y={center + y}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-clock-ring font-display text-lg"
            style={{ fontSize: size > 250 ? '1.25rem' : '1rem' }}
          >
            {number.toLocaleString('ar-EG')}
          </text>
        ))}
        
        {/* Sunset indicator at 12 */}
        <g transform={`translate(${center}, 25)`}>
          <motion.circle
            r="8"
            className="fill-sky-sunset"
            animate={{
              filter: ['drop-shadow(0 0 4px hsl(20 90% 50%))', 'drop-shadow(0 0 12px hsl(20 90% 50%))', 'drop-shadow(0 0 4px hsl(20 90% 50%))'],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle r="4" className="fill-sky-golden" />
        </g>
        
        {/* Hour hand */}
        <g
          style={{ 
            transform: `rotate(${hourRotation}deg)`,
            transformOrigin: `${center}px ${center}px`,
            transition: 'transform 0.5s ease-out',
          }}
        >
          <line
            x1={center}
            y1={center}
            x2={center}
            y2={center - size * 0.25}
            className="stroke-clock-hand-hour"
            strokeWidth={size > 250 ? 6 : 4}
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
          />
        </g>
        
        {/* Minute hand */}
        <g
          style={{ 
            transform: `rotate(${minuteRotation}deg)`,
            transformOrigin: `${center}px ${center}px`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <line
            x1={center}
            y1={center}
            x2={center}
            y2={center - size * 0.35}
            className="stroke-clock-hand-minute"
            strokeWidth={size > 250 ? 4 : 3}
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
          />
        </g>
        
        {/* Second hand */}
        <g
          style={{ 
            transform: `rotate(${secondRotation}deg)`,
            transformOrigin: `${center}px ${center}px`,
            transition: 'transform 0.1s linear',
          }}
        >
          <line
            x1={center}
            y1={center + 20}
            x2={center}
            y2={center - size * 0.4}
            className="stroke-sky-sunset"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx={center} cy={center + 20} r="4" className="fill-sky-sunset" />
        </g>
        
        {/* Center cap */}
        <circle
          cx={center}
          cy={center}
          r={size > 250 ? 10 : 8}
          className="fill-clock-center"
          filter="url(#centerGlow)"
        />
        <circle
          cx={center}
          cy={center}
          r={size > 250 ? 5 : 4}
          className="fill-sky-golden"
        />
        
        {/* Glow filter */}
        <defs>
          <filter id="centerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      
      {/* Glass overlay effect */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
        }}
      />
    </div>
  );
}
