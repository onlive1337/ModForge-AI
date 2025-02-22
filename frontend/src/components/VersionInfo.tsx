import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { 
  Github, 
  Tag, 
  History,
  ChevronRight,
  Info
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const VERSION = '1.3.1';
const GITHUB_URL = 'https://github.com/onlive1337/ModForge-AI';

interface VersionInfoProps {}

const VersionInfo: React.FC<VersionInfoProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="fixed left-4 bottom-4 z-50">
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          className="text-xs relative group dark:bg-background"
          onClick={() => setIsOpen(!isOpen)}
          title={`ModForge AI v${VERSION}`}
        >
          <Tag className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
          <span className="inline">v{VERSION}</span>
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-1 inline"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.div>
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full left-0 mb-2 w-[180px] sm:w-[200px]
                       bg-background dark:bg-background rounded-lg border shadow-lg"
              style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}
            >
              <div className="p-3 space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center">
                    <Info className="w-3.5 h-3.5 mr-1.5" />
                    <div>
                      <h3 className="text-xs font-medium leading-none">ModForge AI</h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">v{VERSION}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-8 text-xs"
                    onClick={() => window.open(GITHUB_URL, '_blank')}
                    title="Open GitHub repository"
                  >
                    <Github className="w-3.5 h-3.5 mr-2" />
                    <span className="inline">GitHub</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-8 text-xs"
                    onClick={() => window.open(`${GITHUB_URL}/releases`, '_blank')}
                    title="View Release Notes"
                  >
                    <Tag className="w-3.5 h-3.5 mr-2" />
                    <span className="inline">{t.version.releases}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-8 text-xs"
                    onClick={() => window.open(`${GITHUB_URL}/blob/master/changelog.md`, '_blank')}
                    title="View Changelog"
                  >
                    <History className="w-3.5 h-3.5 mr-2" />
                    <span className="inline">{t.version.changelog}</span>
                  </Button>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-[8px] text-muted-foreground">
                    {t.version.copyright}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VersionInfo;