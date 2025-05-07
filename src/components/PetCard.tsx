
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dog, Cat, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    createdAt: string;
  };
  viewType: 'owner' | 'provider';
  onRequestService?: (petId: string, serviceType: string) => void;
}

const PetCard: React.FC<PetCardProps> = ({ pet, viewType, onRequestService }) => {
  const { toast } = useToast();
  const [requestingService, setRequestingService] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState<string>(pet.serviceType || 'walking');

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

  const handleRequestService = () => {
    if (onRequestService) {
      onRequestService(pet.id, selectedService);
      setRequestingService(false);
      
      toast({
        title: "בקשת שירות נשלחה",
        description: `הבקשה עבור ${serviceTypeLabel(selectedService)} נשלחה בהצלחה`,
      });
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
            </div>
          </div>
        )}
        
        {viewType === 'provider' && (
          <div className="border-t pt-3 mt-2">
            <p className="text-sm font-medium">בעלים: {pet.ownerName}</p>
          </div>
        )}

        {requestingService && viewType === 'owner' && (
          <div className="mt-4 pt-4 border-t space-y-3">
            <p className="font-medium text-sm">איזה שירות תרצה להזמין?</p>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="בחר שירות" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="walking">טיולים 🐕</SelectItem>
                <SelectItem value="sitting">פנסיון 🏠</SelectItem>
                <SelectItem value="grooming">טיפוח ✂️</SelectItem>
                <SelectItem value="training">אילוף 🎓</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="default" size="sm" className="flex-1" onClick={handleRequestService}>
                שלח בקשה
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setRequestingService(false)}>
                ביטול
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-gray-50 px-4 py-3">
        <div className="w-full flex justify-between items-center">
          {viewType === 'owner' ? (
            requestingService ? null : (
              <div className="flex gap-2 w-full">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link to={`/pets/${pet.id}/edit`}>
                    ערוך פרטים
                  </Link>
                </Button>
                {!pet.needsService && (
                  <Button variant="default" size="sm" className="flex-1" onClick={() => setRequestingService(true)}>
                    בקש שירות
                  </Button>
                )}
              </div>
            )
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link to={`/booking/new?petId=${pet.id}`}>
                הצע שירות
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PetCard;
