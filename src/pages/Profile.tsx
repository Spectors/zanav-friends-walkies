
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    serviceType: 'walking',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userInfoStr = localStorage.getItem('zanav_user');
    if (!userInfoStr) {
      navigate('/login');
      return;
    }

    const parsedUserInfo = JSON.parse(userInfoStr);
    setUserInfo(parsedUserInfo);
    
    // Populate form with existing user data
    setFormData({
      name: parsedUserInfo.name || '',
      email: parsedUserInfo.email || '',
      phoneNumber: parsedUserInfo.phoneNumber || '',
      serviceType: parsedUserInfo.serviceType || 'walking',
    });
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Update user info
    const updatedUserInfo = {
      ...userInfo,
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      serviceType: userInfo.userType === 'provider' ? formData.serviceType : null,
    };
    
    // Store updated user info in localStorage
    localStorage.setItem('zanav_user', JSON.stringify(updatedUserInfo));
    
    // Update pets if user name changed
    const petsStr = localStorage.getItem('zanav_pets');
    if (petsStr && formData.name !== userInfo.name) {
      const allPets = JSON.parse(petsStr);
      const updatedPets = allPets.map((pet: any) => {
        if (pet.ownerId === userInfo.email) {
          return { ...pet, ownerName: formData.name };
        }
        return pet;
      });
      
      localStorage.setItem('zanav_pets', JSON.stringify(updatedPets));
    }
    
    toast({
      title: "הפרופיל עודכן בהצלחה!",
      description: "פרטי המשתמש שלך נשמרו.",
    });
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('zanav_user');
    toast({
      title: "התנתקת בהצלחה",
      description: "להתראות בפעם הבאה!",
    });
    navigate('/login');
  };

  if (!userInfo) {
    return null; // or loading state
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
          
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">שם מלא</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
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
                  <Label htmlFor="phoneNumber">מספר טלפון</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="050-1234567"
                  />
                </div>
                
                {userInfo.userType === 'provider' && (
                  <div className="space-y-2">
                    <Label htmlFor="serviceType">סוג שירות</Label>
                    <Select 
                      value={formData.serviceType} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, serviceType: value }))}
                    >
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
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
