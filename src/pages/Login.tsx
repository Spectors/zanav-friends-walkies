
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Dog, Cat } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [userType, setUserType] = useState('owner');
  const [serviceType, setServiceType] = useState('walking');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Basic validation
    if (!formData.email || !formData.password) {
      toast({
        title: "שגיאה",
        description: "יש למלא את כל השדות",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Create user info based on form data
    const userInfo = {
      email: formData.email,
      userType: userType,
      name: formData.email.split('@')[0],
      serviceType: userType === 'provider' ? serviceType : null,
      phoneNumber: '050-1234567', // Default phone number for demo
    };
    
    // Store user info in localStorage
    localStorage.setItem('zanav_user', JSON.stringify(userInfo));
    
    toast({
      title: "התחברות הצליחה!",
      description: "ברוכים השבים לזאנב+",
    });
    
    setIsLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="flex">
                <Dog className="h-10 w-10 text-zanav-blue" />
                <Cat className="h-10 w-10 text-zanav-blue -ml-2" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">ברוכים השבים</h1>
            <p className="text-gray-600">התחברו לחשבון שלכם</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">דואר אלקטרוני</Label>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">סיסמה</Label>
                <Link to="/forgot-password" className="text-sm text-zanav-blue hover:underline">
                  שכחת סיסמה?
                </Link>
              </div>
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
              <Label>סוג משתמש</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={userType === 'owner' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setUserType('owner')}
                >
                  בעל חיית מחמד
                </Button>
                <Button
                  type="button"
                  variant={userType === 'provider' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setUserType('provider')}
                >
                  נותן שירות
                </Button>
              </div>
            </div>
            
            {userType === 'provider' && (
              <div className="space-y-2">
                <Label htmlFor="serviceType">סוג שירות</Label>
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="בחר סוג שירות" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="walking">טיולים 🐕</SelectItem>
                    <SelectItem value="sitting">פנסיון 🏠</SelectItem>
                    <SelectItem value="grooming">טיפוח ✂️</SelectItem>
                    <SelectItem value="training">אילוף 🎓</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-zanav-blue hover:bg-zanav-blue/90"
              disabled={isLoading}
            >
              {isLoading ? 'מתחבר...' : 'התחברות'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p>
              אין לך חשבון?{' '}
              <Link to="/register" className="text-zanav-blue hover:underline">
                הרשמה
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
