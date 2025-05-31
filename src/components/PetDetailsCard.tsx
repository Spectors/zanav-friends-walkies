
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Pet } from '@/lib/mockData';
import { calculateAge } from '@/utils/dateUtils';

interface PetDetailsCardProps {
  pet: Pet;
  formData: {
    date: string;
    timeFrom: string;
    timeTo: string;
    location: string;
  };
}

const PetDetailsCard: React.FC<PetDetailsCardProps> = ({ pet, formData }) => {
  const petAge = calculateAge(pet.birth_date);

  return (
    <Card>
      <CardHeader>
        <CardTitle>פרטי חיית המחמד</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 bg-muted rounded-full flex items-center justify-center">
              <span className="text-2xl">
                {pet.type === 'dog' ? '🐶' : '😺'}
              </span>
            </div>
            <h3 className="font-semibold text-lg">{pet.name}</h3>
            <p className="text-sm text-muted-foreground">
              {pet.breed || 'גזע לא ידוע'} • גיל {petAge}
            </p>
          </div>
          
          {pet.description && (
            <div>
              <h4 className="font-medium mb-2">תיאור</h4>
              <p className="text-sm text-muted-foreground">{pet.description}</p>
            </div>
          )}
          
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Calendar size={16} />
              <span>בקשה ליום: {formData.date || 'לא נבחר'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Clock size={16} />
              <span>
                {formData.timeFrom && formData.timeTo 
                  ? `${formData.timeFrom} - ${formData.timeTo}` 
                  : 'לא נבחר'}
              </span>
            </div>
            {formData.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={16} />
                <span>{formData.location}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PetDetailsCard;
