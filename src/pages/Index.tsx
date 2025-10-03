import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import SettingsDialog, { UserSettings } from '@/components/SettingsDialog';
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
  });

  useEffect(() => {
    const saved = localStorage.getItem('userSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
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

  const handleBrowse = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleGoToBrowser = () => {
    if (browserUrl) {
      window.open(browserUrl, '_blank', 'noopener,noreferrer');
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

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 transition-colors duration-300"
      style={{ 
        backgroundColor: settings.backgroundColor,
      }}
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback 
                className="text-white font-semibold"
                style={{ backgroundColor: settings.accentColor }}
              >
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">Добро пожаловать,</p>
              <p className="font-semibold">{settings.username}</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            className="hover:rotate-90 transition-transform duration-300"
          >
            <Icon name="Settings" size={20} />
          </Button>
        </div>

        <div className="mb-12 text-center animate-fade-in">
          <h1 
            className="text-5xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent"
            style={{ 
              backgroundImage: `linear-gradient(to right, ${settings.accentColor}, ${settings.accentColor}99)`
            }}
          >
            Tech Portal
          </h1>
          <p className="text-muted-foreground text-lg">
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
            <Card className="p-6 mb-8 shadow-lg border-primary/20">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <Icon
                    name="Search"
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    type="text"
                    placeholder="Введите запрос для поиска..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="px-8"
                  disabled={isSearching}
                  style={{ backgroundColor: settings.accentColor }}
                >
                  {isSearching ? 'Поиск...' : 'Найти'}
                </Button>
              </form>
            </Card>

            <div className="space-y-4">
              {searchResults.length > 0 && (
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Icon name="FileText" size={24} />
                  Результаты поиска ({searchResults.length})
                </h2>
              )}
              {searchResults.map((result, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-xl transition-all duration-300 hover:border-primary/40 cursor-pointer group animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 
                        className="text-xl font-semibold mb-2 group-hover:underline"
                        style={{ color: settings.accentColor }}
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
                      onClick={() => handleBrowse(result.url)}
                      className="shrink-0 hover:bg-primary/10"
                    >
                      <Icon name="ExternalLink" size={20} />
                    </Button>
                  </div>
                </Card>
              ))}
              
              {searchResults.length === 0 && !isSearching && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="Search" size={40} style={{ color: settings.accentColor }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Начните поиск</h3>
                  <p className="text-muted-foreground">
                    Введите запрос выше, чтобы найти информацию
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="browser" className="animate-fade-in">
            <Card className="p-6 mb-6 shadow-lg border-primary/20">
              <div className="flex gap-3 items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveTab('search')}
                >
                  <Icon name="ArrowLeft" size={20} />
                </Button>
                <div className="relative flex-1">
                  <Icon
                    name="Globe"
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    type="url"
                    placeholder="Введите URL адрес..."
                    value={browserUrl}
                    onChange={(e) => setBrowserUrl(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <Button 
                  size="lg" 
                  className="px-8"
                  onClick={handleGoToBrowser}
                  style={{ backgroundColor: settings.accentColor }}
                >
                  Открыть
                </Button>
              </div>
            </Card>

            <Card className="p-8 min-h-[600px] shadow-lg flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10">
              <div className="text-center space-y-6">
                <div 
                  className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${settings.accentColor}15` }}
                >
                  <Icon name="ExternalLink" size={40} style={{ color: settings.accentColor }} />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Быстрый переход</h3>
                  <p className="text-muted-foreground max-w-md">
                    Введите URL адрес и нажмите "Открыть" - сайт откроется в новой вкладке
                  </p>
                </div>
                <div className="flex gap-2 justify-center flex-wrap">
                  <Button 
                    variant="outline" 
                    onClick={() => window.open('https://google.com', '_blank')}
                  >
                    Google
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => window.open('https://github.com', '_blank')}
                  >
                    GitHub
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => window.open('https://stackoverflow.com', '_blank')}
                  >
                    Stack Overflow
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div 
              className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${settings.accentColor}15` }}
            >
              <Icon name="Search" size={24} style={{ color: settings.accentColor }} />
            </div>
            <h4 className="font-semibold mb-2">Мощный поиск</h4>
            <p className="text-sm text-muted-foreground">
              Быстрые и точные результаты
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div 
              className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${settings.accentColor}15` }}
            >
              <Icon name="Globe" size={24} style={{ color: settings.accentColor }} />
            </div>
            <h4 className="font-semibold mb-2">Встроенный браузер</h4>
            <p className="text-sm text-muted-foreground">
              Просмотр без переключения
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div 
              className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${settings.accentColor}15` }}
            >
              <Icon name="BarChart" size={24} style={{ color: settings.accentColor }} />
            </div>
            <h4 className="font-semibold mb-2">Аналитика</h4>
            <p className="text-sm text-muted-foreground">
              Статистика и метрики
            </p>
          </Card>

          <Card 
            className="p-6 text-center hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => setSettingsOpen(true)}
          >
            <div 
              className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${settings.accentColor}15` }}
            >
              <Icon name="Settings" size={24} style={{ color: settings.accentColor }} />
            </div>
            <h4 className="font-semibold mb-2">Настройки</h4>
            <p className="text-sm text-muted-foreground">
              Гибкая конфигурация
            </p>
          </Card>
        </div>
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