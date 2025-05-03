
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Dog, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userInfoStr = localStorage.getItem('zanav_user');
    if (userInfoStr) {
      try {
        const userObj = JSON.parse(userInfoStr);
        setIsLoggedIn(true);
        setUserInfo(userObj);
      } catch (error) {
        console.error('Error parsing user info', error);
        localStorage.removeItem('zanav_user');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('zanav_user');
    setIsLoggedIn(false);
    setUserInfo(null);
    
    toast({
      title: "התנתקות בוצעה בהצלחה",
      description: "להתראות בקרוב!",
    });
    
    navigate('/');
  };

  return (
    <header className="py-4 bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Dog className="h-8 w-8 text-zanav-blue" />
          <span className="text-xl font-bold text-zanav-dark">זאנב+</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/services" className="text-zanav-dark hover:text-zanav-blue transition-colors">
            שירותים
          </Link>
          {isLoggedIn && (
            <Link to="/dashboard" className="text-zanav-dark hover:text-zanav-blue transition-colors">
              לוח בקרה
            </Link>
          )}
          <Link to="/about" className="text-zanav-dark hover:text-zanav-blue transition-colors">
            אודות
          </Link>
          <Link to="/contact" className="text-zanav-dark hover:text-zanav-blue transition-colors">
            צור קשר
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">שלום, {userInfo?.name || 'משתמש'}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {userInfo?.userType === 'provider' ? 'נותן שירות' : 'בעל כלב'}
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
                <Button className="bg-zanav-blue hover:bg-zanav-blue/90">הרשמה</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-zanav-dark p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden py-4 px-4 bg-white border-t">
          <nav className="flex flex-col gap-4">
            <Link
              to="/services"
              className="text-zanav-dark hover:text-zanav-blue transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              שירותים
            </Link>
            {isLoggedIn && (
              <Link
                to="/dashboard"
                className="text-zanav-dark hover:text-zanav-blue transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                לוח בקרה
              </Link>
            )}
            <Link
              to="/about"
              className="text-zanav-dark hover:text-zanav-blue transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              אודות
            </Link>
            <Link
              to="/contact" 
              className="text-zanav-dark hover:text-zanav-blue transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              צור קשר
            </Link>
            
            {isLoggedIn ? (
              <>
                <div className="py-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">שלום, {userInfo?.name || 'משתמש'}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {userInfo?.userType === 'provider' ? 'נותן שירות' : 'בעל כלב'}
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
                  <Button className="w-full justify-center bg-zanav-blue hover:bg-zanav-blue/90">הרשמה</Button>
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
