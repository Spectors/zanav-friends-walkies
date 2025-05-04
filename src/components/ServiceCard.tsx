
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, DollarSign, Check, X } from 'lucide-react';
import ContactActions from './ContactActions';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  service: {
    id: number;
    title: string;
    providerName?: string;
    providerImage?: string;
    clientName?: string;
    clientImage?: string;
    dogName?: string;
    dogImage?: string;
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
    date: string;
    time: string;
    duration: string;
    location?: string;
    price: number;
    isPaid: boolean;
    phoneNumber: string;
    serviceType: string;
  };
  viewType: 'provider' | 'dogOwner';
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, viewType }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-amber-100 text-amber-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'מתוזמן 📅';
      case 'in-progress': return 'בתהליך 🏃‍♂️';
      case 'completed': return 'הושלם ✅';
      case 'cancelled': return 'בוטל ❌';
      default: return status;
    }
  };

  return (
    <Card className="overflow-hidden border-t-4 hover:shadow-md transition-shadow"
          style={{ borderTopColor: 
            service.status === 'completed' ? '#10b981' : 
            service.status === 'scheduled' ? '#3b82f6' : 
            service.status === 'in-progress' ? '#f59e0b' : '#ef4444' 
          }}
    >
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center justify-between mb-3">
          <h3 className="text-lg font-bold">{service.title}</h3>
          <Badge className={`${getStatusColor(service.status)}`}>
            {getStatusText(service.status)}
          </Badge>
        </div>
        
        <div className="grid gap-4 mb-4">
          {viewType === 'dogOwner' && service.providerName && (
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
                  {service.dogName && (
                    <span className="flex items-center">
                      <span>🐕</span> {service.dogName}
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
              <DollarSign size={18} className="text-emerald-600" />
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
          
          {service.status === 'scheduled' && (
            <Button variant="secondary" size="sm">שינוי הזמנה</Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
