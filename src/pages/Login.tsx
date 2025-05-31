
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2, UserCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הזן כתובת אימייל",
        variant: "destructive",
      });
      return;
    }

    if (!password.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הזן סיסמה",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        let errorMessage = "שגיאה בהתחברות";
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "אימייל או סיסמה שגויים";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "יש לאמת את כתובת האימייל";
        } else {
          errorMessage = error.message;
        }
        
        toast({
          title: "שגיאה בהתחברות",
          description: errorMessage,
          variant: "destructive",
        });
      }
      // Success handled in useAuth with redirect
    } catch (error) {
      toast({
        title: "שגיאה בהתחברות",
        description: "אירעה שגיאה לא צפויה",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    
    try {
      // Create a temporary guest account
      const guestEmail = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}@demo.zanav.com`;
      const guestPassword = 'demo123456';
      const guestName = 'משתמש אורח';

      console.log('Creating guest user...');
      const { error } = await signUp(guestEmail, guestPassword, guestName);
      
      if (error) {
        console.error('Guest signup error:', error);
        toast({
          title: "שגיאה ביצירת משתמש אורח",
          description: "לא ניתן ליצור משתמש אורח כרגע",
          variant: "destructive",
        });
      } else {
        console.log('Guest user created successfully');
        toast({
          title: "נכנסת כאורח!",
          description: "כעת תוכל לטייל באפליקציה",
        });
        // The redirect will be handled by the auth system
      }
    } catch (error) {
      console.error('Unexpected guest login error:', error);
      toast({
        title: "שגיאה ביצירת משתמש אורח",
        description: "אירעה שגיאה לא צפויה",
        variant: "destructive",
      });
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">ברוכים הבאים לזנב+</CardTitle>
          <CardDescription>התחברו לחשבון שלכם או נסו כאורח</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">אימייל</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || guestLoading}
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
                disabled={loading || guestLoading}
                placeholder="הזן סיסמה"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || guestLoading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  מתחבר...
                </>
              ) : (
                'התחבר'
              )}
            </Button>
          </form>
          
          <div className="mt-4 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">או</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleGuestLogin}
              disabled={loading || guestLoading}
            >
              {guestLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  יוצר אורח...
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  היכנס כאורח
                </>
              )}
            </Button>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              אין לך חשבון?{' '}
              <Link to="/register" className="text-primary hover:underline">
                הירשם כאן
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
