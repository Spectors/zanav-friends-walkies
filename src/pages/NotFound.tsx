
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dog, Home, Cat } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center bg-gradient-to-b from-purple-50 to-white py-16">
        <div className="container-custom text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="flex gap-4">
                <Dog className="h-24 w-24 text-primary animate-bounce" />
                <Cat className="h-24 w-24 text-secondary animate-bounce" style={{ animationDelay: "0.5s" }} />
              </div>
              <span className="absolute top-0 right-0 text-4xl">❓</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">404</h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">אופס! הדף שחיפשת לא נמצא 🐾</p>
          
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            נראה שהכלב והחתול ברחו עם הדף שחיפשת! אל דאגה, יש לנו הרבה דפים נהדרים אחרים שתוכל לבקר בהם.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/">
              <Button size="lg" className="flex items-center gap-2">
                <Home className="ml-2" /> 
                חזרה לדף הבית
              </Button>
            </Link>
            
            <Link to="/contact">
              <Button variant="outline" size="lg">דווח על בעיה</Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
