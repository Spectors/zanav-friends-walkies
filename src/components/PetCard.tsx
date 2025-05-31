
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dog, Cat, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Database } from '@/integrations/supabase/types';

type Pet = Database['public']['Tables']['pets']['Row'];

interface PetCardProps {
  pet: Pet;
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const PetIcon = () => {
    if (pet.type === 'cat') {
      return <Cat className="h-5 w-5 text-primary" />;
    }
    return <Dog className="h-5 w-5 text-primary" />;
  };

  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return 'לא צוין';
    
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    
    if (ageInMonths < 12) {
      return `${ageInMonths} חודשים`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      return `${years} שנים`;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square overflow-hidden">
        {pet.avatar ? (
          <img 
            src={pet.avatar} 
            alt={pet.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <div className="text-center">
              <PetIcon />
              <span className="text-4xl mt-2 block">
                {pet.type === 'dog' ? '🐶' : '😺'}
              </span>
            </div>
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
              {pet.breed && `${pet.breed} • `}גיל: {calculateAge(pet.birth_date)}
            </p>
          </div>
        </div>
        
        {pet.description && (
          <p className="text-sm mb-4 line-clamp-3">{pet.description}</p>
        )}
      </CardContent>
      
      <CardFooter className="bg-gray-50 px-4 py-3">
        <div className="w-full flex gap-2">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link to={`/pets/${pet.id}/edit`}>
              ערוך פרטים
            </Link>
          </Button>
          <Button variant="default" size="sm" asChild className="flex-1">
            <Link to={`/pets/${pet.id}/medical`}>
              רפואי
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PetCard;
