
// Using placeholder URL and key for now
const supabaseUrl = 'https://placeholder-project.supabase.co';
const supabaseAnonKey = 'placeholder-key';

// Export types to maintain type safety throughout the application
export interface Pet {
  id: string;
  ownerId: string;
  ownerName: string;
  name: string;
  age: string;
  type: 'dog' | 'cat' | 'other';
  breed: string;
  description: string;
  image: string;
  needsService: boolean;
  serviceType: string;
  createdAt: string;
}

export interface ServiceProvider {
  id: number;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  location: string;
  image: string;
  services: string[];
  price: number;
  availability: string;
  petTypes: string[];
}

// Mock data for development
export const mockPets: Pet[] = [
  {
    id: '1',
    ownerId: 'user1',
    ownerName: 'דני כהן',
    name: 'רקסי',
    age: '3',
    type: 'dog',
    breed: 'לברדור',
    description: 'כלב חברותי מאוד שאוהב לשחק',
    image: '/images/dog1.jpg',
    needsService: false,
    serviceType: '',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    ownerId: 'user1',
    ownerName: 'דני כהן',
    name: 'מיצי',
    age: '2',
    type: 'cat',
    breed: 'חתול רחוב',
    description: 'חתולה שקטה שאוהבת לישון',
    image: '/images/cat1.jpg',
    needsService: false,
    serviceType: '',
    createdAt: new Date().toISOString()
  }
];

export const mockServiceProviders: ServiceProvider[] = [
  {
    id: 1,
    name: 'יוסי לוי',
    title: 'מטייל כלבים וחתולים מקצועי',
    rating: 4.9,
    reviews: 127,
    location: 'תל אביב',
    image: 'https://i.pravatar.cc/150?img=11',
    services: ['טיולים', 'חתולים'],
    price: 50,
    availability: 'זמין היום',
    petTypes: ['כלבים', 'חתולים']
  },
  {
    id: 2,
    name: 'רותי כהן',
    title: 'מטפלת בכלבים וחתולים בביתה',
    rating: 4.8,
    reviews: 95,
    location: 'חיפה',
    image: 'https://i.pravatar.cc/150?img=5',
    services: ['פנסיון', 'טיפוח'],
    price: 120,
    availability: 'זמינה ממחר',
    petTypes: ['כלבים', 'חתולים']
  }
];

// Mock functions that would normally interact with Supabase
export const getPets = async (userId: string) => {
  return mockPets.filter(pet => pet.ownerId === userId);
};

export const getServiceProviders = async (filters = {}) => {
  return mockServiceProviders;
};

// For future Supabase implementation
// export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
