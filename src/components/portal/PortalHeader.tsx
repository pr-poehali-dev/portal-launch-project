import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface PortalHeaderProps {
  username: string;
  accentColor: string;
  compactView: boolean;
  getUserInitials: () => string;
  onSettingsClick: () => void;
}

const PortalHeader = ({
  username,
  accentColor,
  compactView,
  getUserInitials,
  onSettingsClick,
}: PortalHeaderProps) => {
  return (
    <div className={`flex justify-between items-center ${compactView ? 'mb-4' : 'mb-8'}`}>
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarFallback 
            className="text-white font-semibold"
            style={{ backgroundColor: accentColor }}
          >
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm text-muted-foreground">Добро пожаловать,</p>
          <p className="font-semibold">{username}</p>
        </div>
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onSettingsClick}
        className="hover:rotate-90 transition-transform duration-300"
      >
        <Icon name="Settings" size={20} />
      </Button>
    </div>
  );
};

export default PortalHeader;
