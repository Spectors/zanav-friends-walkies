
// Types
export interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  role: 'owner' | 'giver';
  profile_image?: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface Pet {
  id: string;
  ownerId: string;
  ownerName: string;
  name: string;
  age: string;
  type: 'dog' | 'cat';
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

// Mock data
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

// Mock authentication service
const STORAGE_KEY = 'mock_auth_user';

export const mockAuth = {
  getSession: async () => {
    const userString = localStorage.getItem(STORAGE_KEY);
    return { data: { session: userString ? JSON.parse(userString) : null } };
  },
  
  signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
    // Simple mock authentication - in real app would check credentials
    if (!email || !password) {
      return { error: { message: 'Email and password are required' } };
    }

    // Create mock user
    const user: User = {
      id: 'mock_' + Date.now(),
      full_name: email.split('@')[0],
      email: email,
      role: 'owner',
      is_verified: true,
      created_at: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user }));
    return { data: { user, session: { user } }, error: null };
  },
  
  signUp: async ({ email, password, options }: { email: string; password: string; options?: { data?: any } }) => {
    if (!email || !password) {
      return { error: { message: 'Email and password are required' } };
    }

    // Create mock user
    const user: User = {
      id: 'mock_' + Date.now(),
      full_name: options?.data?.full_name || email.split('@')[0],
      email: email,
      phone: options?.data?.phone,
      role: options?.data?.role || 'owner',
      is_verified: false,
      created_at: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user }));
    return { data: { user, session: { user } }, error: null };
  },
  
  signOut: async () => {
    localStorage.removeItem(STORAGE_KEY);
    return { error: null };
  },
  
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    // In a real app, this would set up event listeners
    const user = localStorage.getItem(STORAGE_KEY);
    if (user) {
      callback('SIGNED_IN', JSON.parse(user));
    }
    
    return { 
      data: { 
        subscription: { 
          unsubscribe: () => {} 
        } 
      } 
    };
  }
};

// Mock database service
export const mockDatabase = {
  from: (table: string) => {
    return {
      select: () => {
        return {
          eq: (field: string, value: any) => {
            if (table === 'users') {
              const userString = localStorage.getItem(STORAGE_KEY);
              if (userString) {
                const userData = JSON.parse(userString);
                if (userData.user.id === value) {
                  return {
                    single: async () => ({
                      data: userData.user,
                      error: null
                    })
                  };
                }
              }
            }
            
            return {
              single: async () => ({
                data: null,
                error: null
              })
            };
          }
        };
      },
      insert: (data: any) => {
        if (table === 'pets') {
          // In a real app, we would store this in localStorage
          // For now, just return mock success
          return {
            select: () => ({
              data: { ...data, id: 'mock_' + Date.now() },
              error: null
            })
          };
        }
        
        return { 
          select: () => ({
            data: null,
            error: null
          })
        };
      },
      update: (data: any) => {
        return {
          eq: () => ({
            data: null,
            error: null
          })
        };
      }
    };
  },
  storage: {
    from: (bucket: string) => {
      return {
        upload: async (path: string, file: File) => {
          // Mock file upload - in a real app this would store to localStorage
          return { data: { path }, error: null };
        },
        getPublicUrl: (path: string) => {
          // Return a fake URL
          return { data: { publicUrl: URL.createObjectURL(new Blob()) } };
        }
      };
    }
  }
};

// Export a mock supabase object with auth and database services
export const supabase = {
  auth: mockAuth,
  ...mockDatabase
};

// Helper functions
export const getPets = async (userId: string) => {
  return mockPets.filter(pet => pet.ownerId === userId);
};

export const getServiceProviders = async (filters = {}) => {
  return mockServiceProviders;
};
