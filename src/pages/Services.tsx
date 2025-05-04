import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, Calendar, Dog, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ExpandableListItem from '@/components/ExpandableListItem';

// Sample data - in a real app this would come from an API
const serviceProviders = [
  {
    id: 1,
    name: 'יוסי לוי',
    title: 'מטייל כלבים מקצועי',
    rating: 4.9,
    reviews: 127,
    location: 'תל אביב',
    image: 'https://i.pravatar.cc/150?img=11',
    services: ['טיולים'],
    price: 50,
    availability: 'זמין היום'
  },
  {
    id: 2,
    name: 'רותי כהן',
    title: 'מטפלת בכלבים בביתה',
    rating: 4.8,
    reviews: 95,
    location: 'חיפה',
    image: 'https://i.pravatar.cc/150?img=5',
    services: ['פנסיון', 'טיפוח'],
    price: 120,
    availability: 'זמינה ממחר'
  },
  {
    id: 3,
    name: 'דני אברהם',
    title: 'מאלף כלבים מוסמך',
    rating: 5.0,
    reviews: 64,
    location: 'ירושלים',
    image: 'https://i.pravatar.cc/150?img=3',
    services: ['אילוף'],
    price: 200,
    availability: 'זמין השבוע'
  },
  {
    id: 4,
    name: 'מיכל פרץ',
    title: 'מטיילת כלבים ומטפלת',
    rating: 4.7,
    reviews: 83,
    location: 'רמת גן',
    image: 'https://i.pravatar.cc/150?img=9',
    services: ['טיולים', 'פנסיון'],
    price: 60,
    availability: 'זמינה היום'
  },
  {
    id: 5,
    name: 'אלי דוד',
    title: 'ספר כלבים מקצועי',
    rating: 4.6,
    reviews: 42,
    location: 'ראשון לציון',
    image: 'https://i.pravatar.cc/150?img=12',
    services: ['טיפוח'],
    price: 150,
    availability: 'זמין היום'
  },
  {
    id: 6,
    name: 'נועה שלום',
    title: 'מטפלת ומאלפת כלבים',
    rating: 4.9,
    reviews: 56,
    location: 'הרצליה',
    image: 'https://i.pravatar.cc/150?img=23',
    services: ['אילוף', 'טיולים'],
    price: 120,
    availability: 'זמינה ממחר'
  },
];

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProviders = serviceProviders.filter(provider => {
    const matchesSearch = searchTerm === '' || 
      provider.name.includes(searchTerm) || 
      provider.title.includes(searchTerm) || 
      provider.location.includes(searchTerm);
    
    const matchesService = selectedService === '' || 
      provider.services.includes(selectedService);
    
    const matchesLocation = selectedLocation === '' || 
      provider.location === selectedLocation;
    
    return matchesSearch && matchesService && matchesLocation;
  });

  // Get unique locations for the filter
  const locations = Array.from(new Set(serviceProviders.map(p => p.location)));
  
  // Available service types
  const serviceTypes = ['טיולים', 'פנסיון', 'טיפוח', 'אילוף'];

  // Render preview content for service provider items
  const renderProviderPreview = (provider: any) => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <MapPin size={14} className="text-zanav-blue" />
        <span>{provider.location}</span>
      </div>
      <div className="flex items-center gap-1">
        <Star size={14} className="text-amber-500" />
        <span>{provider.rating} ({provider.reviews})</span>
      </div>
    </div>
  );

  // Render expanded content for service provider items
  const renderProviderExpanded = (provider: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <div className="w-full h-48 rounded overflow-hidden mb-4">
          <img 
            src={provider.image} 
            alt={provider.name} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold">{provider.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{provider.title}</p>
        
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={16} className="text-zanav-blue" />
          <span className="text-sm">{provider.location}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <Star size={16} className="text-amber-500" />
          <span className="text-sm">{provider.rating} ({provider.reviews} ביקורות)</span>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {provider.services.map((service: string) => (
            <Badge key={service} variant="outline" className="bg-blue-50 text-zanav-blue border-zanav-blue">
              {service}
            </Badge>
          ))}
        </div>
        
        <div className="mt-4 flex items-center gap-2">
          <Calendar size={16} className="text-green-600" />
          <span className="text-sm text-green-600 font-medium">{provider.availability}</span>
        </div>
      </div>
      
      <div className="flex flex-col justify-between">
        <div>
          <p className="font-bold text-lg mb-2">₪{provider.price} / שעה</p>
          <p className="text-sm text-gray-600">
            מחיר זה כולל את כל השירותים המפורטים. ניתן לשריין תאריך עכשיו ולהנות מטיפול אישי ומקצועי.
          </p>
        </div>
        
        <Link to={`/booking/${provider.id}`} className="mt-4">
          <Button className="w-full">הזמנה</Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Search Banner */}
        <section className="bg-gradient-to-r from-zanav-blue to-blue-500 py-12 text-white">
          <div className="container-custom">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">מצאו את השירות המושלם</h1>
              <p>חפשו בין מגוון נותני שירות איכותיים לכלב שלכם</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Input
                    placeholder="חפשו שם, שירות או מיקום..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="md:w-1/4">
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger>
                    <SelectValue placeholder="סוג שירות" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">כל השירותים</SelectItem>
                    {serviceTypes.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:w-1/4">
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="מיקום" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">כל המיקומים</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-12">
          <div className="container-custom">
            <h2 className="text-2xl font-bold mb-6">
              נמצאו {filteredProviders.length} נותני שירות
            </h2>
            
            <div className="space-y-4">
              {filteredProviders.map((provider) => (
                <ExpandableListItem
                  key={provider.id}
                  title={provider.name}
                  subtitle={provider.title}
                  image={provider.image}
                  badge={
                    <div className="flex gap-1">
                      {provider.services.map((service) => (
                        <Badge key={service} variant="outline" className="bg-blue-50 text-zanav-blue border-zanav-blue">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  }
                  previewContent={renderProviderPreview(provider)}
                  expandedContent={renderProviderExpanded(provider)}
                />
              ))}
            </div>
            
            {filteredProviders.length === 0 && (
              <Card className="overflow-hidden">
                <CardContent className="text-center py-16">
                  <Dog className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold mb-2">לא נמצאו תוצאות</h3>
                  <p className="text-gray-600">נסו שוב עם מסננים אחרים</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;
