import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface FeatureCardsProps {
  accentColor: string;
  onSettingsClick: () => void;
}

const FeatureCards = ({ accentColor, onSettingsClick }: FeatureCardsProps) => {
  return (
    <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
        <div 
          className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <Icon name="Search" size={24} style={{ color: accentColor }} />
        </div>
        <h4 className="font-semibold mb-2">Мощный поиск</h4>
        <p className="text-sm text-muted-foreground">
          Быстрые и точные результаты
        </p>
      </Card>

      <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
        <div 
          className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <Icon name="Globe" size={24} style={{ color: accentColor }} />
        </div>
        <h4 className="font-semibold mb-2">Встроенный браузер</h4>
        <p className="text-sm text-muted-foreground">
          Просмотр без переключения
        </p>
      </Card>

      <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
        <div 
          className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <Icon name="BarChart" size={24} style={{ color: accentColor }} />
        </div>
        <h4 className="font-semibold mb-2">Аналитика</h4>
        <p className="text-sm text-muted-foreground">
          Статистика и метрики
        </p>
      </Card>

      <Card 
        className="p-6 text-center hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        onClick={onSettingsClick}
      >
        <div 
          className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <Icon name="Settings" size={24} style={{ color: accentColor }} />
        </div>
        <h4 className="font-semibold mb-2">Настройки</h4>
        <p className="text-sm text-muted-foreground">
          Гибкая конфигурация
        </p>
      </Card>
    </div>
  );
};

export default FeatureCards;
