
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dog, Cat, Plus, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PetCard from '@/components/PetCard';
import { useToast } from '@/hooks/use-toast';

type Pet = {
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

const MyPets = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [petType, setPetType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // Check if user is logged in
    const userInfoStr = localStorage.getItem('zanav_user');
    if (!userInfoStr) {
      navigate('/login');
      return;
    }

    const parsedUserInfo = JSON.parse(userInfoStr);
    setUserInfo(parsedUserInfo);

    // Get pet data from localStorage
    const petsStr = localStorage.getItem('zanav_pets');
    if (petsStr) {
      const allPets = JSON.parse(petsStr);
      const userPets = allPets.filter((pet: Pet) => pet.ownerId === parsedUserInfo.email);
      setPets(userPets);
    }
  }, [navigate]);

  const handleRequestService = (petId: string, serviceType: string) => {
    // Update the pet in state
    const updatedPets = pets.map(pet => {
      if (pet.id === petId) {
        return { ...pet, needsService: true, serviceType };
      }
      return pet;
    });
    
    setPets(updatedPets);
    
    // Update localStorage
    const petsStr = localStorage.getItem('zanav_pets');
    if (petsStr) {
      const allPets = JSON.parse(petsStr);
      const updatedAllPets = allPets.map((pet: Pet) => {
        if (pet.id === petId) {
          return { ...pet, needsService: true, serviceType };
        }
        return pet;
      });
      
      localStorage.setItem('zanav_pets', JSON.stringify(updatedAllPets));
    }
    
    toast({
      title: "בקשת שירות נוספה בהצלחה",
      description: "נותני שירות יוכלו כעת לראות את חיית המחמד שלך ולהציע את שירותיהם",
    });
  };

  const filteredPets = pets.filter(pet => {
    const matchesType = petType === 'all' || pet.type === petType;
    const matchesSearch = !searchQuery || 
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pet.breed && pet.breed.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">חיות המחמד שלי 🐾</h1>
              <p className="text-muted-foreground">נהל את חיות המחמד שלך והזמן שירותים</p>
            </div>
            
            <Button asChild className="flex items-center gap-2">
              <Link to="/pet-onboarding">
                <Plus size={18} />
                <span>הוסף חיית מחמד</span>
              </Link>
            </Button>
          </div>
          
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4 md:items-center">
              <div className="relative flex-grow">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="חיפוש לפי שם או גזע..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-9"
                />
              </div>
              
              <Tabs value={petType} onValueChange={setPetType} className="w-full sm:w-auto">
                <TabsList>
                  <TabsTrigger value="all" className="min-w-20">הכל</TabsTrigger>
                  <TabsTrigger value="dog" className="flex items-center gap-2 min-w-20">
                    <Dog size={16} />
                    <span>כלבים</span>
                  </TabsTrigger>
                  <TabsTrigger value="cat" className="flex items-center gap-2 min-w-20">
                    <Cat size={16} />
                    <span>חתולים</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          {filteredPets.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/50">
              {pets.length === 0 ? (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                      <div className="flex">
                        <Dog className="h-12 w-12 text-muted-foreground" />
                        <Cat className="h-12 w-12 text-muted-foreground -ml-4" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    לא נמצאו חיות מחמד
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    נראה שעדיין לא הוספת חיות מחמד לפרופיל שלך
                  </p>
                  <Button asChild>
                    <Link to="/pet-onboarding">
                      <Plus size={18} className="mr-2" />
                      הוסף את חיית המחמד הראשונה שלך
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">לא נמצאו תוצאות</h3>
                  <p className="text-muted-foreground">
                    לא נמצאו חיות מחמד התואמות לחיפוש שלך
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPets.map((pet) => (
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
