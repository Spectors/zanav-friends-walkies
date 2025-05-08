
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dog, Cat, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface PetCardProps {
  pet: {
    id: string;
    ownerId: string;
    ownerName: string;
    name: string;
    age: string;
    type: 'dog' | 'cat';
    breed: string | null;
    description: string | null;
    image: string | null;
    needsService: boolean;
    serviceType: string | null;
    serviceTimeFrom?: string;
    serviceTimeTo?: string;
    serviceDuration?: string;
    serviceDate?: string;
    createdAt: string;
  };
  viewType: 'owner' | 'provider';
  onRequestService?: (petId: string, serviceType: string, serviceDate: string | undefined, serviceTimeFrom: string, serviceTimeTo: string, serviceDuration: string) => void;
}

const PetCard: React.FC<PetCardProps> = ({ pet, viewType, onRequestService }) => {
  const { toast } = useToast();
  const PetIcon = () => {
    if (pet.type === 'cat') {
      return <Cat className="h-5 w-5 text-primary" />;
    }
    return <Dog className="h-5 w-5 text-primary" />;
  };

  const serviceTypeEmoji = (type: string | null) => {
    switch(type) {
      case 'walking': return '🐕';
      case 'sitting': return '🏠';
      case 'grooming': return '✂️';
      case 'training': return '🎓';
      default: return '❓';
    }
  };

  const serviceTypeLabel = (type: string | null) => {
    switch(type) {
      case 'walking': return 'טיולים';
      case 'sitting': return 'פנסיון';
      case 'grooming': return 'טיפוח';
      case 'training': return 'אילוף';
      default: return 'לא צוין';
    }
  };

  return (
    <Card className="overflow-hidden border-t-4 hover:shadow-md transition-shadow"
          style={{ 
            borderTopColor: pet.needsService ? '#3b82f6' : '#10b981'
          }}
    >
      <div className="aspect-square overflow-hidden">
        {pet.image ? (
          <img 
            src={pet.image} 
            alt={pet.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <PetIcon />
            <span className="text-4xl">
              {pet.type === 'dog' ? '🐶' : '😺'}
            </span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold">{pet.name}</h3>
              <PetIcon />
            </div>
            <p className="text-sm text-gray-500">
              {pet.breed && `${pet.breed} • `}גיל: {pet.age}
            </p>
          </div>
          
          {pet.needsService && (
            <Badge className="bg-blue-100 text-blue-800">
              מחפש שירות
            </Badge>
          )}
        </div>
        
        {pet.description && (
          <p className="text-sm mb-4 line-clamp-3">{pet.description}</p>
        )}
        
        {pet.needsService && pet.serviceType && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg mb-2">
            <span className="text-xl">{serviceTypeEmoji(pet.serviceType)}</span>
            <div>
              <p className="font-medium">מחפש שירות</p>
              <p className="text-sm text-gray-500">{serviceTypeLabel(pet.serviceType)}</p>
              {pet.serviceDate && (
                <p className="text-xs text-gray-500">
                  <Calendar className="h-3 w-3 inline mr-1" /> {pet.serviceDate}
                </p>
              )}
              {pet.serviceTimeFrom && pet.serviceTimeTo && (
                <p className="text-xs text-gray-500">
                  <Clock className="h-3 w-3 inline mr-1" /> {pet.serviceTimeFrom}-{pet.serviceTimeTo} ({pet.serviceDuration} דקות)
                </p>
              )}
            </div>
          </div>
        )}
        
        {viewType === 'provider' && (
          <div className="border-t pt-3 mt-2">
            <p className="text-sm font-medium">בעלים: {pet.ownerName}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-gray-50 px-4 py-3">
        <div className="w-full flex justify-between items-center">
          {viewType === 'owner' ? (
            <div className="flex gap-2 w-full">
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link to={`/pets/${pet.id}/edit`}>
                  ערוך פרטים
                </Link>
              </Button>
              {!pet.needsService ? (
                <Button variant="default" size="sm" asChild className="flex-1">
                  <Link to={`/request-service/${pet.id}`}>
                    בקש שירות
                  </Link>
                </Button>
              ) : (
                <Button variant="secondary" size="sm" asChild className="flex-1">
                  <Link to={`/request-service/${pet.id}`}>
                    עדכן בקשה
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            pet.needsService && (
              <Button variant="default" size="sm" asChild>
                <Link to={`/service-offer?petId=${pet.id}`}>
                  הצע שירות
                </Link>
              </Button>
            )
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PetCard;
