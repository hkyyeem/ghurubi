import { motion } from 'framer-motion';
import { MapPin, Loader2 } from 'lucide-react';
import { useReverseGeocoding } from '@/hooks/useGeocoding';

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
  const { city, country, loading: geocodingLoading } = useReverseGeocoding(latitude, longitude);
  
  const isLoading = loading || geocodingLoading;
  
  return (
    <motion.div 
      className={`flex flex-col items-center gap-1 text-sm text-muted-foreground font-body ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>جاري تحديد الموقع...</span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            {city ? (
              <span className="text-foreground font-semibold">
                {city}{country ? ` - ${country}` : ''}
              </span>
            ) : latitude && longitude ? (
              <span>موقع مخصص</span>
            ) : (
              <span className="text-destructive">{error || 'تعذر تحديد الموقع'}</span>
            )}
          </div>
          {latitude && longitude && (
            <span className="text-xs text-muted-foreground">
              {latitude.toFixed(4)}° شمال، {longitude.toFixed(4)}° شرق
            </span>
          )}
        </>
      )}
    </motion.div>
  );
}
