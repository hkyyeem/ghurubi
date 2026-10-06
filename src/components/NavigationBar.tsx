import { useState, useRef, useEffect } from 'react';
import { Search, X, Settings, Watch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MAJOR_CITIES, type CityInfo } from '@/lib/cityCoordinates';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';
import { LangMenu } from './LangMenu';
import { CitySearch } from './CitySearch';

interface NavigationBarProps {
  onCitySelect: (city: CityInfo) => void;
  currentCity?: CityInfo;
  isNight?: boolean;
  showSeasonalHours: boolean;
  onToggleSeasonalHours: (value: boolean) => void;
  showPrayerTimes: boolean;
  onTogglePrayerTimes: (value: boolean) => void;
}

export function NavigationBar({
  onCitySelect,
  currentCity,
  isNight = true,
  showSeasonalHours,
  onToggleSeasonalHours,
  showPrayerTimes,
  onTogglePrayerTimes,
}: NavigationBarProps) {
  const { lang, setLang, t } = useI18n();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Filter cities based on search query
  const filteredCities = MAJOR_CITIES.filter(city => {
    const query = searchQuery.toLowerCase();
    return (
      city.name.toLowerCase().includes(query) ||
      city.nameAr.includes(searchQuery) ||
      city.country.toLowerCase().includes(query) ||
      city.countryAr.includes(searchQuery)
    );
  }).slice(0, 10);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCitySelect = (city: CityInfo) => {
    onCitySelect(city);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container-narrow">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isNight ? 'bg-blue-400' : 'bg-amber-400'}`} />
            <span className="font-semibold text-lg tracking-tight">
              Ghurubi
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {t.tagline}
            </span>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            <LangMenu />
            <Link
              to="/watch"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              aria-label="Watch mode"
            >
              <Watch className="w-5 h-5" />
            </Link>
            {/* Settings Dropdown */}
            <div ref={settingsRef} className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isSettingsOpen 
                    ? "bg-secondary text-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              {isSettingsOpen && (
                <div className="absolute end-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                  <div className="p-4 space-y-4">
                    <h3 className="font-medium text-sm text-foreground">{t.settings}</h3>
                    
                    {/* Seasonal Hours Toggle */}
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="text-sm text-foreground">{t.seasonal}</span>
                        <p className="text-xs text-muted-foreground">{t.seasonalSub}</p>
                      </div>
                      <button
                        onClick={() => onToggleSeasonalHours(!showSeasonalHours)}
                        className={cn(
                          "w-11 h-6 rounded-full transition-colors relative",
                          showSeasonalHours ? "bg-accent" : "bg-secondary"
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                            showSeasonalHours ? "translate-x-6" : "translate-x-1"
                          )}
                        />
                      </button>
                    </label>

                    {/* Prayer Times Toggle */}
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="text-sm text-foreground">{t.prayer}</span>
                        <p className="text-xs text-muted-foreground">{t.prayerSub}</p>
                      </div>
                      <button
                        onClick={() => onTogglePrayerTimes(!showPrayerTimes)}
                        className={cn(
                          "w-11 h-6 rounded-full transition-colors relative",
                          showPrayerTimes ? "bg-accent" : "bg-secondary"
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                            showPrayerTimes ? "translate-x-6" : "translate-x-1"
                          )}
                        />
                      </button>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <CitySearch onSelect={onCitySelect} currentCity={currentCity} />
          </div>
        </div>
      </div>
    </header>
  );
}
