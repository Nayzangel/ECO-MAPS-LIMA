import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Building2, Compass, Navigation, X, Loader2 } from 'lucide-react';
import { GeoSearchResult } from '../../types/gis';
import { LIMA_GEO_SEARCH_INDEX } from '../../data/gisData';

interface MapSearchBarProps {
  onSelectLocation: (coordinates: [number, number], zoom?: number, title?: string) => void;
  className?: string;
}

export const MapSearchBar: React.FC<MapSearchBarProps> = ({
  onSelectLocation,
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<GeoSearchResult[]>([]);
  const [isLoadingExternal, setIsLoadingExternal] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter local & remote results
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const q = query.toLowerCase().trim();
    const localMatches = LIMA_GEO_SEARCH_INDEX.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q)
    );

    setResults(localMatches);
    setIsOpen(true);

    // If local matches are few and query is long enough, try Nominatim OSM in background
    let timer: NodeJS.Timeout;
    if (localMatches.length < 3 && query.length >= 4) {
      setIsLoadingExternal(true);
      timer = setTimeout(async () => {
        try {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              query + ', Lima, Peru'
            )}&limit=4&addressdetails=1`
          );
          if (resp.ok) {
            const data = await resp.json();
            const externalResults: GeoSearchResult[] = data.map((item: any, idx: number) => ({
              id: `osm-${idx}-${item.place_id}`,
              title: item.name || item.display_name.split(',')[0],
              subtitle: item.display_name.split(',').slice(1, 3).join(','),
              type: 'lugar' as const,
              coordinates: [parseFloat(item.lat), parseFloat(item.lon)],
              zoom: 15
            }));

            // Merge avoiding duplicates
            setResults(prev => {
              const ids = new Set(prev.map(p => p.title.toLowerCase()));
              const filtered = externalResults.filter(
                e => !ids.has(e.title.toLowerCase())
              );
              return [...prev, ...filtered];
            });
          }
        } catch {
          // silently keep local results
        } finally {
          setIsLoadingExternal(false);
        }
      }, 450);
    } else {
      setIsLoadingExternal(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [query]);

  const handleSelect = (item: GeoSearchResult) => {
    setQuery(item.title);
    setIsOpen(false);
    onSelectLocation(item.coordinates, item.zoom || 14, item.title);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'distrito':
        return <Building2 className="w-4 h-4 text-emerald-400" />;
      case 'calle':
        return <Navigation className="w-4 h-4 text-cyan-400" />;
      case 'fuente':
        return <Compass className="w-4 h-4 text-amber-400" />;
      default:
        return <MapPin className="w-4 h-4 text-teal-400" />;
    }
  };

  return (
    <div ref={wrapperRef} className={`relative z-30 ${className}`}>
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-slate-400 pointer-events-none">
          {isLoadingExternal ? (
            <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-slate-400" />
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          placeholder="Buscar distritos, avenidas o lugares en Lima (ej. Abancay, SJL, Miraflores)..."
          className="w-full pl-10 pr-10 py-2.5 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 shadow-xl"
        />

        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 max-h-72 overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl z-50 divide-y divide-slate-800">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Resultados de Búsqueda ({results.length})</span>
            <span className="text-emerald-400 font-mono">Lima Metropolitana</span>
          </div>

          {results.map(item => (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              className="w-full px-3.5 py-2.5 text-left flex items-start gap-3 hover:bg-slate-800/80 transition-colors group cursor-pointer"
            >
              <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-slate-700 mt-0.5 flex-shrink-0">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white group-hover:text-emerald-300 truncate">
                    {item.title}
                  </span>
                  <span className="text-[10px] uppercase font-mono text-slate-400 bg-slate-800/60 px-1.5 py-0.5 rounded">
                    {item.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
