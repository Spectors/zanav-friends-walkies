import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Calendar, Clock, ArrowRight, Check, Phone, Shield, Syringe, Dog, Heart, Bell } from 'lucide-react';
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

// Sample user's own dogs data
const myDogs = [
  {
    id: 1,
    name: "רקסי",
    breed: "גולדן רטריבר",
    age: 3,
    weight: 28,
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1024",
    vaccines: [
      { name: "כלבת", dueDate: "05/08/2025", status: "valid" },
      { name: "פרוו", dueDate: "10/06/2025", status: "valid" },
      { name: "דלקת כבד", dueDate: "01/05/2025", status: "due" }
    ],
    insurance: null,
    emergencyContact: "וטרינר חירום תל אביב - 03-1234567"
  },
  {
    id: 2,
    name: "לוסי",
    breed: "שיצו",
    age: 5,
    weight: 8,
    image: "https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?q=80&w=1024",
    vaccines: [
      { name: "כלבת", dueDate: "12/12/2025", status: "valid" },
      { name: "פרוו", dueDate: "11/07/2025", status: "valid" },
      { name: "דלקת כבד", dueDate: "15/09/2025", status: "valid" }
    ],
    insurance: {
      provider: "PetCare",
      plan: "Premium",
      validUntil: "31/12/2025"
    },
    emergencyContact: "וטרינר חירום רמת גן - 03-7654321"
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
  
  // New states for the my dogs section
  const [showVetBookingDialog, setShowVetBookingDialog] = useState(false);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [showMissingDogDialog, setShowMissingDogDialog] = useState(false);
  const [showInsuranceDialog, setShowInsuranceDialog] = useState(false);
  const [selectedDog, setSelectedDog] = useState<any>(null);

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

  // New handlers for the my dogs section
  const handleBookVet = (dog: any) => {
    setSelectedDog(dog);
    setShowVetBookingDialog(true);
  };

  const handleEmergency = (dog: any) => {
    setSelectedDog(dog);
    setShowEmergencyDialog(true);
  };

  const handleReportMissing = (dog: any) => {
    setSelectedDog(dog);
    setShowMissingDogDialog(true);
  };

  const handleInsurance = (dog: any) => {
    setSelectedDog(dog);
    setShowInsuranceDialog(true);
  };

  const handleConfirmVetBooking = () => {
    toast({
      title: "הביקור נקבע!",
      description: `ביקור וטרינר נקבע עבור ${selectedDog.name}`,
    });
    setShowVetBookingDialog(false);
  };

  const handleConfirmEmergency = () => {
    toast({
      title: "קריאת חירום נשלחה!",
      description: "וטרינר חירום יצור איתך קשר בהקדם",
    });
    setShowEmergencyDialog(false);
  };

  const handleConfirmMissingReport = () => {
    toast({
      title: "דיווח נשלח!",
      description: `דיווח על היעדרות ${selectedDog.name} נשלח לרשת המאתרים המקומית`,
    });
    setShowMissingDogDialog(false);
  };

  const handleConfirmInsurance = () => {
    toast({
      title: "בקשה לביטוח נשלחה!",
      description: "נציג חברת הביטוח יצור איתך קשר בהקדם",
    });
    setShowInsuranceDialog(false);
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
              {userType === 'provider' ? (
                <>
                  <TabsTrigger value="available">שירותים זמינים</TabsTrigger>
                  <TabsTrigger value="mine">השירותים שלי</TabsTrigger>
                </>
              ) : (
                <>
                  <TabsTrigger value="available">שירותים זמינים</TabsTrigger>
                  <TabsTrigger value="mine">השירותים שלי</TabsTrigger>
                  <TabsTrigger value="mydogs">הכלבים שלי</TabsTrigger>
                </>
              )}
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

            {/* New Tab Content for My Dogs */}
            <TabsContent value="mydogs" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myDogs.map((dog) => (
                  <Card key={dog.id} className="overflow-hidden">
                    <CardHeader className="p-0">
                      <div className="relative h-48">
                        <img 
                          src={dog.image} 
                          alt={dog.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-3 right-3 bg-green-500">
                          {dog.breed}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold">{dog.name}</h3>
                        <span className="text-sm text-gray-500">{dog.age} שנים</span>
                      </div>
                      
                      {/* Vaccines Section */}
                      <div className="mt-4">
                        <h4 className="font-medium mb-2 flex items-center gap-1">
                          <Syringe size={16} className="text-zanav-blue" />
                          חיסונים
                        </h4>
                        <div className="space-y-1">
                          {dog.vaccines.map((vaccine, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span>{vaccine.name}</span>
                              <Badge className={vaccine.status === 'valid' ? 'bg-green-500' : 'bg-amber-500'}>
                                {vaccine.dueDate}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Insurance Section */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="font-medium mb-2 flex items-center gap-1">
                          <Shield size={16} className="text-zanav-blue" />
                          ביטוח
                        </h4>
                        {dog.insurance ? (
                          <div className="text-sm">
                            <div className="flex justify-between">
                              <span>חברה:</span>
                              <span>{dog.insurance.provider}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>תוכנית:</span>
                              <span>{dog.insurance.plan}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>בתוקף עד:</span>
                              <span>{dog.insurance.validUntil}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">לא קיים ביטוח</div>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex flex-wrap gap-2 justify-end">
                      {/* Emergency Button */}
                      <Button 
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => handleEmergency(dog)}
                      >
                        <Bell size={16} />
                        חירום
                      </Button>
                      
                      {/* Vet Booking Button */}
                      <Button 
                        className="bg-zanav-blue"
                        onClick={() => handleBookVet(dog)}
                      >
                        <Heart size={16} />
                        קביעת תור לוטרינר
                      </Button>
                      
                      {/* More Options */}
                      <div className="w-full flex gap-2 justify-end mt-2">
                        <Button 
                          variant="outline"
                          onClick={() => handleReportMissing(dog)}
                        >
                          <Dog size={16} />
                          דווח על היעדרות
                        </Button>
                        
                        {!dog.insurance && (
                          <Button 
                            variant="outline"
                            onClick={() => handleInsurance(dog)}
                          >
                            <Shield size={16} />
                            רכוש ביטוח
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {myDogs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">לא נמצאו כלבים</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Existing dialogs */}
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
      
      {/* New Dialogs for Dog Management */}
      
      {/* Vet Booking Dialog */}
      <Dialog open={showVetBookingDialog} onOpenChange={setShowVetBookingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>קביעת תור לוטרינר - {selectedDog?.name}</DialogTitle>
            <DialogDescription>
              בחר תאריך ושעה לביקור אצל הוטרינר
            </DialogDescription>
          </DialogHeader>
          
          {selectedDog && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={selectedDog.image} 
                  alt={selectedDog.name}
                  className="w-16 h-16 rounded-full object-cover" 
                />
                <div>
                  <h3 className="font-bold">{selectedDog.name}</h3>
                  <p className="text-sm text-gray-500">{selectedDog.breed}, {selectedDog.age} שנים</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">תאריך</label>
                  <input type="date" className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">שעה</label>
                  <select className="w-full border rounded p-2">
                    <option>09:00</option>
                    <option>10:00</option>
                    <option>11:00</option>
                    <option>12:00</option>
                    <option>13:00</option>
                    <option>14:00</option>
                    <option>15:00</option>
                    <option>16:00</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">סוג ביקור</label>
                <select className="w-full border rounded p-2">
                  <option>בדיקה כללית</option>
                  <option>חיסונים</option>
                  <option>טיפול שיניים</option>
                  <option>בדיקות מעבדה</option>
                  <option>התייעצות</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">הערות</label>
                <textarea className="w-full border rounded p-2 h-20" placeholder="פרט את סיבת הביקור..."></textarea>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVetBookingDialog(false)}>
              בטל
            </Button>
            <Button className="bg-zanav-blue" onClick={handleConfirmVetBooking}>
              אשר תור
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Emergency Dialog */}
      <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-500">קריאת חירום - {selectedDog?.name}</DialogTitle>
            <DialogDescription>
              שירות זה מיועד למקרי חירום בלבד
            </DialogDescription>
          </DialogHeader>
          
          {selectedDog && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <h4 className="font-bold flex items-center gap-2">
                  <Bell size={18} className="text-red-500" />
                  <span>שירות חירום וטרינרי</span>
                </h4>
                <p className="text-sm mt-2">
                  לחיצה על כפתור ה"שלח קריאת חירום" תשלח הודעה לוטרינר החירום הקרוב אליך, 
                  עם פרטי התקשרות ומיקומך הנוכחי.
                </p>
                <div className="mt-3 p-2 bg-white rounded border border-red-100">
                  <p className="text-sm font-medium">איש קשר לחירום:</p>
                  <p className="flex items-center gap-1 mt-1">
                    <Phone size={14} />
                    <span>{selectedDog.emergencyContact}</span>
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">תיאור המקרה</label>
                <textarea 
                  className="w-full border rounded p-2 h-20" 
                  placeholder="תאר בקצרה את מצב החירום..."
                ></textarea>
              </div>
              
              <div className="flex items-center">
                <input type="checkbox" id="share-location" className="mr-2" />
                <label htmlFor="share-location" className="text-sm">
                  שתף את מיקומך הנוכחי עם הוטרינר
                </label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmergencyDialog(false)}>
              בטל
            </Button>
            <Button className="bg-red-500 hover:bg-red-600" onClick={handleConfirmEmergency}>
              שלח קריאת חירום
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Missing Dog Report Dialog */}
      <Dialog open={showMissingDogDialog} onOpenChange={setShowMissingDogDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>דיווח על היעדרות - {selectedDog?.name}</DialogTitle>
            <DialogDescription>
              דווח על כלב שנעלם כדי לקבל עזרה בחיפוש
            </DialogDescription>
          </DialogHeader>
          
          {selectedDog && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <img 
                  src={selectedDog.image} 
                  alt={selectedDog.name}
                  className="w-16 h-16 rounded-full object-cover" 
                />
                <div>
                  <h3 className="font-bold">{selectedDog.name}</h3>
                  <p className="text-sm text-gray-500">{selectedDog.breed}, {selectedDog.age} שנים</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">מתי ראית את הכלב לאחרונה?</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" className="border rounded p-2" />
                  <input type="time" className="border rounded p-2" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">היכן ראית את הכלב לאחרונה?</label>
                <input 
                  type="text" 
                  className="w-full border rounded p-2" 
                  placeholder="כתובת או תיאור המקום"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">פרטים נוספים שעשויים לעזור</label>
                <textarea 
                  className="w-full border rounded p-2 h-20" 
                  placeholder="תאר מה הכלב לבש, מצב רוח אחרון, וכל פרט אחר שעשוי לעזור..."
                ></textarea>
              </div>
              
              <div className="flex items-center">
                <input type="checkbox" id="notify-network" className="mr-2" defaultChecked />
                <label htmlFor="notify-network" className="text-sm">
                  שתף מידע זה עם רשת המאתרים המקומית
                </label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMissingDogDialog(false)}>
              בטל
            </Button>
            <Button className="bg-zanav-blue" onClick={handleConfirmMissingReport}>
              שלח דיווח
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Insurance Dialog */}
      <Dialog open={showInsuranceDialog} onOpenChange={setShowInsuranceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ביטוח לכלב - {selectedDog?.name}</DialogTitle>
            <DialogDescription>
              בחר תכנית ביטוח מתאימה לכלב שלך
            </DialogDescription>
          </DialogHeader>
          
          {selectedDog && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="border rounded-md p-3 cursor-pointer hover:border-blue-300">
                  <h4 className="font-bold">בסיסי</h4>
                  <p className="text-lg font-bold mt-1">₪75<span className="text-sm font-normal">/חודש</span></p>
                  <ul className="text-sm mt-3 space-y-1">
                    <li className="flex items-center gap-1">
                      <Check size={14} className="text-green-500" />
                      <span>ביקורי וטרינר</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <Check size={14} className="text-green-500" />
                      <span>חיסונים שנתיים</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border rounded-md p-3 cursor-pointer hover:border-blue-300 bg-blue-50">
                  <h4 className="font-bold">מורחב</h4>
                  <p className="text-lg font-bold mt-1">₪149<span className="text-sm font-normal">/חודש</span></p>
                  <div className="absolute top-1 right-1">
                    <Badge>הכי פופולרי</Badge>
                  </div>
                  <ul className="text-sm mt-3 space-y-1">
                    <li className="flex items-center gap-1">
                      <Check size={14} className="text-green-500" />
                      <span>כל הכיסוי הבסיסי</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <Check size={14} className="text-green-500" />
                      <span>טיפולי שיניים</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <Check size={14} className="text-green-500" />
                      <span>ניתוחים עד ₪10,000</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border rounded-md p-3 cursor-pointer hover:border-blue-300">
                  <h4 className="font-bold">פרימיום</h4>
                  <p className="text-lg font-bold mt-1">₪249<span className="text-sm font-normal">/חודש</span></p>
                  <ul className="text-sm mt-3 space-y-1">
                    <li className="flex items-center gap-1">
                      <Check size={14} className="text-green-500" />
                      <span>כל הכיסוי המורחב</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <Check size={14} className="text-green-500" />
                      <span>תרופות מרשם</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <Check size={14} className="text-green-500" />
                      <span>ניתוחים ללא הגבלה</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <Check size={14} className="text-green-500" />
                      <span>טיפולים אלטרנטיביים</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">פרטי יצירת קשר</label>
                <input 
                  type="tel" 
                  className="w-full border rounded p-2 mb-2" 
                  placeholder="מספר טלפון"
                />
                <input 
                  type="email" 
                  className="w-full border rounded p-2" 
                  placeholder="אימייל"
                />
              </div>
              
              <div className="flex items-center">
                <input type="checkbox" id="accept-terms" className="mr-2" />
                <label htmlFor="accept-terms" className="text-sm">
                  קראתי והסכמתי לתנאי השירות ומדיניות הפרטיות
                </label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInsuranceDialog(false)}>
              בטל
            </Button>
            <Button className="bg-zanav-blue" onClick={handleConfirmInsurance}>
              המשך לתשלום
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
