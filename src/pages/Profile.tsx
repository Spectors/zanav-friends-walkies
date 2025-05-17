
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User } from '@/lib/mockData';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'owner' as 'owner' | 'giver'
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const getUserProfile = () => {
      try {
        const userString = localStorage.getItem('mock_auth_user');
        if (!userString) {
          navigate('/login');
          return;
        }
        
        const userData = JSON.parse(userString).user;
        
        if (userData) {
          setUser(userData);
          setFormData({
            fullName: userData.full_name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            role: userData.role || 'owner',
          });
        }
      } catch (error) {
        toast({
          title: "שגיאה בטעינת פרופיל",
          description: "לא ניתן לטעון את פרטי הפרופיל שלך",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    getUserProfile();
  }, [navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value as 'owner' | 'giver' }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      if (!user) return;
      
      // Update the user in localStorage
      const userString = localStorage.getItem('mock_auth_user');
      if (!userString) return;
      
      const userData = JSON.parse(userString);
      userData.user = {
        ...userData.user,
        full_name: formData.fullName,
        phone: formData.phone,
        role: formData.role,
      };
      
      localStorage.setItem('mock_auth_user', JSON.stringify(userData));
      
      toast({
        title: "פרופיל עודכן בהצלחה",
        description: "פרטי הפרופיל שלך עודכנו",
      });
    } catch (error) {
      toast({
        title: "שגיאה בעדכון פרופיל",
        description: "לא ניתן לעדכן את פרטי הפרופיל שלך",
        variant: "destructive",
      });
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('mock_auth_user');
    navigate('/login');
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">טוען...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container-custom max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">פרופיל משתמש</h1>
            <p className="text-muted-foreground">עריכת פרטי המשתמש שלך</p>
          </div>
          
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">שם מלא</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="השם המלא שלך"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">דואר אלקטרוני</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-gray-500">
                  לא ניתן לשנות את כתובת הדואר האלקטרוני
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">מספר טלפון</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  placeholder="050-1234567"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">תפקיד</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="בחר תפקיד" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">מנהל</SelectItem>
                    <SelectItem value="giver">מתנדב</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col space-y-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? 'שומר שינויים...' : 'שמירת שינויים'}
                </Button>
                
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleLogout}
                >
                  התנתקות
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
