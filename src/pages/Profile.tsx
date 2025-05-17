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
import { supabase, User } from '@/lib/mockData';

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    serviceType: 'walk',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const getUserProfile = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        navigate('/login');
        return;
      }
      
      // Get user profile data
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionData.session.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "שגיאה בטעינת הפרופיל",
          description: error.message,
          variant: "destructive",
        });
        navigate('/login');
        return;
      }
      
      setUserInfo(data);
      
      // Populate form with user data
      setFormData({
        name: data.full_name || '',
        email: data.email || '',
        phoneNumber: data.phone || '',
        serviceType: 'walking', // Default value, can be updated if needed
      });
    };
    
    getUserProfile();
  }, [navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!userInfo) return;
      
      // Update user profile in Supabase
      const { error } = await supabase
        .from('users')
        .update({
          full_name: formData.name,
          phone: formData.phoneNumber
        })
        .eq('id', userInfo.id);
      
      if (error) throw error;
      
      toast({
        title: "הפרופיל עודכן בהצלחה!",
        description: "פרטי המשתמש שלך נשמרו.",
      });
      
      // Update local state
      setUserInfo({
        ...userInfo,
        full_name: formData.name,
        phone: formData.phoneNumber
      });
    } catch (error: any) {
      toast({
        title: "שגיאה בעדכון הפרופיל",
        description: error.message || "אירעה שגיאה בעדכון פרטי המשתמש",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "התנתקת בהצלחה",
        description: "להתראות בפעם הבאה!",
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "שגיאה בהתנתקות",
        description: error.message || "אירעה שגיאה בתהליך ההתנתקות",
        variant: "destructive",
      });
    }
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
                    value={formData.phoneNumber || ''}
                    onChange={handleChange}
                    placeholder="050-1234567"
                  />
                </div>
                
                {userInfo.role === 'giver' && (
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
                        <SelectItem value="walk">טיולים 🐕</SelectItem>
                        <SelectItem value="boarding">פנסיון 🏠</SelectItem>
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
