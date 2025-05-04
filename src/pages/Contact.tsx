
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, MapPin, Send, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "הודעה נשלחה! 🎉",
        description: "תודה על פנייתך. נחזור אליך בהקדם!",
      });
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">צרו קשר 📱</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              אנחנו כאן לענות על כל שאלה, להקשיב להצעות ולשמוע מה בליבכם
            </p>
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="section bg-white">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold mb-6">שלחו לנו הודעה 💌</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 font-medium">שם מלא</label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="השם המלא שלך"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block mb-2 font-medium">אימייל</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="האימייל שלך"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block mb-2 font-medium">נושא</label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="במה נוכל לעזור?"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block mb-2 font-medium">הודעה</label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="פרט את הודעתך כאן"
                      rows={5}
                    />
                  </div>
                  
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                      <>שולח הודעה...</>
                    ) : (
                      <>
                        <Send className="ml-2 h-4 w-4" />
                        שליחת הודעה
                      </>
                    )}
                  </Button>
                </form>
              </div>
              
              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold mb-6">פרטי התקשרות ☎️</h2>
                
                <div className="space-y-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex gap-4 items-start">
                        <div className="bg-primary/20 p-3 rounded-full">
                          <Phone className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-1">טלפון</h3>
                          <p className="text-lg">03-1234567</p>
                          <p className="text-sm text-gray-500">זמינים: א'-ה' 09:00-18:00</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex gap-4 items-start">
                        <div className="bg-secondary/20 p-3 rounded-full">
                          <Mail className="h-6 w-6 text-secondary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-1">אימייל</h3>
                          <p className="text-lg">info@zanav.plus</p>
                          <p className="text-sm text-gray-500">נשתדל להגיב תוך 24 שעות</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex gap-4 items-start">
                        <div className="bg-accent/20 p-3 rounded-full">
                          <MapPin className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-1">כתובת</h3>
                          <p className="text-lg">רוטשילד 58, תל אביב</p>
                          <p className="text-sm text-gray-500">קומה 3, משרד 302</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex gap-4 items-start">
                        <div className="bg-green-100 p-3 rounded-full">
                          <MessageSquare className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-1">ווטסאפ</h3>
                          <p className="text-lg">054-1234567</p>
                          <a 
                            href="https://wa.me/9721234567" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-500 hover:underline flex items-center mt-2"
                          >
                            פתיחת צ'אט וואטסאפ
                            <Send className="mr-2 h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section bg-gradient-to-b from-purple-50 to-white">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-10 text-center">שאלות נפוצות ❓</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-2">איך אני מצטרף/ת כנותן/ת שירות?</h3>
                  <p>הרשמו באתר ובחרו באפשרות "אני נותן שירות". לאחר מכן תעברו תהליך אימות קצר ותוכלו להתחיל לקבל לקוחות.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-2">איך אני יודע/ת שנותני השירות אמינים?</h3>
                  <p>כל נותני השירות עוברים תהליך אימות הכולל בדיקת זהות, המלצות ובחלק מהמקרים גם ראיון אישי.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-2">איך מתבצע התשלום?</h3>
                  <p>התשלום מתבצע דרך האפליקציה באופן מאובטח. אנחנו מעבירים את התשלום לנותן השירות רק לאחר השלמת השירות.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-2">האם יש ביטוח לשירותים?</h3>
                  <p>כן, כל השירותים המוצעים דרך זנב+ מכוסים בביטוח למקרה של תקלות או בעיות בלתי צפויות.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
