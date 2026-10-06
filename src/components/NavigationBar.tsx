import { useState, useRef, useEffect } from 'react';
import { Search, X, Settings, Watch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MAJOR_CITIES, type CityInfo } from '@/lib/cityCoordinates';
import { cn } from '@/lib/utils';
import { useI18n, LANGS, LANG_LABEL, cityName, countryName } from '@/lib/i18n';

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
          <div className="flex items-center gap-2">
            <div className="flex items-center text-xs" role="group" aria-label="Language">
              {LANGS.map(l => (
                <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}
                  className={cn("px-1.5 py-1 rounded transition-colors", lang === l ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground")}>
                  {LANG_LABEL[l]}
                </button>
              ))}
            </div>
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

            {/* Search */}
            <div ref={searchContainerRef} className="relative">
              {!isSearchOpen ? (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span className="text-sm hidden sm:inline">{t.search}</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.searchCity}
                      className="search-input w-48 sm:w-64 pl-9 pr-8"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="p-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Search Results Dropdown */}
              {isSearchOpen && searchQuery && filteredCities.length > 0 && (
                <div className="absolute end-0 top-full mt-2 w-72 bg-card border border-border rounded-lg shadow-lg overflow-hidden max-h-80 overflow-y-auto">
                  {filteredCities.map((city) => (
                    <button
                      key={`${city.name}-${city.country}`}
                      onClick={() => handleCitySelect(city)}
                      className={cn(
                        "w-full text-start px-4 py-3 hover:bg-secondary transition-colors border-b border-border last:border-b-0",
                        currentCity?.name === city.name && "bg-secondary/50"
                      )}
                    >
                      <div className="font-medium text-foreground">{cityName(city, lang)}</div>
                      <div className="text-sm text-muted-foreground">
                        {countryName(city, lang)}{lang !== 'ar' ? ` • ${city.nameAr}` : ` • ${city.name}`}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {isSearchOpen && searchQuery && filteredCities.length === 0 && (
                <div className="absolute end-0 top-full mt-2 w-72 bg-card border border-border rounded-lg shadow-lg p-4">
                  <p className="text-sm text-muted-foreground text-center">
                    No cities found for "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
