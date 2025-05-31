
// Mock data for services - this is a simplified version for the pages that still reference it
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
    services: ['הליכת כלבים'],
    location: 'תל אביב',
    rating: 4.8,
    phone: '050-1234567'
  },
  {
    id: '2',
    name: 'רחל לוי',
    services: ['טיפוח'],
    location: 'חיפה',
    rating: 4.9,
    phone: '052-7654321'
  }
];

// Mock pet type
export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'other';
  breed?: string;
  age?: number;
  weight?: number;
  owner_id: string;
  created_at: string;
}

// Mock database object
export const mockDatabase = {
  pets: [] as Pet[]
};

// Mock function to get pets
export const getPets = async (userId?: string): Promise<Pet[]> => {
  return mockDatabase.pets.filter(pet => !userId || pet.owner_id === userId);
};
