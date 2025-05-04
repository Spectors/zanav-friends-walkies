
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, PawPrint, Shield, Phone, Star } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">אודות זנב+ 🐾</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              הפלטפורמה המובילה לחיבור בין בעלי כלבים לנותני שירותים מקצועיים
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="section bg-white">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">הסיפור שלנו 📖</h2>
                <p className="mb-4">
                  זנב+ נולדה מתוך אהבה עזה לכלבים והבנה שבעלי כלבים צריכים פתרון מקיף ונוח לטיפול בחברים הארבע רגליים שלהם.
                </p>
                <p className="mb-4">
                  הקמנו את הפלטפורמה ב-2023 במטרה לחבר בין בעלי כלבים לנותני שירותים איכותיים כמו מטיילי כלבים, מאלפים, וטיפוח - כל זאת במקום אחד ובלחיצת כפתור.
                </p>
                <p>
                  אנחנו מאמינים שכל כלב ראוי לקבל את הטיפול הטוב ביותר, וכל בעל כלב ראוי לשקט נפשי מלא בידיעה שחבר הפרווה שלו בידיים טובות.
                </p>
              </div>
              <div className="bg-purple-100 p-8 rounded-2xl">
                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="bg-primary rounded-full p-2 text-white">
                      <Heart size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-2">אהבה לכלבים ✨</h3>
                      <p>אנחנו מונעים מאהבה אמיתית לכל כלב ובעליו, ורואים בהם חלק ממשפחת זנב+</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="bg-secondary rounded-full p-2 text-white">
                      <Shield size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-2">איכות ובטיחות 🛡️</h3>
                      <p>אנחנו מאמתים כל נותן שירות ומוודאים שרק הטובים ביותר יכולים להצטרף לפלטפורמה</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="bg-accent rounded-full p-2 text-white">
                      <PawPrint size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-2">קהילה תומכת 🤗</h3>
                      <p>אנחנו בונים קהילה שתומכת בבעלי כלבים ומספקת להם את הכלים הדרושים להם</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="section bg-gradient-to-b from-purple-50 to-white">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-10 text-center">הערכים שלנו 💫</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="service-card p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">איכות</h3>
                <p>אנו מחויבים לאיכות בכל נקודת מגע ומבטיחים רק את השירות הטוב ביותר.</p>
              </div>
              
              <div className="service-card p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-2">אמון</h3>
                <p>בניית אמון הוא הבסיס לכל מה שאנחנו עושים. אתם סומכים עלינו בטיפול ביקר לכם מכל.</p>
              </div>
              
              <div className="service-card p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">אכפתיות</h3>
                <p>אנחנו מטפלים בכל כלב כאילו היה שלנו, עם תשומת הלב והאהבה שהם ראויים לה.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="section bg-primary/10">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-6">הצטרפו אלינו עוד היום! 🚀</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              בין אם אתם בעלי כלב שמחפשים שירות איכותי או מקצוענים בתחום הכלבים, יש לנו מקום עבורכם
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="text-lg px-8">הרשמה עכשיו</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="text-lg px-8">צרו קשר</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
