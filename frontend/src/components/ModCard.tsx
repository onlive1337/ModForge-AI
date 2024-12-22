import React from 'react';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import type { ModItem } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { Card } from './ui/card';

interface ModCardProps {
  item: ModItem & {
    dependencies?: Array<{ name: string; slug?: string; required: boolean }>;
  };
}

export const ModCard: React.FC<ModCardProps> = ({ item }) => {
  const { t } = useTranslation();
  
  const requiredDeps = item.dependencies?.filter(dep => dep.required) || [];
  const optionalDeps = item.dependencies?.filter(dep => !dep.required) || [];

  return (
    <Card className="p-4 hover:border-primary/20 transition-colors">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-foreground">{item.name}</h3>
          <p className="text-sm text-muted-foreground">{t.by} {item.author}</p>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
            {item.description}
          </p>
          
          {requiredDeps.length > 0 && (
            <div className="mt-3 p-2 bg-muted/50 rounded-md">
              <p className="text-sm font-medium mb-1 text-foreground">
                {t.requiredMods}:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {requiredDeps.map((dep, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center text-xs px-2 py-1 bg-background rounded-full text-foreground group"
                  >
                    {dep.slug ? (
                      <Button
                        variant="link"
                        className="p-0 h-auto text-xs text-primary hover:text-primary/80 transition-colors"
                        onClick={() => window.open(`https://modrinth.com/mod/${dep.slug}`, '_blank')}
                      >
                        {dep.name}
                      </Button>
                    ) : (
                      dep.name
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {optionalDeps.length > 0 && (
            <div className="mt-2 p-2 bg-muted/30 rounded-md">
              <p className="text-sm font-medium mb-1 text-muted-foreground">
                Опциональные моды:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {optionalDeps.map((dep, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center text-xs px-2 py-1 bg-background/50 rounded-full text-muted-foreground"
                  >
                    {dep.slug ? (
                      <Button
                        variant="link"
                        className="p-0 h-auto text-xs text-primary/80 hover:text-primary transition-colors"
                        onClick={() => window.open(`https://modrinth.com/mod/${dep.slug}`, '_blank')}
                      >
                        {dep.name}
                      </Button>
                    ) : (
                      dep.name
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {item.downloads.toLocaleString()} {t.downloads}
          </span>
          <Button
            onClick={() => window.open(`https://modrinth.com/mod/${item.slug}`, '_blank')}
            variant="secondary"
            size="sm"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">{t.download}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};