
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Heart, User, PawPrint, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { profile, signOut } = useAuth();

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <PawPrint className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">זנב+</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary">
              דף הבית
            </Link>
            <Link to="/my-pets" className="text-gray-700 hover:text-primary">
              החיות שלי
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-primary">
              שירותים
            </Link>
            <Link to="/community" className="text-gray-700 hover:text-primary">
              קהילה
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {profile?.full_name || 'משתמש'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile">הפרופיל שלי</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-pets">החיות שלי</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>
                  התנתק
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/">דף הבית</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-pets">החיות שלי</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/services">שירותים</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/community">קהילה</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
