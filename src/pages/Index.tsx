
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MapPin, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-16">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              ברוכים הבאים ל<span className="text-primary">זנב+</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              הפלטפורמה המקצועית לבעלי חיות מחמד - כל מה שאתם צריכים למען חיית המחמד שלכם במקום אחד
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/my-pets">החיות שלי</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/services">שירותים</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-12">מה אנחנו מציעים?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>ניהול רפואי</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    רשומות רפואיות, חיסונים ותזכורות למעקב אחר בריאות החיה
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>שירותים מקומיים</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    מצאו וטרינרים, מטפחים, מאלפים ושירותים נוספים באזור שלכם
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>קהילה</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    הצטרפו לקהילת בעלי חיות מחמד, שתפו ולמדו מניסיון אחרים
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>הזמנות</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    קבעו תורים ונהלו הזמנות לשירותים שונים בקלות ובנוחות
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Welcome Section */}
        {profile && (
          <section className="bg-gray-50 py-12">
            <div className="container-custom text-center">
              <h2 className="text-2xl font-bold mb-4">שלום {profile.full_name}!</h2>
              <p className="text-gray-600 mb-6">מוכנים לטפל בחיות המחמד שלכם?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link to="/my-pets">נהל את החיות שלי</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/community">עיין בקהילה</Link>
                </Button>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
