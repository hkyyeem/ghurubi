import { motion } from 'framer-motion';
import { MapPin, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { useReverseGeocoding } from '@/hooks/useGeocoding';
import { Button } from '@/components/ui/button';
import type { Location } from '@/hooks/useNaturalTime';

interface LocationDisplayProps {
  location: Location;
  loading?: boolean;
  error?: string | null;
  isUsingDefault?: boolean;
  onRetryLocation?: () => void;
  className?: string;
}

export function LocationDisplay({ 
  location,
  loading = false,
  error = null,
  isUsingDefault = false,
  onRetryLocation,
  className = '' 
}: LocationDisplayProps) {
  const { city, country, loading: geocodingLoading } = useReverseGeocoding(
    location.latitude, 
    location.longitude
  );
  
  const isLoading = loading || geocodingLoading;
  
  // Prefer city info from location object (city-level coordinates)
  const displayCity = location.city?.nameAr || city;
  const displayCountry = location.city?.countryAr || country;
  
  return (
    <motion.div 
      className={`flex flex-col items-center gap-2 text-sm text-muted-foreground font-body ${className}`}
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
            {displayCity ? (
              <span className="text-foreground font-semibold">
                {displayCity}{displayCountry ? ` - ${displayCountry}` : ''}
              </span>
            ) : (
              <span className="text-destructive">{error || 'تعذر تحديد الموقع'}</span>
            )}
          </div>
          
          {/* Coordinates */}
          <span className="text-xs text-muted-foreground" dir="ltr">
            {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°E
          </span>
          
          {/* City-level indicator */}
          {location.city && !isUsingDefault && (
            <span className="text-xs text-muted-foreground/60">
              (إحداثيات مركز المدينة)
            </span>
          )}
          
          {/* Show warning and retry button when using default location */}
          {isUsingDefault && (
            <motion.div 
              className="flex flex-col items-center gap-2 mt-2 p-3 rounded-lg bg-secondary/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 text-amber-500">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs">يُستخدم موقع افتراضي (مكة المكرمة)</span>
              </div>
              {onRetryLocation && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRetryLocation}
                  className="gap-2"
                >
                  <RefreshCw className="w-3 h-3" />
                  تحديد موقعي الفعلي
                </Button>
              )}
            </motion.div>
          )}
          
          {error && !isUsingDefault && (
            <div className="flex items-center gap-2 text-destructive text-xs">
              <AlertCircle className="w-3 h-3" />
              <span>{error}</span>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
