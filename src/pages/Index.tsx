import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import SettingsDialog, { UserSettings } from '@/components/SettingsDialog';
import PortalHeader from '@/components/portal/PortalHeader';
import SearchBar from '@/components/portal/SearchBar';
import SearchResults from '@/components/portal/SearchResults';
import BrowserTab from '@/components/portal/BrowserTab';
import FeatureCards from '@/components/portal/FeatureCards';
import { useToast } from '@/hooks/use-toast';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [browserUrl, setBrowserUrl] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [settings, setSettings] = useState<UserSettings>({
    theme: 'light',
    searchEngine: 'duckduckgo',
    resultsPerPage: 10,
    safeSearch: true,
    autoComplete: true,
    username: 'Пользователь',
    backgroundColor: '#F8FAFC',
    accentColor: '#2563EB',
    openInNewTab: true,
    showHistory: true,
    compactView: false,
    language: 'ru',
  });

  useEffect(() => {
    const saved = localStorage.getItem('userSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
    
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        title: 'Введите запрос',
        description: 'Пожалуйста, введите что-нибудь для поиска',
        variant: 'destructive',
      });
      return;
    }

    setIsSearching(true);
    setShowSuggestions(false);
    
    if (settings.showHistory && !searchHistory.includes(searchQuery)) {
      const newHistory = [searchQuery, ...searchHistory].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
    
    try {
      const response = await fetch(
        `https://functions.poehali.dev/449de1be-255e-477a-aa5a-20a2be94ed0b?query=${encodeURIComponent(searchQuery)}&limit=${settings.resultsPerPage}`
      );
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setSearchResults(data.results || []);
      
      toast({
        title: 'Поиск завершен',
        description: `Найдено ${data.results?.length || 0} результатов`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка поиска',
        description: 'Не удалось выполнить поиск. Попробуйте позже.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    
    if (settings.autoComplete && value.length > 1) {
      const filtered = searchHistory.filter(item => 
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  const handleBrowse = (url: string) => {
    setBrowserUrl(url);
    setActiveTab('browser');
  };

  const handleGoToBrowser = () => {
    if (browserUrl) {
      const iframe = document.getElementById('browser-frame') as HTMLIFrameElement;
      if (iframe) {
        iframe.src = `https://functions.poehali.dev/00c628d4-e5da-437b-be5c-c49164f713fe?url=${encodeURIComponent(browserUrl)}`;
      }
    }
  };

  const getUserInitials = () => {
    return settings.username
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleHistoryClick = (item: string) => {
    setSearchQuery(item);
    searchInputRef.current?.focus();
  };

  const handleSearchFocus = () => {
    if (settings.autoComplete && searchQuery.length > 1) {
      setShowSuggestions(suggestions.length > 0);
    }
  };

  const handleSearchBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 transition-colors duration-300"
      style={{ 
        backgroundColor: settings.backgroundColor,
      }}
    >
      <div className={`container mx-auto max-w-7xl transition-all ${settings.compactView ? 'px-2 py-4' : 'px-4 py-8'}`}>
        <PortalHeader
          username={settings.username}
          accentColor={settings.accentColor}
          compactView={settings.compactView}
          getUserInitials={getUserInitials}
          onSettingsClick={() => setSettingsOpen(true)}
        />

        <div className={`text-center animate-fade-in ${settings.compactView ? 'mb-6' : 'mb-12'}`}>
          <h1 
            className={`font-bold bg-gradient-to-r bg-clip-text text-transparent ${settings.compactView ? 'text-3xl mb-2' : 'text-5xl mb-4'}`}
            style={{ 
              backgroundImage: `linear-gradient(to right, ${settings.accentColor}, ${settings.accentColor}99)`
            }}
          >
            Tech Portal
          </h1>
          <p className={`text-muted-foreground ${settings.compactView ? 'text-sm' : 'text-lg'}`}>
            Поиск и просмотр информации в одном месте
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Icon name="Search" size={18} />
              Поиск
            </TabsTrigger>
            <TabsTrigger value="browser" className="flex items-center gap-2">
              <Icon name="Globe" size={18} />
              Браузер
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="animate-fade-in">
            <SearchBar
              searchQuery={searchQuery}
              isSearching={isSearching}
              searchHistory={searchHistory}
              suggestions={suggestions}
              showSuggestions={showSuggestions}
              showHistory={settings.showHistory}
              autoComplete={settings.autoComplete}
              accentColor={settings.accentColor}
              searchInputRef={searchInputRef}
              onSearchSubmit={handleSearch}
              onSearchInputChange={handleSearchInputChange}
              onSuggestionClick={handleSuggestionClick}
              onClearSearch={clearSearch}
              onHistoryClick={handleHistoryClick}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />

            <SearchResults
              results={searchResults}
              isSearching={isSearching}
              accentColor={settings.accentColor}
              onBrowse={handleBrowse}
            />
          </TabsContent>

          <TabsContent value="browser" className="animate-fade-in">
            <BrowserTab
              browserUrl={browserUrl}
              accentColor={settings.accentColor}
              onUrlChange={setBrowserUrl}
              onGoToBrowser={handleGoToBrowser}
              onBackToSearch={() => setActiveTab('search')}
            />
          </TabsContent>
        </Tabs>

        <FeatureCards
          accentColor={settings.accentColor}
          onSettingsClick={() => setSettingsOpen(true)}
        />
      </div>

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
};

export default Index;
