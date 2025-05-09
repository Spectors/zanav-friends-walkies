import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Dog, LogOut, Phone, Heart, Calendar, PawPrint } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/lib/supabase';
import type { User } from '@/lib/supabase';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    // Check auth state on component mount
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        setIsLoggedIn(true);
        
        // Get user profile info
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
        
        if (!error && userData) {
          setUserInfo(userData);
        }
      }
    };
    
    checkAuth();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsLoggedIn(true);
        
        // Get user profile info
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (!error && userData) {
          setUserInfo(userData);
        }
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    });
    
    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      
      toast({
        title: "התנתקות בוצעה בהצלחה",
        description: "להתראות בקרוב!",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "שגיאה בהתנתקות",
        description: "אנא נסה שוב מאוחר יותר",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="py-4 bg-gradient-to-r from-purple-50 to-pink-50 shadow-sm sticky top-0 z-50">
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Dog className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">זנב+</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/services" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
            <PawPrint size={16} />
            שירותים
          </Link>
          {isLoggedIn && (
            <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
              <Calendar size={16} />
              לוח בקרה
            </Link>
          )}
          <Link to="/about" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
            <Heart size={16} />
            אודות
          </Link>
          <Link to="/contact" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
            <Phone size={16} />
            צור קשר
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">שלום, {userInfo?.full_name.split(' ')[0] || 'משתמש'}</span>
                <span className="text-xs bg-gradient-to-r from-accent/20 to-primary/20 px-2 py-1 rounded">
                  {userInfo?.role === 'giver' ? '🧑‍💼 נותן שירות' : '🐾 בעל כלב'}
                </span>
              </div>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                התנתקות
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="flex items-center gap-2">
                  <User size={18} />
                  התחברות
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-primary hover:bg-primary/90">הרשמה</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden py-4 px-4 bg-white/80 backdrop-blur-sm border-t">
          <nav className="flex flex-col gap-4">
            <Link
              to="/services"
              className="text-foreground hover:text-primary transition-colors py-2 flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <PawPrint size={18} />
              שירותים
            </Link>
            {isLoggedIn && (
              <Link
                to="/dashboard"
                className="text-foreground hover:text-primary transition-colors py-2 flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Calendar size={18} />
                לוח בקרה
              </Link>
            )}
            <Link
              to="/about"
              className="text-foreground hover:text-primary transition-colors py-2 flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart size={18} />
              אודות
            </Link>
            <Link
              to="/contact" 
              className="text-foreground hover:text-primary transition-colors py-2 flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Phone size={18} />
              צור קשר
            </Link>
            
            {isLoggedIn ? (
              <>
                <div className="py-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">שלום, {userInfo?.full_name.split(' ')[0] || 'משתמש'}</span>
                    <span className="text-xs bg-gradient-to-r from-accent/20 to-primary/20 px-2 py-1 rounded">
                      {userInfo?.role === 'giver' ? '🧑‍💼 נותן שירות' : '🐾 בעל כלב'}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full justify-center mt-2"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut size={18} className="ml-2" />
                    התנתקות
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-4">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">התחברות</Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full justify-center bg-primary hover:bg-primary/90">הרשמה</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
