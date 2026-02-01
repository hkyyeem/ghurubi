import { motion } from 'framer-motion';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationDisplayProps {
  latitude: number | null;
  longitude: number | null;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export function LocationDisplay({ 
  latitude, 
  longitude, 
  loading = false,
  error = null,
  className = '' 
}: LocationDisplayProps) {
  return (
    <motion.div 
      className={`flex items-center gap-2 text-sm text-muted-foreground font-body ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>جاري تحديد الموقع...</span>
        </>
      ) : (
        <>
          <MapPin className="w-4 h-4 text-primary" />
          {latitude && longitude ? (
            <span>
              {latitude.toFixed(2)}°, {longitude.toFixed(2)}°
            </span>
          ) : (
            <span className="text-destructive">{error || 'تعذر تحديد الموقع'}</span>
          )}
        </>
      )}
    </motion.div>
  );
}
