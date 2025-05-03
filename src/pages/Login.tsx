
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Dog } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Login = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      toast({
        title: "שגיאה",
        description: "יש למלא את כל השדות",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically authenticate with your backend
    console.log('Login data:', formData);
    
    toast({
      title: "התחברות הצליחה!",
      description: "ברוכים השבים לזאנב+",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Dog className="h-12 w-12 text-zanav-blue" />
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
            
            <Button type="submit" className="w-full bg-zanav-blue hover:bg-zanav-blue/90">
              התחברות
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
