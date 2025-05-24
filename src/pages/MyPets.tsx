
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PetCard from '@/components/PetCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Pet, getPets } from '@/lib/mockData';

const MyPets = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const loadUserAndPets = async () => {
      try {
        // Get current user from localStorage
        const userString = localStorage.getItem('mock_auth_user');
        if (!userString) {
          navigate('/login');
          return;
        }
        
        const userData = JSON.parse(userString);
        setCurrentUser(userData.user);
        
        // Load user's pets
        const userPets = await getPets(userData.user.id);
        setPets(userPets);
      } catch (error) {
        console.error('Error loading pets:', error);
        toast({
          title: "שגיאה בטעינת חיות המחמד",
          description: "לא ניתן לטעון את רשימת חיות המחמד שלך",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadUserAndPets();
  }, [navigate]);

  const handleRequestService = (petId: string, serviceType: string, serviceDate: string | undefined, serviceTimeFrom: string, serviceTimeTo: string, serviceDuration: string) => {
    try {
      // Navigate to service request page
      navigate(`/request-service/${petId}`, {
        state: {
          petId,
          serviceType,
          serviceDate,
          serviceTimeFrom,
          serviceTimeTo,
          serviceDuration
        }
      });
    } catch (error: any) {
      toast({
        title: "שגיאה בבקשת השירות",
        description: error.message || "אירעה שגיאה בבקשת השירות",
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
