
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PetCard from '@/components/PetCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Temporary mock data for development with correct type for "type" property
const MOCK_PETS = [
  {
    id: '1',
    ownerId: 'user1',
    ownerName: 'דני כהן',
    name: 'רקסי',
    age: '3',
    type: 'dog' as const, // Explicitly typed as "dog"
    breed: 'לברדור',
    description: 'כלב חברותי מאוד שאוהב לשחק',
    image: '/images/dog1.jpg',
    needsService: false,
    serviceType: '',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    ownerId: 'user1',
    ownerName: 'דני כהן',
    name: 'מיצי',
    age: '2',
    type: 'cat' as const, // Explicitly typed as "cat"
    breed: 'חתול רחוב',
    description: 'חתולה שקטה שאוהבת לישון',
    image: '/images/cat1.jpg',
    needsService: false,
    serviceType: '',
    createdAt: new Date().toISOString()
  }
];

const MyPets = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pets, setPets] = useState(MOCK_PETS);
  const [loading, setLoading] = useState(false);

  // For now we're using mock data instead of Supabase
  useEffect(() => {
    setLoading(false);
  }, []);

  const handleRequestService = (petId: string, serviceType: string, serviceDate: string | undefined, serviceTimeFrom: string, serviceTimeTo: string, serviceDuration: string) => {
    try {
      // In the future, this will create a service request in Supabase
      toast({
        title: "בקשת השירות נשלחה בהצלחה!",
        description: "נותני שירות יוכלו להגיש הצעות בקרוב.",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "שגיאה בשליחת הבקשה",
        description: error.message || "אירעה שגיאה בשליחת בקשת השירות",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold">החיות שלי</h1>
              <p className="text-muted-foreground">נהל את חיות המחמד שלך וצפה בסטטוס השירותים</p>
            </div>
            <Button onClick={() => navigate('/pet-onboarding')} className="flex items-center gap-2">
              <Plus size={16} />
              הוסף חיה חדשה
            </Button>
          </div>

          {loading ? (
            <p>טוען...</p>
          ) : pets.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-2">אין לך חיות מחמד עדיין</h2>
              <p className="text-muted-foreground mb-6">הוסף את החיה הראשונה שלך כדי להתחיל</p>
              <Button onClick={() => navigate('/pet-onboarding')}>הוסף חיה חדשה</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <PetCard 
                  key={pet.id} 
                  pet={pet} 
                  viewType="owner" 
                  onRequestService={handleRequestService}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyPets;
