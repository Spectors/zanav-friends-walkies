import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { mockDatabase } from '@/lib/mockData';

const PetOnboarding = () => {
  const [petName, setPetName] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petType, setPetType] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petDescription, setPetDescription] = useState('');
  const [petImage, setPetImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPetImage(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic validation
      if (!petName || !petAge || !petType || !petBreed) {
        toast({
          title: "שגיאה בשמירת פרטי החיה",
          description: "יש למלא את כל השדות הנדרשים",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Mock the upload process for the profile image
      let imageUrl = "https://placedog.net/500";
      
      if (petImage) {
        // In a real app, we'd upload to storage
        const { data: imageData } = await mockDatabase.storage
          .from('pets')
          .upload(`pet-${Date.now()}`, petImage);
          
        if (imageData) {
          const { data: urlData } = mockDatabase.storage
            .from('pets')
            .getPublicUrl(imageData.path);
            
          if (urlData) {
            imageUrl = urlData.publicUrl;
          }
        }
      }

      // Create pet record in the database
      const { data, error } = await mockDatabase.from('pets').insert({
        name: petName,
        age: petAge,
        type: petType as 'dog' | 'cat',
        breed: petBreed,
        description: petDescription,
        image: imageUrl,
        needs_walking: petType === 'dog',
        owner_id: 'user123' // In a real app, this would be the user's ID
      }).select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "פרטי החיה נשמרו בהצלחה!",
        description: `${petName} נוסף/ה בהצלחה לרשימת החיות שלך`,
      });
      
      // Redirect to my pets page
      navigate('/my-pets');
    } catch (error: any) {
      toast({
        title: "שגיאה בשמירת פרטי החיה",
        description: error.message || "אירעה שגיאה בשמירת פרטי החיה",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">הוספת חיית מחמד</h1>
            <p className="text-gray-600">מלאו את הפרטים כדי להוסיף חיית מחמד חדשה</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="petName">שם החיה</Label>
              <Input
                id="petName"
                name="petName"
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="petAge">גיל החיה</Label>
              <Input
                id="petAge"
                name="petAge"
                type="number"
                value={petAge}
                onChange={(e) => setPetAge(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="petType">סוג החיה</Label>
              <Select value={petType} onValueChange={(value) => setPetType(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="בחר סוג חיה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dog">כלב 🐕</SelectItem>
                  <SelectItem value="cat">חתול 🐈</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="petBreed">גזע החיה</Label>
              <Input
                id="petBreed"
                name="petBreed"
                type="text"
                value={petBreed}
                onChange={(e) => setPetBreed(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="petDescription">תיאור החיה</Label>
              <Textarea
                id="petDescription"
                name="petDescription"
                value={petDescription}
                onChange={(e) => setPetDescription(e.target.value)}
                placeholder="ספרו לנו קצת על החיה שלכם"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="petImage">תמונת החיה</Label>
              <Input
                id="petImage"
                name="petImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-zanav-blue hover:bg-zanav-blue/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'שומר...' : 'שמור'}
            </Button>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PetOnboarding;
