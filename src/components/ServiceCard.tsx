
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Check, X, Dog, Cat } from 'lucide-react';
import ContactActions from './ContactActions';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ServiceCardProps {
  service: {
    id: number;
    title: string;
    providerName?: string;
    providerImage?: string;
    clientName?: string;
    clientImage?: string;
    petName?: string;
    petImage?: string;
    petType?: 'dog' | 'cat';
    status: 'pending' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
    date: string;
    time: string;
    duration: string;
    location?: string;
    price: number;
    isPaid: boolean;
    phoneNumber: string;
    serviceType: string;
  };
  viewType: 'provider' | 'animalOwner';
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, viewType }) => {
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-purple-100 text-purple-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-amber-100 text-amber-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'ממתין לאישור 🕒';
      case 'scheduled': return 'מתוזמן 📅';
      case 'in-progress': return 'בתהליך 🏃‍♂️';
      case 'completed': return 'הושלם ✅';
      case 'cancelled': return 'בוטל ❌';
      default: return status;
    }
  };

  const getPetEmoji = () => {
    return service.petType === 'cat' ? '😺' : '🐶';
  };

  const PetIcon = () => {
    if (service.petType === 'cat') {
      return <Cat className="h-4 w-4 inline mr-1" />;
    }
    return <Dog className="h-4 w-4 inline mr-1" />;
  };

  const handleApproveService = () => {
    // In a real app, this would update the service in a database
    // For now, we'll just show a toast notification
    
    // Get services from localStorage
    const servicesStr = localStorage.getItem('zanav_services');
    if (servicesStr) {
      const allServices = JSON.parse(servicesStr);
      
      // Find and update the service
      const updatedServices = allServices.map((s: any) => {
        if (s.id === service.id) {
          return {
            ...s,
            status: 'scheduled'
          };
        }
        return s;
      });
      
      // Save back to localStorage
      localStorage.setItem('zanav_services', JSON.stringify(updatedServices));
      
      // Show success notification
      toast({
        title: "השירות אושר בהצלחה",
        description: `טיול הכלב מתוזמן ל-${service.date} בשעה ${service.time}`,
      });

      // Notify provider (in a real app this would trigger a notification)
      toast({
        title: `התראה נשלחה ל${service.providerName}`,
        description: "זכור להשאיר את המפתח ומזון לחיית המחמד",
      });
      
      // Force refresh by redirecting to the same page
      window.location.reload();
    }
  };

  const handleRejectService = () => {
    // In a real app, this would update the service in a database
    // For now, we'll just show a toast notification
    
    // Get services from localStorage
    const servicesStr = localStorage.getItem('zanav_services');
    if (servicesStr) {
      const allServices = JSON.parse(servicesStr);
      
      // Find and update the service
      const updatedServices = allServices.map((s: any) => {
        if (s.id === service.id) {
          return {
            ...s,
            status: 'cancelled'
          };
        }
        return s;
      });
      
      // Save back to localStorage
      localStorage.setItem('zanav_services', JSON.stringify(updatedServices));
      
      // Show rejection notification
      toast({
        title: "השירות נדחה",
        description: "ההזמנה בוטלה",
        variant: "destructive",
      });
      
      // Force refresh by redirecting to the same page
      window.location.reload();
    }
  };

  return (
    <Card className="overflow-hidden border-t-4 hover:shadow-md transition-shadow"
          style={{ borderTopColor: 
            service.status === 'completed' ? '#10b981' : 
            service.status === 'scheduled' ? '#3b82f6' :
            service.status === 'pending' ? '#8b5cf6' :
            service.status === 'in-progress' ? '#f59e0b' : '#ef4444' 
          }}
    >
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">{service.title}</h3>
            {service.petType && (
              <span className="text-lg">
                {getPetEmoji()}
              </span>
            )}
          </div>
          <Badge className={`${getStatusColor(service.status)}`}>
            {getStatusText(service.status)}
          </Badge>
        </div>
        
        <div className="grid gap-4 mb-4">
          {viewType === 'animalOwner' && service.providerName && (
            <div className="flex items-center gap-3">
              {service.providerImage && (
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img src={service.providerImage} alt={service.providerName} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <p className="font-medium">נותן שירות: {service.providerName}</p>
                <p className="text-sm text-gray-500">{service.serviceType}</p>
              </div>
            </div>
          )}
          
          {viewType === 'provider' && service.clientName && (
            <div className="flex items-center gap-3">
              {service.clientImage && (
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img src={service.clientImage} alt={service.clientName} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <p className="font-medium">בעלים: {service.clientName}</p>
                <p className="text-sm text-gray-500">
                  {service.petName && (
                    <span className="flex items-center">
                      <PetIcon />
                      {service.petName}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5">
              <Calendar size={16} className="text-primary" />
              <span>{service.date}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Clock size={16} className="text-secondary" />
              <span>{service.time} ({service.duration})</span>
            </div>
            
            {service.location && (
              <div className="flex items-center gap-1.5 col-span-2">
                <MapPin size={16} className="text-accent" />
                <span>{service.location}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <span className="font-bold">₪{service.price}</span>
              {service.status === 'completed' && (
                <div className="flex items-center gap-1 border px-2 py-0.5 rounded-full text-xs">
                  {service.isPaid ? (
                    <>
                      <Check size={14} className="text-green-600" />
                      <span className="text-green-600">שולם</span>
                    </>
                  ) : (
                    <>
                      <X size={14} className="text-red-600" />
                      <span className="text-red-600">לא שולם</span>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <ContactActions phoneNumber={service.phoneNumber} size="sm" />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 px-4 py-3">
        <div className="w-full flex flex-wrap gap-2 justify-between">
          <Link to={`/service/${service.id}`}>
            <Button variant="outline" size="sm">צפייה בפרטים</Button>
          </Link>
          
          {service.status === 'pending' && viewType === 'animalOwner' && (
            <div className="flex gap-2">
              <Button 
                variant="default" 
                size="sm"
                onClick={handleApproveService}
              >
                אישור הזמנה
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 hover:text-red-700"
                onClick={handleRejectService}
              >
                דחייה
              </Button>
            </div>
          )}
          
          {service.status === 'scheduled' && (
            <Button variant="secondary" size="sm">שינוי הזמנה</Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
