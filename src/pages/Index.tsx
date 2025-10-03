import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [browserUrl, setBrowserUrl] = useState('');
  const [activeTab, setActiveTab] = useState('search');

  const mockSearchResults = [
    {
      id: 1,
      title: 'Advanced Web Technologies Documentation',
      url: 'https://example.com/web-tech',
      snippet: 'Comprehensive guide to modern web development technologies including React, TypeScript, and cloud infrastructure...',
    },
    {
      id: 2,
      title: 'Technical Portal Development Best Practices',
      url: 'https://example.com/dev-practices',
      snippet: 'Learn how to build scalable and performant technical portals with industry-standard practices...',
    },
    {
      id: 3,
      title: 'Search Engine Optimization for Tech Sites',
      url: 'https://example.com/seo-tech',
      snippet: 'Essential SEO strategies for technical documentation and developer portals to improve discoverability...',
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleBrowse = (url: string) => {
    setBrowserUrl(url);
    setActiveTab('browser');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
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
                <Button type="submit" size="lg" className="px-8">
                  Найти
                </Button>
              </form>
            </Card>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Icon name="FileText" size={24} />
                Результаты поиска
              </h2>
              {mockSearchResults.map((result, index) => (
                <Card
                  key={result.id}
                  className="p-6 hover:shadow-xl transition-all duration-300 hover:border-primary/40 cursor-pointer group animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-primary mb-2 group-hover:underline">
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
                <Button size="lg" className="px-8">
                  <Icon name="ArrowRight" size={20} />
                </Button>
              </div>
            </Card>

            <Card className="p-8 min-h-[600px] shadow-lg flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="Globe" size={40} className="text-primary" />
                </div>
                <h3 className="text-2xl font-semibold">Встроенный браузер</h3>
                <p className="text-muted-foreground max-w-md">
                  {browserUrl
                    ? `Загрузка: ${browserUrl}`
                    : 'Введите URL адрес для просмотра веб-страницы или выберите результат из поиска'}
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Search" size={24} className="text-primary" />
            </div>
            <h4 className="font-semibold mb-2">Мощный поиск</h4>
            <p className="text-sm text-muted-foreground">
              Быстрые и точные результаты
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Globe" size={24} className="text-primary" />
            </div>
            <h4 className="font-semibold mb-2">Встроенный браузер</h4>
            <p className="text-sm text-muted-foreground">
              Просмотр без переключения
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="BarChart" size={24} className="text-primary" />
            </div>
            <h4 className="font-semibold mb-2">Аналитика</h4>
            <p className="text-sm text-muted-foreground">
              Статистика и метрики
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Settings" size={24} className="text-primary" />
            </div>
            <h4 className="font-semibold mb-2">Настройки</h4>
            <p className="text-sm text-muted-foreground">
              Гибкая конфигурация
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
