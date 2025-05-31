
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הזן שם מלא",
        variant: "destructive",
      });
      return;
    }

    if (!email.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הזן כתובת אימייל",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "שגיאה",
        description: "הסיסמה צריכה להיות באורך של לפחות 6 תווים",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Starting signup process...');
      const { error } = await signUp(email, password, fullName);
      
      if (error) {
        console.error('Signup error:', error);
        let errorMessage = "שגיאה לא ידועה";
        
        if (error.message?.includes('User already registered')) {
          errorMessage = "המשתמש כבר רשום במערכת";
        } else if (error.message?.includes('Invalid email')) {
          errorMessage = "כתובת האימייל לא תקינה";
        } else if (error.message?.includes('Password')) {
          errorMessage = "הסיסמה לא תקינה";
        } else if (error.message?.includes('Database error')) {
          errorMessage = "שגיאה בדאטאבייס - נסה שוב מאוחר יותר";
        } else {
          errorMessage = error.message || "שגיאה לא ידועה";
        }
        
        toast({
          title: "שגיאה ברישום",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        console.log('Signup successful');
        toast({
          title: "נרשמת בהצלחה!",
          description: "ניתן כעת להתחבר לחשבון שלך",
        });
        navigate('/login');
      }
    } catch (error) {
      console.error('Unexpected signup error:', error);
      toast({
        title: "שגיאה ברישום",
        description: "אירעה שגיאה לא צפויה",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">הצטרפו לזנב+</CardTitle>
          <CardDescription>צרו חשבון חדש</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">שם מלא</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
                placeholder="הזן שם מלא"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">אימייל</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="example@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">סיסמה</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
                placeholder="לפחות 6 תווים"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  נרשם...
                </>
              ) : (
                'הירשם'
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              יש לך כבר חשבון?{' '}
              <Link to="/login" className="text-primary hover:underline">
                התחבר כאן
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
