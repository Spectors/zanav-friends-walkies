
import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContactActionsProps {
  phoneNumber: string;
  whatsapp?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ContactActions: React.FC<ContactActionsProps> = ({ 
  phoneNumber, 
  whatsapp = true, 
  className = '',
  size = 'md'
}) => {
  const { toast } = useToast();
  const formattedPhoneNumber = phoneNumber.replace(/\D/g, '');
  
  const handlePhoneCall = () => {
    window.location.href = `tel:${formattedPhoneNumber}`;
    toast({
      title: "מתקשר... 📞",
      description: `מתקשר למספר ${phoneNumber}`,
    });
  };
  
  const handleWhatsApp = () => {
    // Ensure the number includes country code for WhatsApp
    const whatsappNumber = formattedPhoneNumber.startsWith('972') 
      ? formattedPhoneNumber 
      : `972${formattedPhoneNumber.startsWith('0') ? formattedPhoneNumber.substring(1) : formattedPhoneNumber}`;
      
    window.open(`https://wa.me/${whatsappNumber}`, '_blank');
    
    toast({
      title: "פותח וואטסאפ... 💬",
      description: `שולח הודעה למספר ${phoneNumber}`,
    });
  };
  
  const getButtonSize = () => {
    switch(size) {
      case 'sm': return 'h-8 px-3 text-xs';
      case 'lg': return 'h-12 px-6 text-lg';
      default: return 'h-10 px-4 text-sm';
    }
  };
  
  const getIconSize = () => {
    switch(size) {
      case 'sm': return 14;
      case 'lg': return 20;
      default: return 16;
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        variant="outline"
        className={`${getButtonSize()} bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700`}
        onClick={handlePhoneCall}
      >
        <Phone size={getIconSize()} className="ml-1.5" />
        שיחה
      </Button>
      
      {whatsapp && (
        <Button
          variant="outline"
          className={`${getButtonSize()} bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700`}
          onClick={handleWhatsApp}
        >
          <MessageSquare size={getIconSize()} className="ml-1.5" />
          וואטסאפ
        </Button>
      )}
    </div>
  );
};

export default ContactActions;
