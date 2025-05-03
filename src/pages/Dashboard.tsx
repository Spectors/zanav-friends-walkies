
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Calendar, Clock, ArrowRight, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceMap from '@/components/ServiceMap';

// Sample data - in a real app this would come from an API
const dogServices = [
  {
    id: 1,
    owner: "רונית לוי",
    dogName: "מקס",
    dogBreed: "גולדן רטריבר",
    serviceType: "טיולים",
    location: "תל אביב, דיזנגוף 112",
    coordinates: [34.775, 32.0853],
    date: "03/05/2025",
    time: "16:00",
    duration: 45,
    notes: "מקס אוהב לרוץ בפארק, יש להביאו חזרה עד 17:00",
    status: "pending",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1024"
  },
  {
    id: 2,
    owner: "דני כהן",
    dogName: "רוקי",
    dogBreed: "לברדור",
    serviceType: "פנסיון",
    location: "רמת גן, ביאליק 21",
    coordinates: [34.8117, 32.0823],
    date: "05/05/2025 - 07/05/2025",
    time: "08:00",
    duration: 72 * 60,
    notes: "רוקי צריך לקחת תרופה בבוקר. יש אוכל מיוחד בתיק שלו.",
    status: "pending",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1024"
  },
  {
    id: 3,
    owner: "מיכל אברהם",
    dogName: "בלה",
    dogBreed: "פודל",
    serviceType: "טיפוח",
    location: "הרצליה, הנשיא 15",
    coordinates: [34.8372, 32.1649],
    date: "04/05/2025",
    time: "11:00",
    duration: 120,
    notes: "בלה צריכה תספורת קצרה, מקלחת וגזירת ציפורניים",
    status: "pending",
    image: "https://images.unsplash.com/photo-1599406580262-5071136ca0ce?q=80&w=1024"
  },
  {
    id: 4,
    owner: "יוסי מזרחי",
    dogName: "לולה",
    dogBreed: "פיטבול",
    serviceType: "אילוף",
    location: "חולון, הבנים 50",
    coordinates: [34.7805, 32.0171],
    date: "06/05/2025",
    time: "09:30",
    duration: 60,
    notes: "לולה צריכה לעבוד על פקודות בסיסיות ועל הליכה ברצועה",
    status: "pending",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1024"
  }
];

// Sample service requests that the provider has taken
const myServices = [
  {
    id: 101,
    owner: "רחל גרין",
    dogName: "נובי",
    dogBreed: "שיצו",
    serviceType: "טיולים",
    location: "תל אביב, בן גוריון 45",
    coordinates: [34.7818, 32.0853],
    date: "03/05/2025",
    time: "12:30",
    duration: 30,
    notes: "נובי זקוק לטיול קצר בצהריים",
    status: "active",
    trackingData: [
      [34.7818, 32.0853],
      [34.7822, 32.0860],
      [34.7830, 32.0865],
      [34.7835, 32.0870],
    ],
    image: "https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?q=80&w=1024"
  },
  {
    id: 102,
    owner: "שירה לוין",
    dogName: "טוני",
    dogBreed: "קוקר ספניאל",
    serviceType: "טיולים",
    location: "רמת גן, השלום 12",
    coordinates: [34.8171, 32.0776],
    date: "02/05/2025",
    time: "17:00",
    duration: 45,
    notes: "טוני צריך אימון ריצה קלה",
    status: "completed",
    trackingData: [
      [34.8171, 32.0776],
      [34.8180, 32.0780],
      [34.8190, 32.0785],
      [34.8200, 32.0790],
      [34.8210, 32.0795],
      [34.8200, 32.0790],
      [34.8190, 32.0785],
      [34.8180, 32.0780],
      [34.8171, 32.0776]
    ],
    image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?q=80&w=1024"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'owner' | 'provider'>('provider');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('available');
  const [showDialog, setShowDialog] = useState(false);
  const [showTrackingMap, setShowTrackingMap] = useState(false);
  const [trackingService, setTrackingService] = useState<any>(null);

  // Check if user is authenticated
  useEffect(() => {
    const userInfo = localStorage.getItem('zanav_user');
    
    if (!userInfo) {
      navigate('/login');
      return;
    }
    
    try {
      const user = JSON.parse(userInfo);
      setIsLoggedIn(true);
      setUserType(user.userType);
    } catch (error) {
      localStorage.removeItem('zanav_user');
      navigate('/login');
    }
  }, [navigate]);

  const handleTakeService = () => {
    toast({
      title: "השירות התקבל!",
      description: `תיאום פגישה עם ${selectedService.owner} בוצע בהצלחה`,
    });
    
    setShowDialog(false);
  };

  const handleStartTracking = (service: any) => {
    setTrackingService(service);
    setShowTrackingMap(true);
  };

  const handleCompleteService = () => {
    toast({
      title: "השירות הושלם!",
      description: "תודה על השירות המעולה שלך",
    });
    
    setShowTrackingMap(false);
  };

  if (!isLoggedIn) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container-custom py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-8">
            {userType === 'provider' ? 'ניהול שירותים' : 'השירותים שלי'}
          </h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="available">שירותים זמינים</TabsTrigger>
              <TabsTrigger value="mine">השירותים שלי</TabsTrigger>
            </TabsList>
            
            <TabsContent value="available" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dogServices.map((service) => (
                  <Card key={service.id} className="overflow-hidden">
                    <CardHeader className="p-0">
                      <div className="relative h-48">
                        <img 
                          src={service.image} 
                          alt={service.dogName} 
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-3 right-3 bg-zanav-blue">
                          {service.serviceType}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold">{service.dogName}</h3>
                        <span className="text-sm text-gray-500">{service.dogBreed}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-zanav-blue" />
                          <span className="text-sm">{service.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-zanav-blue" />
                          <span className="text-sm">{service.date}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-zanav-blue" />
                          <span className="text-sm">{service.time} • {service.duration < 60 ? `${service.duration} דקות` : `${Math.floor(service.duration / 60)} שעות`}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="font-medium mb-1">הערות:</h4>
                        <p className="text-sm text-gray-600">{service.notes}</p>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-end">
                      <Button 
                        className="bg-zanav-blue" 
                        onClick={() => {
                          setSelectedService(service);
                          setShowDialog(true);
                        }}
                      >
                        קבל שירות
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {dogServices.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">אין שירותים זמינים כרגע</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="mine" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myServices.map((service) => (
                  <Card key={service.id} className="overflow-hidden">
                    <CardHeader className="p-0">
                      <div className="relative h-48">
                        <img 
                          src={service.image} 
                          alt={service.dogName} 
                          className="w-full h-full object-cover"
                        />
                        <Badge 
                          className={`absolute top-3 right-3 ${
                            service.status === 'active' ? 'bg-green-500' : 
                            service.status === 'completed' ? 'bg-gray-500' : 'bg-zanav-blue'
                          }`}
                        >
                          {service.status === 'active' ? 'פעיל' : 
                           service.status === 'completed' ? 'הושלם' : 'ממתין'}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold">{service.dogName}</h3>
                        <span className="text-sm text-gray-500">{service.dogBreed}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-zanav-blue" />
                          <span className="text-sm">{service.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-zanav-blue" />
                          <span className="text-sm">{service.date}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-zanav-blue" />
                          <span className="text-sm">{service.time} • {service.duration < 60 ? `${service.duration} דקות` : `${Math.floor(service.duration / 60)} שעות`}</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-end">
                      {service.status === 'active' && (
                        <Button 
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => handleStartTracking(service)}
                        >
                          עקוב אחר מסלול
                        </Button>
                      )}
                      
                      {service.status === 'completed' && (
                        <Button variant="outline" disabled>
                          <Check className="mr-1" size={16} />
                          הושלם
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {myServices.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">אין שירותים פעילים כרגע</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>קבלת שירות חדש</DialogTitle>
          </DialogHeader>
          
          {selectedService && (
            <div>
              <div className="mb-4 flex items-center gap-3">
                <img 
                  src={selectedService.image} 
                  alt={selectedService.dogName}
                  className="w-16 h-16 rounded-full object-cover" 
                />
                <div>
                  <h3 className="font-bold">{selectedService.dogName}</h3>
                  <p className="text-sm text-gray-500">{selectedService.dogBreed}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <p>
                  <span className="font-medium">סוג שירות:</span> {selectedService.serviceType}
                </p>
                <p>
                  <span className="font-medium">זמן:</span> {selectedService.date}, {selectedService.time}
                </p>
                <p>
                  <span className="font-medium">משך:</span> {selectedService.duration < 60 ? `${selectedService.duration} דקות` : `${Math.floor(selectedService.duration / 60)} שעות`}
                </p>
                <p>
                  <span className="font-medium">מיקום:</span> {selectedService.location}
                </p>
                <p>
                  <span className="font-medium">הערות:</span> {selectedService.notes}
                </p>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">
                אישור קבלת השירות יצור קשר עם בעל הכלב וישלח לו את פרטייך
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              בטל
            </Button>
            <Button className="bg-zanav-blue" onClick={handleTakeService}>
              אשר קבלת שירות
              <ArrowRight className="mr-2" size={16} />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showTrackingMap} onOpenChange={setShowTrackingMap}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>עקוב אחר מסלול הטיול - {trackingService?.dogName}</DialogTitle>
          </DialogHeader>
          
          <div className="flex-grow relative">
            {trackingService && (
              <ServiceMap 
                coordinates={trackingService.coordinates}
                trackingData={trackingService.trackingData}
                isLive={trackingService.status === 'active'}
              />
            )}
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowTrackingMap(false)}>
              סגור
            </Button>
            {trackingService?.status === 'active' && (
              <Button className="bg-green-500" onClick={handleCompleteService}>
                סיים שירות
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
