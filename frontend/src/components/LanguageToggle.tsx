import { useTranslation } from '../hooks/useTranslation';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="fixed top-2 sm:top-4 right-14 sm:right-28 z-50">
      <div className="relative flex bg-card/50 border border-border rounded-full overflow-hidden">
        <motion.div
          className="absolute bg-primary rounded-full inset-0"
          initial={false}
          animate={{
            x: language === 'ru' ? '0%' : '100%',
            width: '50%',
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
        
        <button
          onClick={() => setLanguage('ru')}
          className={cn(
            "relative z-10 px-3 py-1.5 text-sm font-medium w-12",
            language === 'ru' 
              ? "text-primary-foreground" 
              : "text-foreground/70 hover:text-foreground"
          )}
          aria-label="Switch language to Russian"
          aria-pressed={language === 'ru'}
        >
          RU
        </button>

        <button
          onClick={() => setLanguage('en')}
          className={cn(
            "relative z-10 px-3 py-1.5 text-sm font-medium w-12",
            language === 'en' 
              ? "text-primary-foreground" 
              : "text-foreground/70 hover:text-foreground"
          )}
          aria-label="Switch language to English"
          aria-pressed={language === 'en'}
        >
          EN
        </button>
      </div>
    </div>
  );
}