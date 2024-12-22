import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface LogEntry {
  id: number;
  message: string;
  status: 'pending' | 'success' | 'error';
  details?: string;
}

interface LoggerOverlayProps {
  isVisible: boolean;
  logs: LogEntry[];
}

export function LoggerOverlay({ isVisible, logs }: LoggerOverlayProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="bg-card border rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Generating Modpack
        </h3>
        
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <div className="flex items-start gap-3">
                  {log.status === 'pending' && (
                    <div className="w-5 h-5 mt-0.5">
                      <motion.div
                        className="w-2 h-2 bg-blue-500 rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [1, 0.5, 1],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                        }}
                      />
                    </div>
                  )}
                  {log.status === 'success' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </motion.div>
                  )}
                  {log.status === 'error' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center"
                    >
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                    </motion.div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium",
                      log.status === 'error' && "text-red-500",
                      log.status === 'success' && "text-green-500"
                    )}>
                      {log.message}
                    </p>
                    {log.details && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {log.details}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}