
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PetCard from '@/components/PetCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import type { Pet } from '@/lib/supabase';

const MyPets = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pets, setPets] = useState<Pet[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuthAndFetchPets = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          navigate('/login');
          return;
        }
        
        // Get user info
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', sessionData.session.user.id)
          .single();
        
        if (userError || !userData) {
          console.error('Error fetching user data:', userError);
          navigate('/login');
          return;
        }
        
        setUserInfo(userData);
        
        // Check if user is an animal owner
        if (userData.role !== 'owner') {
          navigate('/dashboard');
          return;
        }
        
        // Fetch pets owned by the user
        const { data: petsData, error: petsError } = await supabase
          .from('pets')
          .select('*')
          .eq('owner_id', userData.id);
        
        if (petsError) {
          console.error('Error fetching pets:', petsError);
          toast({
            title: "שגיאה בטעינת חיות המחמד",
            description: petsError.message,
            variant: "destructive",
          });
        } else if (petsData) {
          setPets(petsData);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthAndFetchPets();
  }, [navigate, toast]);

  const handleRequestService = async (petId: string, serviceType: string, serviceDate: string | undefined, serviceTimeFrom: string, serviceTimeTo: string, serviceDuration: string) => {
    try {
      // Create a new service request in Supabase
      const { data, error } = await supabase
        .from('service_requests')
        .insert({
          pet_id: petId,
          owner_id: userInfo.id,
          service_type: serviceType as 'walk' | 'grooming' | 'boarding' | 'training',
          date: serviceDate,
          time_from: serviceTimeFrom,
          time_to: serviceTimeTo,
          duration: parseInt(serviceDuration, 10) || null,
          status: 'open'
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "בקשת השירות נשלחה בהצלחה!",
        description: "נותני שירות יוכלו להגיש הצעות בקרוב.",
      });
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "שגיאה בשליחת הבקשה",
        description: error.message || "אירעה שגיאה בשליחת בקשת השירות",
        variant: "destructive",
      });
    }
  };

  // Function to transform Pet objects to match PetCard expected format
  const transformPetData = (pet: Pet) => {
    return {
      id: pet.id,
      ownerId: pet.owner_id,
      ownerName: userInfo?.full_name || "",
      name: pet.name,
      age: pet.age ? pet.age.toString() : "",
      type: pet.species,
      breed: pet.breed || "", // This should work now as we've added breed to the type
      description: pet.description || "",
      image: pet.image_url || "",
      needsService: false,
      serviceType: "",
      createdAt: pet.created_at
    };
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
                  pet={transformPetData(pet)} 
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
