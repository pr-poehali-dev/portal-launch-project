import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  isSearching: boolean;
  accentColor: string;
  onBrowse: (url: string) => void;
}

const SearchResults = ({ results, isSearching, accentColor, onBrowse }: SearchResultsProps) => {
  if (results.length === 0 && !isSearching) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon name="Search" size={40} style={{ color: accentColor }} />
        </div>
        <h3 className="text-xl font-semibold mb-2">Начните поиск</h3>
        <p className="text-muted-foreground">
          Введите запрос выше, чтобы найти информацию
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.length > 0 && (
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Icon name="FileText" size={24} />
          Результаты поиска ({results.length})
        </h2>
      )}
      {results.map((result, index) => (
        <Card
          key={index}
          className="p-6 hover:shadow-xl transition-all duration-300 hover:border-primary/40 cursor-pointer group animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 
                className="text-xl font-semibold mb-2 group-hover:underline"
                style={{ color: accentColor }}
              >
                {result.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                {result.url}
              </p>
              <p className="text-foreground/80 leading-relaxed">
                {result.snippet}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onBrowse(result.url)}
              className="shrink-0 hover:bg-primary/10"
            >
              <Icon name="ExternalLink" size={20} />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SearchResults;
