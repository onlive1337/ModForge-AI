import { useState } from 'react';
import { Button } from './components/ui/button';
import { CollapsibleSection } from './components/CollapsibleSection';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageToggle } from './components/LanguageToggle';
import { Loader2, Blocks, Palette, Sparkles, AlertCircle } from 'lucide-react';
import type { ModpackResponse } from './types';
import { useTranslation } from './hooks/useTranslation';

function App() {
  const [prompt, setPrompt] = useState('');
  const [version, setVersion] = useState('1.20.1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ModpackResponse | null>(null);
  const { t } = useTranslation();

  const mcVersions = [
    { value: '1.20.1', label: t.versions['1.20.1'] },
    { value: '1.19.4', label: t.versions['1.19.4'] },
    { value: '1.18.2', label: t.versions['1.18.2'] },
    { value: '1.16.5', label: t.versions['1.16.5'] },
  ];

  const generateModpack = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt, 
          minecraftVersion: version 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t.errors.generation);
      }

      setResult(data);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : t.errors.default);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background theme-transition">
      <ThemeToggle />
      <LanguageToggle />
      
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground">{t.title}</h1>
          <p className="text-base sm:text-lg text-muted-foreground px-4">
            {t.subtitle}
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-3">
            <div className="relative w-full sm:w-auto">
              <select
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full sm:w-[180px] h-12 sm:h-[46px] px-4 rounded-lg border dark:bg-[#1A1D2A] bg-card 
                          border-border text-foreground focus:outline-none focus:ring-2 ring-primary/20
                          appearance-none cursor-pointer text-base font-medium"
                style={{
                  paddingRight: '2.5rem'
                }}
              >
                {mcVersions.map((v) => (
                  <option key={v.value} value={v.value} className="py-2">
                    {v.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-foreground/60">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
            
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1 h-12 sm:h-[46px] px-4 rounded-lg border dark:bg-[#1A1D2A] bg-card
              border-border text-foreground placeholder:text-muted-foreground focus:outline-none
              focus:ring-2 ring-primary/20 text-[16px] sm:text-base p-4 min-h-[50px] sm:min-h-[46px]" 
            />
            
            <Button
              onClick={generateModpack}
              disabled={loading}
              className="h-12 sm:h-[46px] sm:w-auto whitespace-nowrap px-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.generating}
                </>
              ) : (
                t.generate
              )}
            </Button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg text-sm sm:text-base">
              {error}
            </div>
          )}
        </div>

        {result && (
          <>
            {result.notFound && result.notFound.length > 0 && (
              <div className="max-w-3xl mx-auto mb-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        {t.notFoundTitle}
                      </h3>
                      <div className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                        {result.notFound.map((type) => (
                          <p key={type}>
                            {type === 'mods' && t.modNotFound}
                            {type === 'resourcepacks' && t.resourcePacksNotFound}
                            {type === 'shaders' && t.shadersNotFound}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 sm:space-y-6">
              {result.mods.length > 0 && (
                <CollapsibleSection
                  title={t.mods}
                  items={result.mods}
                  icon={<Blocks className="w-6 h-6 text-blue-400" />}
                />
              )}

              {result.resourcePacks && result.resourcePacks.length > 0 && (
                <CollapsibleSection
                  title={t.resourcePacks}
                  items={result.resourcePacks}
                  icon={<Palette className="w-6 h-6 text-green-400" />}
                />
              )}

              {result.shaders && result.shaders.length > 0 && (
                <CollapsibleSection
                  title={t.shaders}
                  items={result.shaders}
                  icon={<Sparkles className="w-6 h-6 text-purple-400" />}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;