import React, { useState } from 'react';
import { ModCard } from './ModCard';
import { cn } from '../lib/utils';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ModItem } from '../types';
import { Button } from './ui/button';

interface CollapsibleSectionProps {
  title: string;
  items: ModItem[];
  icon?: React.ReactNode;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  items,
  icon
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / 9);
  const startIndex = (currentPage - 1) * 9;
  const visibleItems = items.slice(startIndex, startIndex + 9);

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  return (
    <section 
      className="border rounded-lg bg-card shadow-sm overflow-hidden"
      aria-labelledby={`section-title-${title}`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
        aria-expanded={isExpanded}
        aria-controls={`section-content-${title}`}
      >
        <div className="flex items-center gap-2">
          {icon && <span aria-hidden="true">{icon}</span>}
          <h2 id={`section-title-${title}`} className="text-xl font-semibold text-foreground">
            {title}
          </h2>
          <span className="text-sm text-muted-foreground">({items.length})</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
        )}
      </button>
      
      <div
        id={`section-content-${title}`}
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
        role="region"
        aria-labelledby={`section-title-${title}`}
      >
        <div className="p-4 sm:p-6 grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map(item => (
            <ModCard key={`${item.projectId}-${item.type}`} item={item} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pb-6" role="navigation">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 1}
              className="w-8 h-8 p-0"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <span className="text-sm text-muted-foreground">
              <span className="sr-only">Page</span> {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="w-8 h-8 p-0"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};