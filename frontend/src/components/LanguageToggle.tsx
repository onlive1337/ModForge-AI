import { useTranslation } from '../hooks/useTranslation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="fixed top-2 right-14 sm:right-16 sm:top-4 sm:right-20 p-1 z-50">
      <div className="relative flex bg-card/50 border border-border rounded-full overflow-hidden scale-90 sm:scale-100">
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
            "relative z-10 px-2 sm:px-4 py-1 sm:py-1.5 transition-colors text-xs sm:text-sm font-medium w-[40px] sm:w-[50px]",
            language === 'ru' 
              ? "text-primary-foreground" 
              : "text-foreground/70 hover:text-foreground"
          )}
        >
          RU
        </button>

        <button
          onClick={() => setLanguage('en')}
          className={cn(
            "relative z-10 px-2 sm:px-4 py-1 sm:py-1.5 transition-colors text-xs sm:text-sm font-medium w-[40px] sm:w-[50px]",
            language === 'en' 
              ? "text-primary-foreground" 
              : "text-foreground/70 hover:text-foreground"
          )}
        >
          EN
        </button>
      </div>
    </div>
  );
}