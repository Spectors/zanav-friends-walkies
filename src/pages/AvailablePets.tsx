
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dog, Cat, Search, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PetCard from '@/components/PetCard';

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

const AvailablePets = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [petType, setPetType] = useState<string>('all');
  const [serviceType, setServiceType] = useState<string>('all');
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
    
    // Check if user is a provider
    if (parsedUserInfo.userType !== 'provider') {
      navigate('/dashboard');
      return;
    }

    // Get pet data from localStorage
    const petsStr = localStorage.getItem('zanav_pets');
    if (petsStr) {
      const allPets = JSON.parse(petsStr);
      // Only show pets that need service
      const petsNeedingService = allPets.filter((pet: Pet) => pet.needsService === true);
      setPets(petsNeedingService);
    }
  }, [navigate]);

  const filteredPets = pets.filter(pet => {
    const matchesType = petType === 'all' || pet.type === petType;
    const matchesService = serviceType === 'all' || pet.serviceType === serviceType;
    const matchesSearch = !searchQuery || 
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pet.breed && pet.breed.toLowerCase().includes(searchQuery.toLowerCase())) ||
      pet.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesService && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">חיות מחמד שצריכות את השירותים שלך 🌟</h1>
            <p className="text-muted-foreground">מצא חיות מחמד שמחפשות את השירותים שאתה מציע</p>
          </div>
          
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="חיפוש לפי שם חיית מחמד, גזע, או בעלים..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
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
              
              <div className="w-full sm:w-60">
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      <Filter size={16} />
                      <SelectValue placeholder="סוג שירות" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">כל השירותים</SelectItem>
                    <SelectItem value="walking">טיולים 🐕</SelectItem>
                    <SelectItem value="sitting">פנסיון 🏠</SelectItem>
                    <SelectItem value="grooming">טיפוח ✂️</SelectItem>
                    <SelectItem value="training">אילוף 🎓</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                    אין חיות מחמד שצריכות שירות כרגע
                  </h3>
                  <p className="text-muted-foreground">
                    בקרוב תוכל לראות כאן חיות מחמד שמחפשות את השירותים שלך
                  </p>
                </>
              ) : (
                <>
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">לא נמצאו תוצאות</h3>
                  <p className="text-muted-foreground">
                    נסה לשנות את פרמטרי החיפוש כדי למצוא חיות מחמד מתאימות
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPets.map((pet) => (
                <PetCard key={pet.id} pet={pet} viewType="provider" />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AvailablePets;
