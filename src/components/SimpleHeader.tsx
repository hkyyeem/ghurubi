import { Link, useNavigate } from 'react-router-dom';
import { Watch } from 'lucide-react';
import { citySlug } from '@/lib/cityCoordinates';
import { LangMenu } from './LangMenu';
import { CitySearch } from './CitySearch';

export function SimpleHeader() {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container-narrow h-14 md:h-16 flex items-center justify-between gap-2">
        <Link to="/" className="font-semibold text-lg tracking-tight">Ghurubi</Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <LangMenu />
          <Link to="/watch" aria-label="Watch mode"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
            <Watch className="w-5 h-5" />
          </Link>
          <CitySearch onSelect={c => navigate(`/city/${citySlug(c)}`)} />
        </div>
      </div>
    </header>
  );
}
