
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">ברוכים הבאים לזנב+</CardTitle>
          <CardDescription>התחברו לחשבון שלכם</CardDescription>
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
                placeholder="הזן סיסמה"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
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
