import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export interface UserSettings {
  theme: 'light' | 'dark';
  searchEngine: string;
  resultsPerPage: number;
  safeSearch: boolean;
  autoComplete: boolean;
  username: string;
  backgroundColor: string;
  accentColor: string;
  openInNewTab: boolean;
  showHistory: boolean;
  compactView: boolean;
  language: 'ru' | 'en';
}

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
}

const SettingsDialog = ({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
}: SettingsDialogProps) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const { toast } = useToast();

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    onSettingsChange(localSettings);
    localStorage.setItem('userSettings', JSON.stringify(localSettings));
    toast({
      title: 'Настройки сохранены',
      description: 'Ваши предпочтения успешно обновлены',
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    const defaultSettings: UserSettings = {
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
    };
    setLocalSettings(defaultSettings);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Settings" size={24} />
            Настройки портала
          </DialogTitle>
          <DialogDescription>
            Персонализируйте ваш опыт работы с порталом
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Общие</TabsTrigger>
            <TabsTrigger value="search">Поиск</TabsTrigger>
            <TabsTrigger value="appearance">Вид</TabsTrigger>
            <TabsTrigger value="privacy">Приватность</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="username">Имя пользователя</Label>
              <Input
                id="username"
                value={localSettings.username}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, username: e.target.value })
                }
                placeholder="Введите ваше имя"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Тёмная тема</Label>
                <p className="text-sm text-muted-foreground">
                  Переключить на тёмный режим
                </p>
              </div>
              <Switch
                checked={localSettings.theme === 'dark'}
                onCheckedChange={(checked) =>
                  setLocalSettings({
                    ...localSettings,
                    theme: checked ? 'dark' : 'light',
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Автодополнение</Label>
                <p className="text-sm text-muted-foreground">
                  Предлагать варианты при вводе
                </p>
              </div>
              <Switch
                checked={localSettings.autoComplete}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, autoComplete: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Язык интерфейса</Label>
              <div className="flex gap-2">
                <Button
                  variant={localSettings.language === 'ru' ? 'default' : 'outline'}
                  onClick={() => setLocalSettings({ ...localSettings, language: 'ru' })}
                  className="flex-1"
                >
                  Русский
                </Button>
                <Button
                  variant={localSettings.language === 'en' ? 'default' : 'outline'}
                  onClick={() => setLocalSettings({ ...localSettings, language: 'en' })}
                  className="flex-1"
                >
                  English
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="search" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Результатов на странице: {localSettings.resultsPerPage}</Label>
              <Slider
                value={[localSettings.resultsPerPage]}
                onValueChange={([value]) =>
                  setLocalSettings({ ...localSettings, resultsPerPage: value })
                }
                min={5}
                max={50}
                step={5}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Безопасный поиск</Label>
                <p className="text-sm text-muted-foreground">
                  Фильтровать нежелательный контент
                </p>
              </div>
              <Switch
                checked={localSettings.safeSearch}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, safeSearch: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Открывать ссылки в новой вкладке</Label>
                <p className="text-sm text-muted-foreground">
                  Автоматически открывать результаты в новом окне
                </p>
              </div>
              <Switch
                checked={localSettings.openInNewTab}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, openInNewTab: checked })
                }
              />
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="bgColor">Цвет фона</Label>
              <div className="flex gap-2">
                <Input
                  id="bgColor"
                  type="color"
                  value={localSettings.backgroundColor}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      backgroundColor: e.target.value,
                    })
                  }
                  className="w-20 h-10"
                />
                <Input
                  value={localSettings.backgroundColor}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      backgroundColor: e.target.value,
                    })
                  }
                  placeholder="#F8FAFC"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accentColor">Акцентный цвет</Label>
              <div className="flex gap-2">
                <Input
                  id="accentColor"
                  type="color"
                  value={localSettings.accentColor}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      accentColor: e.target.value,
                    })
                  }
                  className="w-20 h-10"
                />
                <Input
                  value={localSettings.accentColor}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      accentColor: e.target.value,
                    })
                  }
                  placeholder="#2563EB"
                />
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Предпросмотр:</p>
              <div
                className="p-4 rounded-md"
                style={{ backgroundColor: localSettings.backgroundColor }}
              >
                <p
                  className="font-semibold"
                  style={{ color: localSettings.accentColor }}
                >
                  Tech Portal
                </p>
                <p className="text-sm mt-1">Пример текста с вашими настройками</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Компактный вид</Label>
                <p className="text-sm text-muted-foreground">
                  Уменьшить отступы и размеры элементов
                </p>
              </div>
              <Switch
                checked={localSettings.compactView}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, compactView: checked })
                }
              />
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Сохранять историю поиска</Label>
                <p className="text-sm text-muted-foreground">
                  Запоминать ваши запросы для быстрого доступа
                </p>
              </div>
              <Switch
                checked={localSettings.showHistory}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, showHistory: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Очистка данных</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.removeItem('searchHistory');
                    toast({
                      title: 'История очищена',
                      description: 'Все записи поиска удалены',
                    });
                  }}
                  className="flex-1"
                >
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Очистить историю
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.clear();
                    toast({
                      title: 'Данные удалены',
                      description: 'Все локальные данные очищены',
                    });
                  }}
                  className="flex-1"
                >
                  <Icon name="Database" size={16} className="mr-2" />
                  Очистить всё
                </Button>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Icon name="Info" size={16} className="text-muted-foreground" />
                <span className="font-medium">Информация о данных</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Все ваши данные хранятся локально в браузере и не отправляются на сервер. 
                Вы полностью контролируете свою приватность.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleReset}>
            Сбросить
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button onClick={handleSave}>Сохранить</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;