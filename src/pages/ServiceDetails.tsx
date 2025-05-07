
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactActions from '@/components/ContactActions';

const ServiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [serviceData, setServiceData] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userInfoStr = localStorage.getItem('zanav_user');
    if (!userInfoStr) {
      navigate('/login');
      return;
    }

    const parsedUserInfo = JSON.parse(userInfoStr);
    setUserInfo(parsedUserInfo);

    // For demo purposes, we'll use a mock service
    const mockServices = [
      {
        id: 1,
        title: 'טיול לפארק',
        providerName: 'דני כהן',
        providerImage: 'https://randomuser.me/api/portraits/men/32.jpg',
        clientName: 'רונית לוי',
        clientImage: 'https://randomuser.me/api/portraits/women/44.jpg',
        petName: 'רקסי',
        petImage: null,
        petType: 'dog',
        status: 'scheduled',
        date: '15/05/2025',
        time: '16:30',
        duration: '45 דקות',
        location: 'פארק הירקון',
        price: 80,
        isPaid: false,
        phoneNumber: '050-1234567',
        serviceType: 'walking',
        petId: '123',
        providerId: 'provider@example.com',
        clientId: 'client@example.com'
      },
      {
        id: 2,
        title: 'טיפול טיפוח',
        providerName: 'תמר גולן',
        providerImage: 'https://randomuser.me/api/portraits/women/68.jpg',
        clientName: 'אמיר כהן',
        clientImage: 'https://randomuser.me/api/portraits/men/55.jpg',
        petName: 'לונה',
        petImage: null,
        petType: 'cat',
        status: 'completed',
        date: '02/05/2025',
        time: '13:00',
        duration: '90 דקות',
        location: null,
        price: 150,
        isPaid: true,
        phoneNumber: '050-9876543',
        serviceType: 'grooming',
        petId: '456',
        providerId: 'provider2@example.com',
        clientId: 'client2@example.com'
      }
    ];
    
    const service = mockServices.find(s => s.id.toString() === id);
    setServiceData(service || null);
    
    // Check if user is the owner of this service
    if (service) {
      const isServiceOwner = parsedUserInfo.userType === 'owner' && service.clientId === parsedUserInfo.email;
      const isServiceProvider = parsedUserInfo.userType === 'provider' && service.providerId === parsedUserInfo.email;
      setIsOwner(isServiceOwner || isServiceProvider);
    }
    
    setLoading(false);
  }, [id, navigate]);

  const handleCancelService = () => {
    // In a real app, this would update the service in the database
    
    toast({
      title: "השירות בוטל",
      description: "השירות בוטל בהצלחה",
      variant: "destructive",
    });
    
    navigate('/dashboard');
  };

  const handleCompleteService = () => {
    // In a real app, this would update the service in the database
    
    toast({
      title: "השירות הושלם",
      description: "השירות הושלם בהצלחה",
    });
    
    navigate('/dashboard');
  };

  const handleConfirmPayment = () => {
    // In a real app, this would update the service in the database
    
    toast({
      title: "התשלום אושר",
      description: "התשלום עבור השירות אושר בהצלחה",
    });
    
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-8 flex items-center justify-center">
          <p className="text-xl">טוען...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!serviceData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-8">
          <div className="container-custom">
            <h1 className="text-3xl font-bold mb-6">לא נמצא שירות</h1>
            <p className="mb-6">השירות המבוקש לא נמצא.</p>
            <Button asChild>
              <Link to="/dashboard">חזרה ללוח הבקרה</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'scheduled': return 'מתוזמן';
      case 'in-progress': return 'בתהליך';
      case 'completed': return 'הושלם';
      case 'cancelled': return 'בוטל';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-amber-100 text-amber-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container-custom max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">{serviceData.title}</h1>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(serviceData.status)}`}>
                  {getStatusLabel(serviceData.status)}
                </span>
                <span className="text-gray-600">• {serviceData.date}, {serviceData.time}</span>
              </div>
            </div>
            
            <Button variant="outline" asChild>
              <Link to="/dashboard">חזרה לדשבורד</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">פרטי השירות</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">תאריך</p>
                        <p className="flex items-center gap-2">
                          <Calendar size={18} className="text-primary" />
                          {serviceData.date}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">שעה ומשך</p>
                        <p className="flex items-center gap-2">
                          <Clock size={18} className="text-primary" />
                          {serviceData.time} ({serviceData.duration})
                        </p>
                      </div>
                      
                      {serviceData.location && (
                        <div className="col-span-2 space-y-1">
                          <p className="text-sm text-gray-500">מיקום</p>
                          <p className="flex items-center gap-2">
                            <MapPin size={18} className="text-primary" />
                            {serviceData.location}
                          </p>
                        </div>
                      )}
                      
                      <div className="col-span-2 space-y-1">
                        <p className="text-sm text-gray-500">תשלום</p>
                        <p className="flex items-center gap-2">
                          <DollarSign size={18} className="text-emerald-600" />
                          <span className="font-bold text-lg">₪{serviceData.price}</span>
                          <span className={`mr-2 px-2 py-0.5 rounded-full text-xs ${serviceData.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {serviceData.isPaid ? 'שולם' : 'לא שולם'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {serviceData.status === 'scheduled' && isOwner && (
                    <div className="pt-4 border-t space-y-4">
                      <h3 className="font-semibold">פעולות</h3>
                      <div className="flex flex-wrap gap-3">
                        {userInfo.userType === 'provider' ? (
                          <Button onClick={handleCompleteService}>
                            סמן כהושלם
                          </Button>
                        ) : (
                          <Button onClick={handleConfirmPayment}>
                            אשר תשלום
                          </Button>
                        )}
                        <Button variant="outline" onClick={handleCancelService}>
                          בטל שירות
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">תיאור השירות</h2>
                  <p>
                    {serviceData.serviceType === 'walking' ? 
                      'טיול באוויר הפתוח עם חיית המחמד שלך. טיפול אישי ומסור במהלך הטיול, כולל מים טריים והשגחה צמודה.' : 
                      serviceData.serviceType === 'grooming' ?
                      'טיפול טיפוח מקיף לחיית המחמד שלך, הכולל רחצה, ייבוש, סירוק, גזירת ציפורניים וטיפול באוזניים.' :
                      serviceData.serviceType === 'sitting' ?
                      'שירותי פנסיון איכותיים לחיית המחמד שלך בבית מאובזר עם חצר גדולה, תשומת לב אישית והרבה אהבה.' :
                      'שירותי אילוף מקצועיים המותאמים אישית לצרכים של חיית המחמד שלך ושלך, עם דגש על חיזוק חיובי ושיטות עבודה עדכניות.'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              {userInfo.userType === 'owner' ? (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">פרטי נותן השירות</h2>
                    <div className="flex items-center gap-3 mb-4">
                      {serviceData.providerImage && (
                        <div className="w-16 h-16 rounded-full overflow-hidden">
                          <img 
                            src={serviceData.providerImage} 
                            alt={serviceData.providerName} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{serviceData.providerName}</p>
                        <p className="text-sm text-gray-500">{serviceData.serviceType}</p>
                      </div>
                    </div>
                    
                    <ContactActions 
                      phoneNumber={serviceData.phoneNumber} 
                      whatsapp={true}
                      size="md"
                      className="w-full"
                    />
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">פרטי הלקוח</h2>
                    <div className="flex items-center gap-3 mb-4">
                      {serviceData.clientImage && (
                        <div className="w-16 h-16 rounded-full overflow-hidden">
                          <img 
                            src={serviceData.clientImage} 
                            alt={serviceData.clientName} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{serviceData.clientName}</p>
                        <p className="text-sm text-gray-500">{serviceData.petName} - {serviceData.petType === 'dog' ? 'כלב' : 'חתול'}</p>
                      </div>
                    </div>
                    
                    <ContactActions 
                      phoneNumber={serviceData.phoneNumber} 
                      whatsapp={true}
                      size="md"
                      className="w-full"
                    />
                  </CardContent>
                </Card>
              )}
              
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">מידע נוסף</h2>
                  <p className="text-sm text-gray-600">
                    לשאלות נוספות ומידע על השירות, אנא צור קשר עם {userInfo.userType === 'owner' ? 'נותן השירות' : 'הלקוח'}.
                  </p>
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

export default ServiceDetails;
