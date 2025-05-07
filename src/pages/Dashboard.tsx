
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dog, Cat, Plus, CalendarDays, Settings, PawPrint, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import PetCard from '@/components/PetCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    // Check if user is logged in
    const userInfoStr = localStorage.getItem('zanav_user');
    if (!userInfoStr) {
      navigate('/login');
      return;
    }

    const parsedUserInfo = JSON.parse(userInfoStr);
    setUserInfo(parsedUserInfo);

    // Get pets data if owner
    if (parsedUserInfo.userType === 'owner') {
      const petsStr = localStorage.getItem('zanav_pets');
      if (petsStr) {
        const allPets = JSON.parse(petsStr);
        const userPets = allPets.filter((pet: any) => pet.ownerId === parsedUserInfo.email);
        setPets(userPets);
      }
    }

    // Get services data from localStorage
    const servicesStr = localStorage.getItem('zanav_services');
    if (servicesStr) {
      const allServices = JSON.parse(servicesStr);
      
      // Filter services based on user type
      let userServices = [];
      if (parsedUserInfo.userType === 'owner') {
        userServices = allServices.filter((service: any) => service.clientId === parsedUserInfo.email);
      } else {
        userServices = allServices.filter((service: any) => service.providerId === parsedUserInfo.email);
      }
      
      setServices(userServices);
    } else {
      // Initialize empty services array in localStorage if it doesn't exist
      localStorage.setItem('zanav_services', JSON.stringify([]));
    }
  }, [navigate]);

  const getRecentPets = () => {
    return pets.slice(0, 2); // Get most recent 2 pets
  };
  
  const handleRequestService = (petId: string, serviceType: string) => {
    // Find the pet to update
    const petsStr = localStorage.getItem('zanav_pets');
    if (petsStr) {
      const allPets = JSON.parse(petsStr);
      const updatedPets = allPets.map((pet: any) => {
        if (pet.id === petId) {
          return {
            ...pet,
            needsService: true,
            serviceType: serviceType
          };
        }
        return pet;
      });
      
      // Update localStorage
      localStorage.setItem('zanav_pets', JSON.stringify(updatedPets));
      
      // Update state
      const userPets = updatedPets.filter((pet: any) => pet.ownerId === userInfo.email);
      setPets(userPets);
    }
  };

  if (!userInfo) {
    return null; // or loading state
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">שלום, {userInfo.name}! 👋</h1>
              <p className="text-muted-foreground">ברוך הבא ללוח הבקרה שלך</p>
            </div>
            
            {userInfo.userType === 'owner' ? (
              <Button asChild className="flex items-center gap-2">
                <Link to="/pet-onboarding">
                  <Plus size={18} />
                  <span>הוסף חיית מחמד</span>
                </Link>
              </Button>
            ) : (
              <Button asChild className="flex items-center gap-2">
                <Link to="/available-pets">
                  <PawPrint size={18} />
                  <span>חיות מחמד שצריכות שירות</span>
                </Link>
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Services Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">השירותים שלי</h2>
                  <Button asChild variant="outline" size="sm">
                    <Link to={userInfo.userType === 'owner' ? '/services' : '/my-services'}>
                      הצג הכל
                    </Link>
                  </Button>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="upcoming">הקרובים</TabsTrigger>
                    <TabsTrigger value="past">היסטוריה</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upcoming">
                    {services.filter(s => s.status === 'scheduled' || s.status === 'pending').length === 0 ? (
                      <Card>
                        <CardContent className="py-10 text-center">
                          <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">אין שירותים מתוזמנים</h3>
                          <p className="text-muted-foreground mb-6">
                            {userInfo.userType === 'owner' 
                              ? 'עדיין לא הזמנת שירותים'
                              : 'אין לך שירותים מתוזמנים כרגע'
                            }
                          </p>
                          <Button asChild>
                            <Link to={userInfo.userType === 'owner' ? '/services' : '/available-pets'}>
                              {userInfo.userType === 'owner' ? 'מצא שירותים' : 'מצא חיות מחמד שצריכות שירות'}
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        {services
                          .filter(service => service.status === 'scheduled' || service.status === 'pending')
                          .map(service => (
                            <ServiceCard 
                              key={service.id} 
                              service={service} 
                              viewType={userInfo.userType === 'owner' ? 'animalOwner' : 'provider'}
                            />
                          ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="past">
                    {services.filter(s => s.status === 'completed' || s.status === 'cancelled').length === 0 ? (
                      <Card>
                        <CardContent className="py-10 text-center">
                          <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">אין היסטוריית שירותים</h3>
                          <p className="text-muted-foreground mb-6">
                            השירותים שהושלמו יופיעו כאן
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        {services
                          .filter(service => service.status === 'completed' || service.status === 'cancelled')
                          .map(service => (
                            <ServiceCard 
                              key={service.id} 
                              service={service} 
                              viewType={userInfo.userType === 'owner' ? 'animalOwner' : 'provider'}
                            />
                          ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            <div className="space-y-8">
              {/* User info card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      {userInfo.userType === 'owner' ? (
                        <div className="flex">
                          <Dog className="h-8 w-8 text-primary" />
                          <Cat className="h-8 w-8 text-primary -ml-2" />
                        </div>
                      ) : (
                        <User className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{userInfo.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {userInfo.userType === 'owner' ? 'בעל חיית מחמד' : 'נותן שירות - ' + userInfo.serviceType}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <p>📧 {userInfo.email}</p>
                    {userInfo.phoneNumber && <p>📱 {userInfo.phoneNumber}</p>}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" className="w-full flex items-center gap-2" asChild>
                      <Link to="/profile">
                        <Settings size={16} />
                        <span>ערוך פרופיל</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Owner specific: Pets section */}
              {userInfo.userType === 'owner' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">חיות המחמד שלי</h2>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/my-pets">
                        הצג הכל
                      </Link>
                    </Button>
                  </div>
                  
                  {pets.length === 0 ? (
                    <Card>
                      <CardContent className="py-6 text-center">
                        <div className="flex justify-center mb-4">
                          <div className="flex">
                            <Dog className="h-10 w-10 text-muted-foreground" />
                            <Cat className="h-10 w-10 text-muted-foreground -ml-2" />
                          </div>
                        </div>
                        <h3 className="font-semibold mb-2">עדיין לא הוספת חיות מחמד</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          הוסף את חיית המחמד הראשונה שלך
                        </p>
                        <Button asChild>
                          <Link to="/pet-onboarding">
                            <Plus size={16} className="mr-2" />
                            הוסף חיית מחמד
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {getRecentPets().map((pet) => (
                        <div key={pet.id}>
                          <PetCard 
                            pet={pet} 
                            viewType="owner" 
                            onRequestService={handleRequestService}
                          />
                        </div>
                      ))}
                      {pets.length > 2 && (
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="/my-pets">
                            הצג את כל חיות המחמד ({pets.length})
                          </Link>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {/* Provider specific: Stats summary */}
              {userInfo.userType === 'provider' && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">סיכום פעילות</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">שירותים השבוע</span>
                        <span className="font-medium">{services.filter(s => s.status === 'scheduled' || s.status === 'pending').length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">שירותים החודש</span>
                        <span className="font-medium">{services.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">הכנסות החודש</span>
                        <span className="font-medium">₪{services
                          .filter(s => s.status === 'completed' && s.isPaid)
                          .reduce((total, s) => total + s.price, 0)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
