
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceRequestForm from '@/components/ServiceRequestForm';
import PetDetailsCard from '@/components/PetDetailsCard';
import { mockDatabase, Pet, getPets } from '@/lib/mockData';

const DogWalkRequest = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    serviceType: 'walking',
    date: '',
    timeFrom: '',
    timeTo: '',
    duration: '30',
    notes: '',
    location: ''
  });

  useEffect(() => {
    const loadData = async () => {
      // Get current user
      const userString = localStorage.getItem('mock_auth_user');
      if (!userString) {
        navigate('/login');
        return;
      }
      
      const userData = JSON.parse(userString);
      setCurrentUser(userData.user);
      
      if (petId) {
        // Load user's pets to find the selected one
        const userPets = await getPets(userData.user.id);
        const pet = userPets.find(p => p.id === petId);
        
        if (pet) {
          setSelectedPet(pet);
        } else {
          toast({
            title: "שגיאה",
            description: "חיית המחמד לא נמצאה",
            variant: "destructive",
          });
          navigate('/my-pets');
        }
      }
    };
    
    loadData();
  }, [petId, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateDuration = () => {
    if (formData.timeFrom && formData.timeTo) {
      const [fromHour, fromMin] = formData.timeFrom.split(':').map(Number);
      const [toHour, toMin] = formData.timeTo.split(':').map(Number);
      
      const fromMinutes = fromHour * 60 + fromMin;
      const toMinutes = toHour * 60 + toMin;
      
      if (toMinutes > fromMinutes) {
        const duration = toMinutes - fromMinutes;
        setFormData(prev => ({ ...prev, duration: duration.toString() }));
      }
    }
  };

  useEffect(() => {
    calculateDuration();
  }, [formData.timeFrom, formData.timeTo]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!selectedPet || !currentUser) {
        throw new Error('נתונים חסרים');
      }

      // Basic validation
      if (!formData.date || !formData.timeFrom || !formData.timeTo) {
        toast({
          title: "שגיאה בבקשת השירות",
          description: "יש למלא את כל השדות הנדרשים",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Create service request
      const { data, error } = await mockDatabase.from('service_requests').insert({
        petId: selectedPet.id,
        petName: selectedPet.name,
        ownerId: currentUser.id,
        ownerName: currentUser.full_name,
        serviceType: formData.serviceType,
        date: formData.date,
        timeFrom: formData.timeFrom,
        timeTo: formData.timeTo,
        duration: parseInt(formData.duration),
        status: 'pending',
        notes: formData.notes,
        location: formData.location
      }).select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "בקשת השירות נשלחה בהצלחה!",
        description: "מטיילי כלבים יוכלו להגיש הצעות בקרוב",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "שגיאה בשליחת הבקשה",
        description: error.message || "אירעה שגיאה בשליחת בקשת השירות",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/my-pets');
  };

  if (!selectedPet) {
    return <div className="flex items-center justify-center min-h-screen">טוען...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container-custom max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">בקשת שירות טיול</h1>
            <p className="text-muted-foreground">בקש שירות טיול עבור {selectedPet.name}</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ServiceRequestForm
                formData={formData}
                onInputChange={handleInputChange}
                onSelectChange={handleSelectChange}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={isSubmitting}
              />
            </div>
            
            <div>
              <PetDetailsCard
                pet={selectedPet}
                formData={formData}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DogWalkRequest;
