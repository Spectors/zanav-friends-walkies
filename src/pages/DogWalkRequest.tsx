import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Calendar, Clock, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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

  // Helper function to calculate age from birth date
  const calculateAge = (birthDate: string | null): number => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

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

  if (!selectedPet) {
    return <div className="flex items-center justify-center min-h-screen">טוען...</div>;
  }

  const petAge = calculateAge(selectedPet.birth_date);

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
              <Card>
                <CardHeader>
                  <CardTitle>פרטי הבקשה</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="serviceType">סוג שירות</Label>
                      <Select 
                        value={formData.serviceType} 
                        onValueChange={(value) => handleSelectChange('serviceType', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="בחר סוג שירות" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="walking">טיול 🐕</SelectItem>
                          <SelectItem value="sitting">פנסיון 🏠</SelectItem>
                          <SelectItem value="grooming">טיפוח ✂️</SelectItem>
                          <SelectItem value="training">אילוף 🎓</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="date">תאריך</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="timeFrom">שעת התחלה</Label>
                        <Input
                          id="timeFrom"
                          name="timeFrom"
                          type="time"
                          value={formData.timeFrom}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="timeTo">שעת סיום</Label>
                        <Input
                          id="timeTo"
                          name="timeTo"
                          type="time"
                          value={formData.timeTo}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="duration">משך זמן (דקות)</Label>
                      <Input
                        id="duration"
                        name="duration"
                        type="number"
                        value={formData.duration}
                        onChange={handleInputChange}
                        min="15"
                        max="240"
                        step="15"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">מיקום</Label>
                      <Input
                        id="location"
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="כתובת או אזור לטיול"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">הערות נוספות</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="הערות מיוחדות או הוראות למטייל"
                        rows={4}
                      />
                    </div>
                    
                    <div className="flex gap-4">
                      <Button 
                        type="submit" 
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'שולח בקשה...' : 'שלח בקשה'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => navigate('/my-pets')}
                      >
                        ביטול
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>פרטי חיית המחמד</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-2xl">
                          {selectedPet.type === 'dog' ? '🐶' : '😺'}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg">{selectedPet.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedPet.breed || 'גזע לא ידוע'} • גיל {petAge}
                      </p>
                    </div>
                    
                    {selectedPet.description && (
                      <div>
                        <h4 className="font-medium mb-2">תיאור</h4>
                        <p className="text-sm text-muted-foreground">{selectedPet.description}</p>
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
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DogWalkRequest;
