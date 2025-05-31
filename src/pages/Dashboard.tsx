
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Bell, Users, Heart, MessageCircle } from 'lucide-react';
import PetCard from '@/components/PetCard';
import { mockPets, mockServices } from '@/lib/mockData';

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [selectedPet, setSelectedPet] = useState<string | null>(null);

  // Mock data for user's pets
  const userPets = mockPets.slice(0, 2);
  const upcomingServices = mockServices.slice(0, 3);

  const handleRequestService = (petId: string, serviceType: string) => {
    console.log(`Requesting ${serviceType} for pet ${petId}`);
  };

  const recentActivity = [
    { id: 1, type: 'vaccination', message: 'חיסון שנתי לבלה - מתוזמן למחר', time: '1 שעה', icon: Calendar },
    { id: 2, type: 'community', message: 'פוסט חדש בקהילה - "טיפים לאילוף גורים"', time: '2 שעות', icon: MessageCircle },
    { id: 3, type: 'service', message: 'הטיפוח של מקס הושלם בהצלחה', time: '1 יום', icon: Bell },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          שלום, {profile?.full_name || 'משתמש'}! 👋
        </h1>
        <p className="text-gray-600">ברוך הבא לזנב+ - כאן תוכל לנהל את כל מה שקשור לחיות המחמד שלך</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Heart className="h-8 w-8 text-red-500" />
                  <div className="mr-4">
                    <p className="text-2xl font-bold">{userPets.length}</p>
                    <p className="text-sm text-gray-600">החיות שלי</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-blue-500" />
                  <div className="mr-4">
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-sm text-gray-600">פגישות השבוע</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-500" />
                  <div className="mr-4">
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-sm text-gray-600">בקהילה</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My Pets Section */}
          <Card>
            <CardHeader>
              <CardTitle>החיות שלי</CardTitle>
              <CardDescription>ניהול מהיר של חיות המחמד שלך</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userPets.map((pet) => (
                  <div key={pet.id} className="border rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={pet.image || '/placeholder.svg'}
                        alt={pet.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{pet.name}</h3>
                        <p className="text-sm text-gray-600">{pet.breed}</p>
                        <div className="flex space-x-2 mt-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRequestService(pet.id, 'grooming')}
                          >
                            טיפוח
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRequestService(pet.id, 'walking')}
                          >
                            הליכה
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button className="w-full">הוסף חיה חדשה</Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Services */}
          <Card>
            <CardHeader>
              <CardTitle>שירותים קרובים</CardTitle>
              <CardDescription>הפגישות והטיפולים הקרובים שלך</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingServices.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-gray-600">מחר, 14:00</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">תל אביב</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>פעילות אחרונה</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <IconComponent className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>פעולות מהירות</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                קבע פגישה חדשה
              </Button>
              <Button className="w-full" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                הצטרף לקהילה
              </Button>
              <Button className="w-full" variant="outline">
                <MapPin className="h-4 w-4 mr-2" />
                מצא שירותים קרובים
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
