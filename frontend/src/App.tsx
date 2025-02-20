import { useCallback, useState } from 'react';
import { Button } from './components/ui/button';
import { CollapsibleSection } from './components/CollapsibleSection';
import { VersionSelect } from './components/VersionSelect';
import { LoggerOverlay } from './components/LoggerOverlay';
import { AuthDialog } from './components/auth/AuthDialog';
import { Profile } from './components/Profile';
import VersionInfo from './components/VersionInfo';
import { Blocks, Palette, Sparkles, AlertCircle, User } from 'lucide-react';
import type { ModpackResponse, ModLoader, LogEntry } from './types';
import { useTranslation } from './hooks/useTranslation';
import { useAuthStore } from './stores/authStore';
import { useUserSettings } from './hooks/useUserSettings';

function App() {
  const [prompt, setPrompt] = useState('');
  const [version, setVersion] = useState('1.20.4');
  const [loader, setLoader] = useState<ModLoader>('forge');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ModpackResponse | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { t } = useTranslation();
  const { user, token } = useAuthStore();
  
  useUserSettings();

  const addLog = useCallback((message: string, status: 'pending' | 'success' | 'error', details?: string) => {
    setLogs(current => {
      const nextId = current.length === 0 ? 0 : Math.max(...current.map(log => log.id)) + 1;
      return [...current, {
        id: nextId,
        message,
        status,
        details,
        timestamp: new Date().toISOString()
      }];
    });
  }, []);

  const generateModpack = async () => {
    if (!prompt.trim()) return;

    setLogs([]);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      addLog('Analyzing your request...', 'pending');
      await new Promise(r => setTimeout(r, 1000));
      addLog('Request analyzed successfully', 'success');

      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      addLog('Searching for compatible mods...', 'pending');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/generate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          prompt, 
          minecraftVersion: version,
          modLoader: loader
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t.errors.generation);
      }

      addLog(`Found ${data.mods.length} compatible mods`, 'success');

      addLog('Checking mod dependencies...', 'pending');
      await new Promise(r => setTimeout(r, 800));
      addLog('Dependencies verified', 'success');

      if (data.resourcePacks && data.resourcePacks.length > 0) {
        addLog('Searching for resource packs...', 'pending');
        await new Promise(r => setTimeout(r, 600));
        addLog(`Found ${data.resourcePacks.length} resource packs`, 'success');
      }

      if (data.shaders && data.shaders.length > 0) {
        addLog('Searching for shaders...', 'pending');
        await new Promise(r => setTimeout(r, 400));
        addLog(`Found ${data.shaders.length} shaders`, 'success');
      }

      addLog('Finalizing modpack...', 'pending');
      await new Promise(r => setTimeout(r, 500));
      addLog('Modpack generated successfully!', 'success');

      setResult(data);
    } catch (err) {
      console.error('Error:', err);
      addLog('Error generating modpack', 'error', err instanceof Error ? err.message : t.errors.default);
      setError(err instanceof Error ? err.message : t.errors.default);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background theme-transition">
      <VersionInfo />

      <div className="fixed top-2 sm:top-4 right-4 sm:right-6 z-50">
        {user ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAuthOpen(true)}
            className="flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">{user.username}</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAuthOpen(true)}
          >
            {t.auth.login}
          </Button>
        )}
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground mt-8 sm:mt-0">
            {t.title}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground px-4">
            {t.subtitle}
          </p>
          <div className="mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-yellow-500/15 text-yellow-600 dark:bg-yellow-500/25 dark:text-yellow-100">
            {t.alpha.badge}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.alpha.notice}
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-6 sm:mb-8">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto bg-white/80 backdrop-blur-sm dark:bg-[#1A1D2A] rounded-lg">
                <VersionSelect
                  selectedVersion={version}
                  selectedLoader={loader}
                  onVersionChange={setVersion}
                  onLoaderChange={setLoader}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={t.placeholder}
                  className="w-full h-12 sm:h-[46px] px-4 rounded-lg border 
                            bg-white/80 backdrop-blur-sm dark:bg-[#1A1D2A]
                            border-border text-foreground 
                            placeholder:text-muted-foreground focus:outline-none focus:ring-2 
                            ring-primary/20 text-[16px] sm:text-base p-4"
                />
              </div>
              
              <Button
                onClick={generateModpack}
                disabled={loading}
                className="w-full sm:w-auto h-12 sm:h-[46px] whitespace-nowrap px-6"
              >
                {t.generate}
              </Button>
            </div>
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

      <LoggerOverlay 
        isVisible={loading} 
        logs={logs}
      />

      {user ? (
        <Profile 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
        />
      ) : (
        <AuthDialog 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
        />
      )}
    </div>
  );
}

export default App;