
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PetCard from '@/components/PetCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getPets, Pet } from '@/lib/mockData';

const MyPets = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPets = async () => {
      if (!user) {
        // If no user, show empty state but don't redirect
        setLoading(false);
        return;
      }
      
      try {
        const userPets = await getPets(user.id);
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
    
    loadPets();
  }, [user]);

  const handleAddPet = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/pets/new');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold">החיות שלי</h1>
              <p className="text-muted-foreground">נהל את חיות המחמד שלך</p>
            </div>
            <Button onClick={handleAddPet} className="flex items-center gap-2">
              <Plus size={16} />
              הוסף חיה חדשה
            </Button>
          </div>

          {loading ? (
            <p>טוען...</p>
          ) : !user ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-2">התחבר כדי לראות את החיות שלך</h2>
              <p className="text-muted-foreground mb-6">צריך להתחבר כדי לנהל חיות מחמד</p>
              <Button onClick={() => navigate('/login')}>התחבר</Button>
            </div>
          ) : pets.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-2">אין לך חיות מחמד עדיין</h2>
              <p className="text-muted-foreground mb-6">הוסף את החיה הראשונה שלך כדי להתחיל</p>
              <Button onClick={handleAddPet}>הוסף חיה חדשה</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
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
