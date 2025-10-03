import { RefObject } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface SearchBarProps {
  searchQuery: string;
  isSearching: boolean;
  searchHistory: string[];
  suggestions: string[];
  showSuggestions: boolean;
  showHistory: boolean;
  autoComplete: boolean;
  accentColor: string;
  searchInputRef: RefObject<HTMLInputElement>;
  onSearchSubmit: (e: React.FormEvent) => void;
  onSearchInputChange: (value: string) => void;
  onSuggestionClick: (suggestion: string) => void;
  onClearSearch: () => void;
  onHistoryClick: (item: string) => void;
  onFocus: () => void;
  onBlur: () => void;
}

const SearchBar = ({
  searchQuery,
  isSearching,
  searchHistory,
  suggestions,
  showSuggestions,
  showHistory,
  autoComplete,
  accentColor,
  searchInputRef,
  onSearchSubmit,
  onSearchInputChange,
  onSuggestionClick,
  onClearSearch,
  onHistoryClick,
  onFocus,
  onBlur,
}: SearchBarProps) => {
  return (
    <Card className="p-6 mb-8 shadow-lg border-primary/20">
      <form onSubmit={onSearchSubmit} className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Icon
              name="Search"
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10"
            />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Введите запрос для поиска..."
              value={searchQuery}
              onChange={(e) => onSearchInputChange(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              className="pl-10 pr-10 h-12 text-base"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={onClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="X" size={18} />
              </button>
            )}
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-lg shadow-xl z-50 overflow-hidden">
                <div className="p-2">
                  <p className="text-xs text-muted-foreground px-3 py-1 flex items-center gap-2">
                    <Icon name="History" size={14} />
                    История поиска
                  </p>
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 hover:bg-accent rounded-md transition-colors flex items-center gap-2 group"
                    >
                      <Icon name="Clock" size={16} className="text-muted-foreground" />
                      <span className="flex-1">{suggestion}</span>
                      <Icon name="ArrowUpLeft" size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Button 
            type="submit" 
            size="lg" 
            className="px-8"
            disabled={isSearching}
            style={{ backgroundColor: accentColor }}
          >
            {isSearching ? (
              <>
                <Icon name="Loader2" size={20} className="animate-spin mr-2" />
                Поиск...
              </>
            ) : (
              'Найти'
            )}
          </Button>
        </div>
        
        {searchHistory.length > 0 && showHistory && !searchQuery && (
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Icon name="Clock" size={14} />
              Недавние:
            </span>
            {searchHistory.slice(0, 5).map((item, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => onHistoryClick(item)}
              >
                {item}
              </Badge>
            ))}
          </div>
        )}
      </form>
    </Card>
  );
};

export default SearchBar;
