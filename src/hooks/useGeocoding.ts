import { useState, useEffect } from 'react';

interface GeocodingResult {
  city: string | null;
  country: string | null;
  loading: boolean;
  error: string | null;
}

export function useReverseGeocoding(latitude: number | null, longitude: number | null): GeocodingResult {
  const [city, setCity] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (latitude === null || longitude === null) return;

    const fetchCityName = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Using OpenStreetMap Nominatim API (free, no API key needed)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ar`,
          {
            headers: {
              'User-Agent': 'EarthClock/1.0',
            },
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }
        
        const data = await response.json();
        
        // Extract city name - try different fields
        const cityName = 
          data.address?.city || 
          data.address?.town || 
          data.address?.village ||
          data.address?.municipality ||
          data.address?.state ||
          data.address?.county ||
          null;
          
        const countryName = data.address?.country || null;
        
        setCity(cityName);
        setCountry(countryName);
      } catch (err) {
        console.error('Geocoding error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCityName();
  }, [latitude, longitude]);

  return { city, country, loading, error };
}
