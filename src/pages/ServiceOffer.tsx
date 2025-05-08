
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Calendar as CalendarLucide, Clock, AlertCircle, MapPin } from 'lucide-react';
import { cn } from "@/lib/utils";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactActions from '@/components/ContactActions';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ServiceOffer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const petId = searchParams.get('petId');
  const [pet, setPet] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [ownerInfo, setOwnerInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    location: '',
    notes: ''
  });

  // Calculate fixed price based on duration
  const getFixedPrice = (duration: string) => {
    const durationInMinutes = parseInt(duration || '30');
    if (durationInMinutes <= 30) return 40;
    if (durationInMinutes <= 60) return 55;
    if (durationInMinutes <= 90) return 70;
    return 85; // For 120 minutes or more
  };

  useEffect(() => {
    // Check if user is logged in
    const userInfoStr = localStorage.getItem('zanav_user');
    if (!userInfoStr) {
      navigate('/login');
      return;
    }

    const parsedUserInfo = JSON.parse(userInfoStr);
    setUserInfo(parsedUserInfo);

    // Verify user is a provider
    if (parsedUserInfo.userType !== 'provider') {
      navigate('/dashboard');
      return;
    }

    // Check if petId exists
    if (!petId) {
      navigate('/available-pets');
      return;
    }

    // Get pet data
    const petsStr = localStorage.getItem('zanav_pets');
    if (petsStr) {
      const allPets = JSON.parse(petsStr);
      const foundPet = allPets.find((p: any) => p.id === petId);
      
      if (!foundPet || !foundPet.needsService) {
        navigate('/available-pets');
        return;
      }

      setPet(foundPet);

      // Get owner information
      const usersStr = localStorage.getItem('zanav_users');
      if (usersStr) {
        const allUsers = JSON.parse(usersStr);
        const owner = allUsers.find((u: any) => u.email === foundPet.ownerId);
        setOwnerInfo(owner);
      }
    }

    setLoading(false);
  }, [navigate, petId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    if (!pet.serviceDate) {
      toast({
        title: "שגיאה",
        description: "לא ניתן להציע שירות - תאריך לא צוין על ידי בעל החיה",
        variant: "destructive",
      });
      return;
    }

    if (!pet.location) {
      toast({
        title: "שגיאה",
        description: "מיקום לא צוין על ידי בעל החיה",
        variant: "destructive",
      });
      return;
    }

    const price = getFixedPrice(pet.serviceDuration);
    
    // Create new service offer
    const newService = {
      id: Date.now(),
      title: `שירות ${pet.serviceType === 'walking' ? 'טיולים' : 
              pet.serviceType === 'sitting' ? 'פנסיון' :
              pet.serviceType === 'grooming' ? 'טיפוח' : 'אילוף'}`,
      providerId: userInfo.email,
      providerName: userInfo.name,
      providerImage: null,
      clientId: pet.ownerId,
      clientName: ownerInfo?.name || pet.ownerName,
      clientImage: null,
      petId: pet.id,
      petName: pet.name,
      petImage: pet.image,
      petType: pet.type,
      status: 'pending', // pending, scheduled, in-progress, completed, cancelled
      date: pet.serviceDate,
      time: pet.serviceTimeFrom,
      timeTo: pet.serviceTimeTo,
      duration: `${pet.serviceDuration || '30'} דקות`,
      location: pet.location,
      notes: formData.notes,
      price: price,
      isPaid: false,
      phoneNumber: userInfo.phoneNumber || '000-0000000',
      serviceType: pet.serviceType
    };

    // Get existing services or create new array
    const servicesStr = localStorage.getItem('zanav_services');
    const services = servicesStr ? JSON.parse(servicesStr) : [];
    
    // Add new service
    services.push(newService);
    
    // Save to localStorage
    localStorage.setItem('zanav_services', JSON.stringify(services));
    
    toast({
      title: "הצעת שירות נשלחה",
      description: "הבקשה נשלחה בהצלחה לבעל החיה",
    });
    
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p>טוען...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow py-8 container-custom">
          <h1 className="text-2xl font-bold mb-4">חיית המחמד לא נמצאה</h1>
          <Button onClick={() => navigate('/available-pets')}>חזרה לחיות זמינות</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const calculatedPrice = getFixedPrice(pet.serviceDuration);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container-custom max-w-4xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">הצעת שירות</h1>
            <p className="text-muted-foreground">הצע שירות ל{pet.name} ולבעלים שלו</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  {!pet.serviceDate && (
                    <Alert className="mb-6 bg-amber-50 text-amber-800 border-amber-200">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>לא צוין תאריך</AlertTitle>
                      <AlertDescription>
                        בעל החיה לא ציין תאריך ושעה מדויקים. אנא צור קשר עם בעל החיה לתיאום.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {!pet.location && (
                    <Alert className="mb-6 bg-amber-50 text-amber-800 border-amber-200">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>לא צוין מיקום</AlertTitle>
                      <AlertDescription>
                        בעל החיה לא ציין מיקום לטיפול. אנא צור קשר עם בעל החיה לתיאום.
                      </AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                      <h3 className="text-lg font-medium text-blue-800 mb-2">פרטי הבקשה המקורית</h3>
                      <div className="space-y-2 text-blue-700">
                        <p className="flex items-center gap-2">
                          <CalendarLucide className="h-4 w-4" />
                          תאריך: {pet.serviceDate || 'לא צוין'}
                        </p>
                        {pet.serviceTimeFrom && pet.serviceTimeTo && (
                          <p className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            זמן: בין {pet.serviceTimeFrom} ל-{pet.serviceTimeTo}
                          </p>
                        )}
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          מיקום: {pet.location || 'לא צוין'}
                        </p>
                        <p className="">משך מבוקש: {pet.serviceDuration || '30'} דקות</p>
                        <p className="font-medium mt-2">מחיר קבוע: ₪{calculatedPrice}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">הערות נוספות</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="הוסף פרטים נוספים על השירות"
                        rows={4}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={!pet.serviceDate || !pet.location}
                    >
                      שלח הצעת שירות
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">פרטי חיית המחמד</h2>
                  <div className="text-center mb-4">
                    {pet.image ? (
                      <div className="w-32 h-32 mx-auto rounded-full overflow-hidden">
                        <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-32 h-32 mx-auto rounded-full bg-muted flex items-center justify-center">
                        <span className="text-4xl">
                          {pet.type === 'dog' ? '🐶' : '😺'}
                        </span>
                      </div>
                    )}
                    <h3 className="mt-2 font-bold text-xl">{pet.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {pet.breed && `${pet.breed}, `}גיל: {pet.age}
                    </p>
                  </div>
                  
                  <div className="bg-muted p-3 rounded-md flex items-center gap-3 mb-4">
                    <span className="text-xl">
                      {pet.serviceType === 'walking' ? '🐕' : 
                       pet.serviceType === 'sitting' ? '🏠' :
                       pet.serviceType === 'grooming' ? '✂️' : '🎓'}
                    </span>
                    <div>
                      <p className="font-medium">סוג שירות מבוקש</p>
                      <p className="text-sm">
                        {pet.serviceType === 'walking' ? 'טיולים' : 
                         pet.serviceType === 'sitting' ? 'פנסיון' :
                         pet.serviceType === 'grooming' ? 'טיפוח' : 'אילוף'}
                      </p>
                    </div>
                  </div>
                  
                  {pet.description && (
                    <div className="mb-4">
                      <p className="font-medium mb-1">על {pet.name}</p>
                      <p className="text-sm">{pet.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">פרטי בעלים</h2>
                  <p className="font-medium">{ownerInfo?.name || pet.ownerName}</p>
                  
                  {ownerInfo?.phoneNumber && (
                    <ContactActions 
                      phoneNumber={ownerInfo.phoneNumber}
                      whatsapp={true} 
                      className="w-full mt-4" 
                      size="md"
                    />
                  )}
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

export default ServiceOffer;
