
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PetCard from '@/components/PetCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const MyPets = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userInfoStr = localStorage.getItem('zanav_user');
    if (!userInfoStr) {
      navigate('/login');
      return;
    }

    const parsedUserInfo = JSON.parse(userInfoStr);
    setUserInfo(parsedUserInfo);

    // Check if user is an animal owner
    if (parsedUserInfo.userType !== 'animalOwner') {
      navigate('/dashboard');
      return;
    }

    // Get pets data
    const petsStr = localStorage.getItem('zanav_pets');
    if (petsStr) {
      const allPets = JSON.parse(petsStr);
      // Filter pets by owner
      const userPets = allPets.filter((pet: any) => pet.ownerId === parsedUserInfo.email);
      setPets(userPets);
    }

    setLoading(false);
  }, [navigate]);

  const handleRequestService = (petId: string, serviceType: string, serviceDate: string | undefined, serviceTimeFrom: string, serviceTimeTo: string, serviceDuration: string) => {
    // Update the pet to mark it as needing a service
    const petsStr = localStorage.getItem('zanav_pets');
    if (petsStr) {
      const allPets = JSON.parse(petsStr);
      const updatedPets = allPets.map((pet: any) => {
        if (pet.id === petId) {
          return {
            ...pet,
            needsService: true,
            serviceType,
            serviceDate,
            serviceTimeFrom,
            serviceTimeTo,
            serviceDuration
          };
        }
        return pet;
      });
      
      localStorage.setItem('zanav_pets', JSON.stringify(updatedPets));
      
      // Update local state
      setPets(prevPets => 
        prevPets.map(pet => 
          pet.id === petId 
            ? {
                ...pet,
                needsService: true,
                serviceType,
                serviceDate,
                serviceTimeFrom,
                serviceTimeTo,
                serviceDuration
              }
            : pet
        )
      );
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
