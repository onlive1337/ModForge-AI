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

const ITEMS_PER_PAGE = 9;

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  items,
  icon
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const uniqueItems = items.reduce((acc: ModItem[], current) => {
    const isDuplicate = acc.find(item => item.projectId === current.projectId);
    if (!isDuplicate) {
      acc.push(current);
    }
    return acc;
  }, []);

  const totalPages = Math.ceil(uniqueItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleItems = uniqueItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  return (
    <section className="border rounded-lg bg-card shadow-sm overflow-hidden theme-transition">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <span className="text-sm text-muted-foreground">({uniqueItems.length})</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
      
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-4 sm:p-6 grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map(item => (
            <ModCard key={`${item.projectId}-${item.slug}`} item={item} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 1}
              className="w-8 h-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="w-8 h-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};