
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const serviceFormSchema = z.object({
  serviceType: z.enum(["walking", "sitting", "grooming", "training"], { 
    required_error: "יש לבחור סוג שירות"
  }),
  date: z.date({
    required_error: "יש לבחור תאריך",
  }),
  timeFrom: z.string({
    required_error: "יש לבחור שעת התחלה",
  }),
  timeTo: z.string({
    required_error: "יש לבחור שעת סיום",
  }),
  duration: z.string({
    required_error: "יש לבחור משך זמן",
  }),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

const RequestService = () => {
  const { petId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [pet, setPet] = useState<any | null>(null);
  
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      serviceType: "walking",
      timeFrom: "16:00",
      timeTo: "18:00",
      duration: "30",
    },
  });
  
  useEffect(() => {
    // Check if user is logged in
    const userInfo = localStorage.getItem('zanav_user');
    if (!userInfo) {
      navigate('/login');
      return;
    }
    
    // Get pet data
    const petsStr = localStorage.getItem('zanav_pets');
    if (petsStr) {
      const allPets = JSON.parse(petsStr);
      const foundPet = allPets.find((p: any) => p.id === petId);
      if (foundPet) {
        setPet(foundPet);
      } else {
        navigate('/my-pets');
      }
    } else {
      navigate('/my-pets');
    }
  }, [petId, navigate]);

  const onSubmit = (data: ServiceFormValues) => {
    if (!pet) return;
    
    // Get all pets
    const petsStr = localStorage.getItem('zanav_pets');
    if (!petsStr) return;
    
    const allPets = JSON.parse(petsStr);
    const updatedPets = allPets.map((p: any) => {
      if (p.id === petId) {
        return {
          ...p,
          needsService: true,
          serviceType: data.serviceType,
          serviceDate: format(data.date, 'yyyy-MM-dd'),
          serviceTimeFrom: data.timeFrom,
          serviceTimeTo: data.timeTo,
          serviceDuration: data.duration,
        };
      }
      return p;
    });
    
    // Save updated pets
    localStorage.setItem('zanav_pets', JSON.stringify(updatedPets));
    
    toast({
      title: "בקשת שירות נשלחה בהצלחה",
      description: `בקשה לשירות עבור ${pet.name} נשמרה בהצלחה`,
    });
    
    navigate('/my-pets');
  };

  const serviceTypeOptions = [
    { value: 'walking', label: 'טיולים', emoji: '🐕' },
    { value: 'sitting', label: 'פנסיון', emoji: '🏠' },
    { value: 'grooming', label: 'טיפוח', emoji: '✂️' },
    { value: 'training', label: 'אילוף', emoji: '🎓' },
  ];
  
  const durationOptions = [
    { value: '30', label: '30 דקות' },
    { value: '60', label: '60 דקות' },
    { value: '90', label: '90 דקות' },
    { value: '120', label: '120 דקות' },
  ];
  
  // Generate time options for select
  const generateTimeOptions = () => {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, '0');
      return { value: `${hour}:00`, label: `${hour}:00` };
    });
  };
  
  const timeOptions = generateTimeOptions();

  if (!pet) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-8">
          <div className="container-custom">
            <p className="text-center">טוען...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container-custom max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">בקשת שירות 🐾</h1>
            <p className="text-gray-600">הזמנת שירות עבור {pet.name}</p>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Pet Info */}
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    {pet.image ? (
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                        {pet.type === 'dog' ? '🐶' : '😺'}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{pet.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {pet.breed || pet.type === 'dog' ? 'כלב' : 'חתול'} • גיל {pet.age}
                      </p>
                    </div>
                  </div>
                  
                  {/* Service Type */}
                  <FormField
                    control={form.control}
                    name="serviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>סוג שירות נדרש</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-4"
                          >
                            {serviceTypeOptions.map(service => (
                              <div key={service.value} className="flex items-center space-x-2 space-x-reverse hover:bg-muted p-2 rounded-lg transition-colors">
                                <RadioGroupItem value={service.value} id={`service-${service.value}`} />
                                <FormLabel htmlFor={`service-${service.value}`} className="flex items-center cursor-pointer">
                                  <span className="mr-2">{service.emoji}</span>
                                  <span>{service.label}</span>
                                </FormLabel>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Service Date */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>תאריך</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-right font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "yyyy-MM-dd")
                                ) : (
                                  <span>בחר תאריך</span>
                                )}
                                <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Time Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="timeFrom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>משעה</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="בחר שעת התחלה" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeOptions.map(time => (
                                <SelectItem key={time.value} value={time.value}>
                                  {time.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="timeTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>עד שעה</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="בחר שעת סיום" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeOptions.map(time => (
                                <SelectItem key={time.value} value={time.value}>
                                  {time.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Duration */}
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>משך זמן</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="בחר משך זמן" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {durationOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          משך זמן השירות בכל פעם
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">שלח בקשת שירות</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RequestService;
