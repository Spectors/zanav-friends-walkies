
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dog, MapPin, Calendar, Users, Cat, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-blue-50 py-16 md:py-24">
          <div className="container-custom grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h1 className="text-4xl md:text-5xl font-bold text-zanav-dark mb-6">
                מצאו את השירות המושלם לחיית המחמד שלכם
              </h1>
              <p className="text-lg mb-8 text-gray-600">
                זנב+ מחברת בין בעלי חיות מחמד לבין מטפלים מקצועיים ואמינים. טיולים, פנסיון, טיפוח ועוד במקום אחד. 🐶😺
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register?type=owner">
                  <Button className="w-full sm:w-auto button-primary">הרשמה כבעל חיית מחמד</Button>
                </Link>
                <Link to="/register?type=provider">
                  <Button variant="outline" className="w-full sm:w-auto border-zanav-blue text-zanav-blue hover:bg-zanav-blue hover:text-white">
                    הרשמה כנותן שירות
                  </Button>
                </Link>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1581888227599-779811939961?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80" 
                alt="כלב וחתול מאושרים" 
                className="rounded-lg shadow-xl max-w-full animate-float"
              />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">השירותים שלנו</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                מגוון רחב של שירותים מקצועיים לחיית המחמד שלך, בהתאמה אישית לצרכים שלה
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "טיולים",
                  description: "טיולים יומיים או קבועים עם מטיילים מנוסים",
                  icon: <Dog className="h-12 w-12 text-zanav-blue mb-4" />,
                  link: "/services/walking"
                },
                {
                  title: "פנסיון",
                  description: "אירוח מלא בבית המטפל כשאתם לא בבית",
                  icon: <MapPin className="h-12 w-12 text-zanav-orange mb-4" />,
                  link: "/services/sitting"
                },
                {
                  title: "טיפוח",
                  description: "שירותי טיפוח, רחצה וטיפולים קוסמטיים",
                  icon: <Users className="h-12 w-12 text-zanav-green mb-4" />,
                  link: "/services/grooming"
                },
                {
                  title: "אילוף",
                  description: "אילוף מקצועי להתנהגות נכונה וציות",
                  icon: <Calendar className="h-12 w-12 text-zanav-blue mb-4" />,
                  link: "/services/training"
                }
              ].map((service, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col items-center text-center">
                    {service.icon}
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <Link to={service.link} className="text-zanav-blue hover:text-zanav-blue/80">
                      קרא עוד &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">איך זה עובד?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                בכמה צעדים פשוטים תוכלו להתחבר למטפלים מקצועיים לחיית המחמד שלכם
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "הרשמה מהירה",
                  description: "הירשמו בקלות, צרו פרופיל לחיית המחמד שלכם עם הצרכים הייחודיים שלה"
                },
                {
                  step: "2",
                  title: "חיפוש שירות",
                  description: "חפשו שירותים לפי מיקום, זמינות, סוג שירות ומחיר"
                },
                {
                  step: "3",
                  title: "הזמנה וקבלת שירות",
                  description: "הזמינו את השירות הרצוי ותיהנו משקט נפשי"
                }
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 h-full">
                    <div className="flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-full bg-zanav-blue text-white flex items-center justify-center text-xl font-bold mb-4">
                        {step.step}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 text-zanav-blue text-4xl font-light">
                      <ArrowLeft size={32} className="text-zanav-blue" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">לקוחות מרוצים</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                מה אומרים עלינו בעלי חיות מחמד שכבר נעזרו בשירותים שלנו
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "דני כהן",
                  image: "https://i.pravatar.cc/150?img=11",
                  text: "מצאתי מטייל מעולה לכלב שלי דרך זנב+. הוא חוזר מאושר ועייף מהטיולים!"
                },
                {
                  name: "מיכל לוי",
                  image: "https://i.pravatar.cc/150?img=5",
                  text: "השירות פשוט מצוין. מצאתי פנסיון מעולה כשיצאנו לחופשה והיה לי שקט נפשי בידיעה שהחתול שלי בידיים טובות."
                },
                {
                  name: "יוסי אברהם",
                  image: "https://i.pravatar.cc/150?img=3",
                  text: "מטפח החיות שמצאתי דרך האתר הוא מקצועי ואדיב. החיות שלי נראות נהדר!"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
                      <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                    <h4 className="font-bold">{testimonial.name}</h4>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/register">
                <Button className="button-primary">הצטרפו עכשיו</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
