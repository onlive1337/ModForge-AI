import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { 
  Github, 
  Tag, 
  History,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const VERSION = '1.1.0';
const GITHUB_URL = 'https://github.com/onlive1337/ModForge-AI';

interface VersionInfoProps {}

const VersionInfo: React.FC<VersionInfoProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs relative group"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Tag className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
          v{VERSION}
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-1"
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
              className="bg-card dark:bg-[#1A1D2A] rounded-lg border shadow-lg p-4 w-[280px]"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-sm">ModForge AI</h3>
                    <p className="text-xs text-muted-foreground">v{VERSION}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => window.open(GITHUB_URL, '_blank')}
                  >
                    <Github className="w-4 h-4 mr-1.5" />
                    GitHub
                    <ExternalLink className="w-3 h-3 ml-1.5 opacity-50" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => window.open(`${GITHUB_URL}/releases`, '_blank')}
                  >
                    <Tag className="w-4 h-4 mr-1.5" />
                    {t.version.releases}
                    <ExternalLink className="w-3 h-3 ml-1.5 opacity-50" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => window.open(`${GITHUB_URL}/blob/main/CHANGELOG.md`, '_blank')}
                  >
                    <History className="w-4 h-4 mr-1.5" />
                    {t.version.changelog}
                    <ExternalLink className="w-3 h-3 ml-1.5 opacity-50" />
                  </Button>
                </div>

                <div className="border-t pt-2">
                  <p className="text-[10px] text-muted-foreground">
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