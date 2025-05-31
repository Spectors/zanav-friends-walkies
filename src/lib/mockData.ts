
import type { Database } from '@/integrations/supabase/types';

// Use the correct Pet type from Supabase
export type Pet = Database['public']['Tables']['pets']['Row'];

// Mock services data
export const mockServices = [
  {
    id: '1',
    name: 'הליכת כלבים',
    description: 'שירות הליכת כלבים מקצועי',
    price: 50,
    provider: { full_name: 'יוסי כהן' },
    location: { address: 'תל אביב' },
    phone: '050-1234567'
  },
  {
    id: '2',
    name: 'טיפוח כלבים',
    description: 'טיפוח מקצועי לכלבים',
    price: 120,
    provider: { full_name: 'רחל לוי' },
    location: { address: 'חיפה' },
    phone: '052-7654321'
  }
];

export const mockServiceTypes = [
  'הליכת כלבים',
  'טיפוח',
  'אילוף',
  'וטרינר',
  'מלונית לחיות'
];

export const mockServiceProviders = [
  {
    id: '1',
    name: 'יוסי כהן',
    title: 'מטייל כלבים מקצועי',
    services: ['טיולים'],
    location: 'תל אביב',
    rating: 4.8,
    reviews: 25,
    phone: '050-1234567',
    image: 'https://placedog.net/400/300',
    petTypes: ['כלבים'],
    availability: 'זמין היום',
    price: 60
  },
  {
    id: '2',
    name: 'רחל לוי',
    title: 'מטפחת חיות מחמד',
    services: ['טיפוח'],
    location: 'חיפה',
    rating: 4.9,
    reviews: 18,
    phone: '052-7654321',
    image: 'https://placedog.net/400/301',
    petTypes: ['כלבים', 'חתולים'],
    availability: 'זמין מחר',
    price: 120
  },
  {
    id: '3',
    name: 'דוד מילר',
    title: 'מדריך אילוף מקצועי',
    services: ['אילוף'],
    location: 'ירושלים',
    rating: 4.7,
    reviews: 32,
    phone: '053-9876543',
    image: 'https://placedog.net/400/302',
    petTypes: ['כלבים'],
    availability: 'זמין השבוע',
    price: 150
  }
];

// Mock database object with proper methods
export const mockDatabase = {
  pets: [] as Pet[],
  
  // Mock storage methods
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => {
        // Mock successful upload
        return {
          data: { path: `${bucket}/${path}` },
          error: null
        };
      },
      getPublicUrl: (path: string) => ({
        data: { publicUrl: `https://mock-storage.com/${path}` }
      })
    })
  },
  
  // Mock database query methods
  from: (table: string) => ({
    insert: (data: any) => ({
      select: async () => {
        if (table === 'pets') {
          const newPet: Pet = {
            ...data,
            id: Date.now().toString(),
            avatar: data.avatar || null,
            birth_date: data.birth_date || null,
            location: data.location || null,
            safe_zone: data.safe_zone || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          mockDatabase.pets.push(newPet);
          return { data: [newPet], error: null };
        }
        if (table === 'service_requests') {
          return { data: [{ ...data, id: Date.now().toString() }], error: null };
        }
        return { data: [], error: null };
      }
    }),
    select: async () => ({ data: mockDatabase.pets, error: null }),
    eq: (column: string, value: any) => ({
      select: async () => {
        const filtered = mockDatabase.pets.filter(pet => pet[column as keyof Pet] === value);
        return { data: filtered, error: null };
      }
    })
  })
};

// Mock function to get pets
export const getPets = async (userId?: string): Promise<Pet[]> => {
  return mockDatabase.pets.filter(pet => !userId || pet.owner_id === userId);
};
