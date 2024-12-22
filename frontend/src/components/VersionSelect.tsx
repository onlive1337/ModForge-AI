import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { cn } from '../lib/utils';
import type { ModLoader } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface VersionSelectProps {
  selectedVersion: string;
  selectedLoader: ModLoader;
  onVersionChange: (version: string) => void;
  onLoaderChange: (loader: ModLoader) => void;
}

const versions: { version: string; loaders: ModLoader[] }[] = [
  { version: '1.20.4', loaders: ['forge', 'fabric', 'quilt', 'neoforge'] },
  { version: '1.20.2', loaders: ['forge', 'fabric', 'quilt', 'neoforge'] },
  { version: '1.20.1', loaders: ['forge', 'fabric', 'quilt'] },
  { version: '1.19.4', loaders: ['forge', 'fabric', 'quilt'] },
  { version: '1.19.2', loaders: ['forge', 'fabric', 'quilt'] },
  { version: '1.18.2', loaders: ['forge', 'fabric', 'quilt'] },
  { version: '1.17.1', loaders: ['forge', 'fabric'] },
  { version: '1.16.5', loaders: ['forge', 'fabric'] },
  { version: '1.15.2', loaders: ['forge', 'fabric'] },
  { version: '1.14.4', loaders: ['forge', 'fabric'] },
  { version: '1.12.2', loaders: ['forge'] },
  { version: '1.8.9', loaders: ['forge'] },
  { version: '1.7.10', loaders: ['forge'] },
];

const loaderIcons: Record<ModLoader, string> = {
  forge: '⚒️',
  fabric: '🧵',
  quilt: '🧶',
  neoforge: '⚡'
};

const loaderNames: Record<ModLoader, string> = {
  forge: 'Forge',
  fabric: 'Fabric',
  quilt: 'Quilt',
  neoforge: 'NeoForge'
};

export function VersionSelect({ 
  selectedVersion, 
  selectedLoader,
  onVersionChange,
  onLoaderChange
}: VersionSelectProps) {
  const [versionOpen, setVersionOpen] = React.useState(false);
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const { t } = useTranslation();

  const availableLoaders = versions.find(v => v.version === selectedVersion)?.loaders || [];

  const filteredVersions = React.useMemo(() => {
    if (!search) return versions;
    return versions.filter(v => 
      v.version.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <Popover open={versionOpen} onOpenChange={setVersionOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={versionOpen}
            className="w-full sm:w-[220px] justify-between h-12 sm:h-[46px]"
          >
            {selectedVersion}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-full sm:w-[220px] p-0" 
          align="start"
          side="bottom"
        >
          <div className="bg-card dark:bg-[#1A1D2A] rounded-md border border-border">
            <div className="flex items-center border-b border-border px-3">
              <search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                className="flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={t.version.search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="max-h-[300px] overflow-auto no-scrollbar">
              {filteredVersions.length === 0 ? (
                <div className="py-6 text-center text-sm">{t.version.notFound}</div>
              ) : (
                <div className="flex flex-col">
                  {filteredVersions.map((option) => (
                    <button
                      key={option.version}
                      className={cn(
                        "relative flex w-full items-center px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors",
                        selectedVersion === option.version && "bg-accent text-accent-foreground"
                      )}
                      onClick={() => {
                        onVersionChange(option.version);
                        if (!option.loaders.includes(selectedLoader)) {
                          onLoaderChange(option.loaders[0]);
                        }
                        setVersionOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedVersion === option.version ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.version}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover open={loaderOpen} onOpenChange={setLoaderOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={loaderOpen}
            className="w-[140px] justify-between"
          >
            <span className="flex items-center">
              {loaderIcons[selectedLoader]} <span className="ml-2">{loaderNames[selectedLoader]}</span>
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[140px] p-0" 
          align="start"
          side="bottom"
        >
          <div className="bg-card dark:bg-[#1A1D2A] rounded-md border border-border">
            <div className="flex flex-col">
              {availableLoaders.map((loader) => (
                <button
                  key={loader}
                  className={cn(
                    "relative flex w-full items-center px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors",
                    selectedLoader === loader && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => {
                    onLoaderChange(loader);
                    setLoaderOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedLoader === loader ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="flex items-center">
                    {loaderIcons[loader]} <span className="ml-2">{loaderNames[loader]}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}