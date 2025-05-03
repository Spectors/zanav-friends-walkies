
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, CreditCard, MessageSquare, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// In a real app, this would come from an API call based on the ID
const getDogServiceDetails = (id: string) => {
  // This is hardcoded for demo purposes
  return {
    id: parseInt(id),
    provider: {
      id: 1,
      name: "יוסי לוי",
      image: "https://i.pravatar.cc/150?img=11",
      rating: 4.9,
      reviews: 127,
    },
    dogName: "רקס",
    dogBreed: "גולדן רטריבר",
    serviceType: "טיולים",
    price: 50,
    location: "תל אביב, פארק הירקון",
    description: "טיול לכלב במשך 30-60 דקות, כולל משחקים וריצה. אני אוסף ומחזיר את הכלב לביתך.",
  };
};

const BookingPage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [bookingStep, setBookingStep] = useState(1);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('16:00');
  const [specialRequests, setSpecialRequests] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // In a real app, this would be an API call
  const serviceDetails = serviceId ? getDogServiceDetails(serviceId) : null;
  
  if (!serviceDetails) {
    return <div className="container-custom py-12">השירות המבוקש לא נמצא</div>;
  }

  const handleNextStep = () => {
    window.scrollTo(0, 0);
    setBookingStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    window.scrollTo(0, 0);
    setBookingStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmitBooking = () => {
    setIsLoading(true);
    
    // This would be an API call in a real app
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "ההזמנה בוצעה בהצלחה!",
        description: "הבקשה לטיול נשלחה ליוסי לוי.",
      });
      navigate('/dashboard');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="container-custom py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            הזמנת שירות
          </h1>
          <p className="text-gray-600 mb-6">
            מילוי פרטים להזמנת שירות {serviceDetails.serviceType} עבור {serviceDetails.dogName}
          </p>
          
          {/* Booking Progress */}
          <div className="flex items-center justify-between mb-8 max-w-md">
            <div className={cn(
              "flex flex-col items-center",
              bookingStep >= 1 ? "text-zanav-blue" : "text-gray-400"
            )}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2",
                bookingStep >= 1 ? "border-zanav-blue bg-zanav-blue text-white" : "border-gray-300"
              )}>
                1
              </div>
              <span className="text-sm mt-1">פרטי הזמנה</span>
            </div>
            
            <div className={cn("w-16 h-0.5", bookingStep >= 2 ? "bg-zanav-blue" : "bg-gray-300")} />
            
            <div className={cn(
              "flex flex-col items-center",
              bookingStep >= 2 ? "text-zanav-blue" : "text-gray-400"
            )}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2",
                bookingStep >= 2 ? "border-zanav-blue bg-zanav-blue text-white" : "border-gray-300"
              )}>
                2
              </div>
              <span className="text-sm mt-1">אימות</span>
            </div>
            
            <div className={cn("w-16 h-0.5", bookingStep >= 3 ? "bg-zanav-blue" : "bg-gray-300")} />
            
            <div className={cn(
              "flex flex-col items-center",
              bookingStep >= 3 ? "text-zanav-blue" : "text-gray-400"
            )}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2",
                bookingStep >= 3 ? "border-zanav-blue bg-zanav-blue text-white" : "border-gray-300"
              )}>
                3
              </div>
              <span className="text-sm mt-1">תשלום</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Booking Form */}
            <div className="md:col-span-2">
              <Card>
                {bookingStep === 1 && (
                  <>
                    <CardHeader>
                      <CardTitle>בחירת זמן וכמה פרטים</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="date">תאריך</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-right font-normal",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="ml-2 h-4 w-4" />
                              {date ? format(date, "dd/MM/yyyy") : "בחר תאריך"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="time">שעה</Label>
                        <Select value={time} onValueChange={setTime}>
                          <SelectTrigger>
                            <SelectValue placeholder="בחר שעה" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="08:00">08:00</SelectItem>
                            <SelectItem value="09:00">09:00</SelectItem>
                            <SelectItem value="10:00">10:00</SelectItem>
                            <SelectItem value="11:00">11:00</SelectItem>
                            <SelectItem value="12:00">12:00</SelectItem>
                            <SelectItem value="13:00">13:00</SelectItem>
                            <SelectItem value="14:00">14:00</SelectItem>
                            <SelectItem value="15:00">15:00</SelectItem>
                            <SelectItem value="16:00">16:00</SelectItem>
                            <SelectItem value="17:00">17:00</SelectItem>
                            <SelectItem value="18:00">18:00</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="special-requests">בקשות מיוחדות</Label>
                        <Textarea 
                          id="special-requests"
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                          placeholder="הוראות מיוחדות, בקשות, או דברים שעלינו לדעת..."
                          className="min-h-[100px]"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button onClick={handleNextStep}>
                        המשך לאימות
                      </Button>
                    </CardFooter>
                  </>
                )}
                
                {bookingStep === 2 && (
                  <>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                        אימות זהות
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-4">
                          לצורך אבטחה ובטיחות, אנו צריכים לאמת את זהותך. המידע הזה ישמש רק לצורך בדיקת אמינות ולא יועבר לאף גורם אחר.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">מספר טלפון</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="05X-XXX-XXXX"
                          required
                        />
                        <p className="text-xs text-gray-500">
                          נשתמש בזה לשליחת מסרון אימות
                        </p>
                      </div>
                      
                      <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
                        <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5" />
                          אימות זהות
                        </h4>
                        <p className="text-sm text-blue-700">
                          במערכת אמיתית, כאן היינו שולחים קוד אימות ב-SMS, מבקשים להעלות תעודה מזהה, או משתמשים בשירות אימות צד שלישי.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contact-method">דרך תקשורת מועדפת</Label>
                        <Select defaultValue="phone">
                          <SelectTrigger>
                            <SelectValue placeholder="בחר דרך תקשורת" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="phone">טלפון</SelectItem>
                            <SelectItem value="sms">מסרונים</SelectItem>
                            <SelectItem value="whatsapp">וואטסאפ</SelectItem>
                            <SelectItem value="email">דוא"ל</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={handlePreviousStep}>
                        חזרה
                      </Button>
                      <Button onClick={handleNextStep}>
                        המשך לתשלום
                      </Button>
                    </CardFooter>
                  </>
                )}
                
                {bookingStep === 3 && (
                  <>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-green-500" />
                        תשלום
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-4">
                          התשלום מאובטח ומוגן. החיוב יתבצע רק לאחר אישור השירות על ידי נותן השירות.
                        </p>
                      </div>
                      
                      <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
                        <h4 className="font-medium text-blue-800 mb-2">מערכת תשלומים</h4>
                        <p className="text-sm text-blue-700">
                          במערכת אמיתית, כאן היה מופיע טופס הזנת פרטי כרטיס אשראי מאובטח או אפשרויות תשלום אחרות.
                          התשלום יתבצע באמצעות מערכת כמו Stripe או PayPal.
                        </p>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">מחיר לשעה:</span>
                          <span className="font-medium">₪{serviceDetails.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">משך זמן:</span>
                          <span className="font-medium">שעה אחת</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">מע"מ (17%):</span>
                          <span className="font-medium">₪{Math.round(serviceDetails.price * 0.17)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold">
                          <span>סה"כ לתשלום:</span>
                          <span>₪{serviceDetails.price + Math.round(serviceDetails.price * 0.17)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={handlePreviousStep}>
                        חזרה
                      </Button>
                      <Button 
                        onClick={handleSubmitBooking}
                        disabled={isLoading}
                      >
                        {isLoading ? 'מבצע תשלום...' : 'אישור והזמנה'}
                      </Button>
                    </CardFooter>
                  </>
                )}
              </Card>
            </div>
            
            {/* Service Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>פרטי השירות</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <img 
                      src={serviceDetails.provider.image} 
                      alt={serviceDetails.provider.name} 
                      className="w-16 h-16 rounded-full object-cover" 
                    />
                    <div>
                      <h3 className="font-medium">{serviceDetails.provider.name}</h3>
                      <p className="text-sm text-gray-500">
                        ★ {serviceDetails.provider.rating} ({serviceDetails.provider.reviews} חוות דעת)
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="font-medium">{serviceDetails.serviceType}</div>
                    <p className="text-sm text-gray-600">{serviceDetails.description}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">כלב:</span>
                      <span className="font-medium">{serviceDetails.dogName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">גזע:</span>
                      <span>{serviceDetails.dogBreed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">מיקום:</span>
                      <span>{serviceDetails.location}</span>
                    </div>
                    {date && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">תאריך:</span>
                        <span>{format(date, "dd/MM/yyyy")}</span>
                      </div>
                    )}
                    {time && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">שעה:</span>
                        <span>{time}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Contact Button */}
                  {bookingStep >= 2 && (
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 flex items-center gap-2"
                      disabled
                    >
                      <MessageSquare className="h-4 w-4" />
                      שיחה עם נותן השירות
                    </Button>
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

export default BookingPage;
