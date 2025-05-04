
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Phone } from 'lucide-react';

interface ExpandableListItemProps {
  title: string;
  subtitle?: string;
  image?: string;
  badge?: React.ReactNode;
  previewContent: React.ReactNode;
  expandedContent: React.ReactNode;
  phoneNumber?: string;
}

const ExpandableListItem = ({
  title,
  subtitle,
  image,
  badge,
  previewContent,
  expandedContent,
  phoneNumber,
}: ExpandableListItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCall = (e: React.MouseEvent, number: string) => {
    e.stopPropagation();
    window.location.href = `tel:${number}`;
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="mb-3 w-full"
    >
      <Card className="overflow-hidden">
        <CollapsibleTrigger className="w-full text-left">
          <div className="flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors">
            {/* Image and basic info */}
            <div className="flex items-center flex-1">
              {image && (
                <div className="mr-3 h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                  <img src={image} alt={title} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium truncate">{title}</h3>
                  {badge && <div className="ml-2">{badge}</div>}
                </div>
                {subtitle && <p className="text-sm text-gray-500 truncate">{subtitle}</p>}
              </div>
            </div>
            
            {/* Preview content (visible in collapsed state) */}
            <div className="hidden md:flex items-center flex-1 text-sm text-gray-500 px-2">
              {previewContent}
            </div>
            
            {/* Phone button */}
            {phoneNumber && (
              <div 
                className="mr-2 p-2 rounded-full hover:bg-gray-100" 
                onClick={(e) => handleCall(e, phoneNumber)}
              >
                <Phone size={18} className="text-zanav-blue" />
              </div>
            )}
            
            {/* Toggle icon */}
            <div className="ml-auto pl-3">
              {isOpen ? (
                <ChevronUp size={18} className="text-gray-500" />
              ) : (
                <ChevronDown size={18} className="text-gray-500" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>
        
        {/* Expanded content */}
        <CollapsibleContent className="border-t">
          <div className="p-4">
            {expandedContent}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default ExpandableListItem;
