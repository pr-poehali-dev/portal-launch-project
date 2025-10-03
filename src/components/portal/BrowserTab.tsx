import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface BrowserTabProps {
  browserUrl: string;
  accentColor: string;
  onUrlChange: (url: string) => void;
  onGoToBrowser: () => void;
  onBackToSearch: () => void;
}

const BrowserTab = ({
  browserUrl,
  accentColor,
  onUrlChange,
  onGoToBrowser,
  onBackToSearch,
}: BrowserTabProps) => {
  return (
    <>
      <Card className="p-6 mb-6 shadow-lg border-primary/20">
        <div className="flex gap-3 items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBackToSearch}
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
              onChange={(e) => onUrlChange(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          <Button 
            size="lg" 
            className="px-8"
            onClick={onGoToBrowser}
            style={{ backgroundColor: accentColor }}
          >
            Открыть
          </Button>
        </div>
      </Card>

      {browserUrl ? (
        <Card className="p-0 min-h-[600px] shadow-lg overflow-hidden">
          <iframe
            id="browser-frame"
            src={`https://functions.poehali.dev/00c628d4-e5da-437b-be5c-c49164f713fe?url=${encodeURIComponent(browserUrl)}`}
            className="w-full h-[600px] border-0"
            title="Browser"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </Card>
      ) : (
        <Card className="p-8 min-h-[600px] shadow-lg flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10">
          <div className="text-center space-y-6">
            <div 
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${accentColor}15` }}
            >
              <Icon name="Globe" size={40} style={{ color: accentColor }} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">Встроенный браузер</h3>
              <p className="text-muted-foreground max-w-md">
                Введите URL адрес выше или выберите результат из поиска
              </p>
            </div>
            <div className="flex gap-2 justify-center flex-wrap">
              <Button 
                variant="outline" 
                onClick={() => { onUrlChange('https://google.com'); setTimeout(onGoToBrowser, 100); }}
              >
                Google
              </Button>
              <Button 
                variant="outline" 
                onClick={() => { onUrlChange('https://github.com'); setTimeout(onGoToBrowser, 100); }}
              >
                GitHub
              </Button>
              <Button 
                variant="outline" 
                onClick={() => { onUrlChange('https://stackoverflow.com'); setTimeout(onGoToBrowser, 100); }}
              >
                Stack Overflow
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default BrowserTab;
