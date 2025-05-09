import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Dog, Cat, Upload, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

const petFormSchema = z.object({
  name: z.string().min(2, { message: "שם חיית המחמד חייב להכיל לפחות 2 תווים" }),
  age: z.string().min(1, { message: "גיל חיית המחמד נדרש" }),
  type: z.enum(["dog", "cat"], { message: "יש לבחור סוג חיית מחמד" }),
  breed: z.string().optional(),
  description: z.string().optional(),
});

type PetFormValues = z.infer<typeof petFormSchema>;

const PetOnboarding = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [petImage, setPetImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const form = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: "",
      age: "",
      type: "dog",
      breed: "",
      description: "",
    },
  });
  
  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        navigate('/login');
        return;
      }
      
      setUserId(data.session.user.id);
      
      // Check if user is an owner
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.session.user.id)
        .single();
      
      if (error || (userData && userData.role !== 'owner')) {
        // If not an owner, redirect to dashboard
        navigate('/dashboard');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const onSubmit = async (data: PetFormValues) => {
    if (!userId) return;
    
    setIsUploading(true);
    
    try {
      let imageUrl = null;
      
      // If there's an image, upload it to Supabase Storage
      if (petImage) {
        // Convert base64 to file
        const base64Response = await fetch(petImage);
        const blob = await base64Response.blob();
        const file = new File([blob], `pet-${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        // Upload to Supabase storage
        const { data: storageData, error: storageError } = await supabase.storage
          .from('pets')
          .upload(`images/${userId}/${file.name}`, file);
        
        if (storageError) throw storageError;
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('pets')
          .getPublicUrl(storageData.path);
        
        imageUrl = urlData.publicUrl;
      }
      
      // Insert pet into database
      const { data: petData, error } = await supabase
        .from('pets')
        .insert({
          owner_id: userId,
          name: data.name,
          age: parseInt(data.age, 10) || 0,
          species: data.type as 'dog' | 'cat',
          gender: null, // Not collected in the form
          description: data.description || null,
          image_url: imageUrl
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: `${data.name} נוסף בהצלחה! 🎉`,
        description: "פרטי חיית המחמד נשמרו",
      });
      
      navigate('/my-pets');
    } catch (error: any) {
      toast({
        title: "שגיאה בהוספת חיית המחמד",
        description: error.message || "אירעה שגיאה בשמירת פרטי חיית המחמד",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a file reader to read the image
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPetImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">הוספת חיית מחמד 🐾</h1>
            <p className="text-gray-600">ספר/י לנו קצת על חיית המחמד שלך</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Pet Image Upload */}
              <div className="text-center">
                <div className="mb-4 flex flex-col items-center">
                  <div 
                    className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-primary mb-2"
                    style={{
                      backgroundImage: petImage ? `url(${petImage})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {!petImage && <Upload size={40} className="text-muted-foreground" />}
                  </div>
                  <label htmlFor="pet-image" className="cursor-pointer text-primary hover:text-primary/90 flex items-center gap-1">
                    <Upload size={16} />
                    <span>העלה/י תמונה</span>
                  </label>
                  <input 
                    id="pet-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
              
              {/* Pet Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>שם חיית המחמד</FormLabel>
                    <FormControl>
                      <Input placeholder="לדוגמה: רקסי" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Pet Age */}
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>גיל (שנים)</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="לדוגמה: 3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Pet Type Selection */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>סוג חיית מחמד</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="dog" id="dog" />
                          <FormLabel htmlFor="dog" className="flex items-center cursor-pointer">
                            <Dog size={18} className="ml-2" />
                            <span>כלב 🐶</span>
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="cat" id="cat" />
                          <FormLabel htmlFor="cat" className="flex items-center cursor-pointer">
                            <Cat size={18} className="ml-2" />
                            <span>חתול 😺</span>
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Pet Breed */}
              <FormField
                control={form.control}
                name="breed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>גזע (אופציונלי)</FormLabel>
                    <FormControl>
                      <Input placeholder="לדוגמה: לברדור" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Pet Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>תיאור (אופציונלי)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="ספר לנו קצת על האופי של חיית המחמד שלך..." 
                        {...field} 
                        className="min-h-24"
                      />
                    </FormControl>
                    <FormDescription>
                      מידע שיעזור לנותני השירות להכיר את חיית המחמד שלך
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isUploading}
              >
                {isUploading ? '⏳ מעלה פרטים...' : '🐾 הוספת חיית המחמד'}
              </Button>
            </form>
          </Form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PetOnboarding;
