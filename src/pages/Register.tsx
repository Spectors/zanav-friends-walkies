import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Dog, User, PawPrint, Calendar, Heart, Cat } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/mockData';

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(location.search);
  const initialType = searchParams.get('type') || 'owner';
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: initialType as 'owner' | 'provider',
    serviceType: 'walking',
    phoneNumber: '',
    socialMedia: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "שגיאה ❌",
          description: "הסיסמאות אינן תואמות",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Basic validation
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        toast({
          title: "שגיאה ❌",
          description: "יש למלא את כל השדות",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Map userType to Supabase user role
      const role = formData.userType === 'provider' ? 'giver' : 'owner';
      
      // Register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`,
            role: role,
            phone: formData.phoneNumber
          }
        }
      });
      
      if (error) {
        if (error.message === 'Failed to fetch') {
          // Special handling for network errors or mock implementation
          toast({
            title: "מצב הדגמה",
            description: "מערכת ההרשמה פועלת במצב הדגמה. ניתן להמשיך.",
            variant: "default",
          });
          // Simulate successful registration in demo mode
          await createMockUserProfile(role);
          // Redirect based on user type
          if (formData.userType === 'owner') {
            navigate('/pet-onboarding');
          } else {
            navigate('/dashboard');
          }
          return;
        }
        throw error;
      }
      
      toast({
        title: "ההרשמה הושלמה בהצלחה! 🎉",
        description: "ברוכים הבאים לזנב+",
      });
      
      // Redirect based on user type
      if (formData.userType === 'owner') {
        navigate('/pet-onboarding'); // Redirect to pet onboarding for animal owners
      } else {
        navigate('/dashboard'); // Redirect to dashboard for service providers
      }
    } catch (error: any) {
      toast({
        title: "שגיאה בהרשמה",
        description: error.message || "אירעה שגיאה בתהליך ההרשמה",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to create a mock user profile for demo mode
  const createMockUserProfile = async (role: 'owner' | 'giver') => {
    try {
      // In demo mode, create a mock profile in localStorage
      const mockUser = {
        id: 'mock_' + Date.now(),
        full_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phoneNumber,
        role: role,
        is_verified: false,
        profile_image: null,
        created_at: new Date().toISOString()
      };
      
      localStorage.setItem('mock_current_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error("Error creating mock profile:", error);
    }
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, userType: value as 'owner' | 'provider' }));
  };
  
  const handleServiceTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, serviceType: value }));
  };

  // Service type emojis
  const serviceTypes = [
    { value: 'walking', label: 'טיולים', emoji: '🐕' },
    { value: 'sitting', label: 'פנסיון', emoji: '🏠' },
    { value: 'grooming', label: 'טיפוח', emoji: '✂️' },
    { value: 'training', label: 'אילוף', emoji: '🎓' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">הצטרפו לזנב+ 🐾</h1>
            <p className="text-gray-600">צרו חשבון חדש ותתחילו להנות מהשירותים שלנו</p>
          </div>
          
          <Tabs defaultValue={formData.userType} onValueChange={handleTypeChange} className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="owner" className="flex items-center gap-2">
                <PawPrint size={18} />
                <span>בעל חיית מחמד 🐾</span>
              </TabsTrigger>
              <TabsTrigger value="provider" className="flex items-center gap-2">
                <User size={18} />
                <span>נותן שירות 🧑‍💼</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="owner">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">שם פרטי</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">שם משפחה</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">דואר אלקטרוני 📧</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">מספר טלפון 📱</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">סיסמה 🔒</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">אימות סיסמה 🔒</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? '⏳ נרשם...' : '🐾 הרשמה כבעל חיית מחמד'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="provider">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">שם פרטי</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">שם משפחה</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">דואר אלקטרוני 📧</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">מספר טלפון 📱</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    placeholder="לאימות זהות ✓"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="socialMedia">חשבון פייסבוק/אינסטגרם 📱</Label>
                  <Input
                    id="socialMedia"
                    name="socialMedia"
                    value={formData.socialMedia}
                    onChange={handleChange}
                    placeholder="לאימות זהות נוסף ✓"
                  />
                </div>
                
                <div className="space-y-4">
                  <Label>סוג שירות 💼</Label>
                  <div className="bg-muted rounded-xl p-4">
                    <RadioGroup
                      value={formData.serviceType}
                      onValueChange={handleServiceTypeChange}
                      className="grid grid-cols-2 gap-4"
                    >
                      {serviceTypes.map(service => (
                        <div key={service.value} className="flex items-center space-x-2 space-x-reverse hover:bg-white/50 p-2 rounded-lg transition-colors">
                          <RadioGroupItem value={service.value} id={service.value} />
                          <Label htmlFor={service.value} className="flex items-center cursor-pointer">
                            <span className="mr-2">{service.emoji}</span>
                            <span>{service.label}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
                
                <div className="p-3 bg-muted rounded-lg text-sm">
                  <p className="flex items-center gap-1 mb-2">
                    <span>👮‍♂️</span>
                    <span className="font-medium">כל נותני השירות עוברים אימות זהות:</span>
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>אימות מספר טלפון</li>
                    <li>אימות חשבון ברשת חברתית</li>
                    <li>סקירת פרופיל</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">סיסמה 🔒</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">אימות סיסמה 🔒</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? '⏳ נרשם...' : '✨ הרשמה כנותן שירות'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center">
            <p>
              כבר יש לך חשבון?{' '}
              <Link to="/login" className="text-primary hover:underline">
                התחבר/י כאן
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
