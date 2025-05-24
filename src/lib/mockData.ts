
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

export interface ServiceRequest {
  id: string;
  petId: string;
  petName: string;
  ownerId: string;
  ownerName: string;
  serviceType: 'walking' | 'sitting' | 'grooming' | 'training';
  date: string;
  timeFrom: string;
  timeTo: string;
  duration: number; // in minutes
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  walkerId?: string;
  walkerName?: string;
  notes?: string;
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

// Storage keys
const STORAGE_KEYS = {
  AUTH_USER: 'mock_auth_user',
  REGISTERED_USERS: 'mock_registered_users',
  PETS: 'mock_pets_data',
  SERVICE_REQUESTS: 'mock_service_requests'
};

// Mock authentication service
export const mockAuth = {
  getSession: async () => {
    const userString = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    return { data: { session: userString ? JSON.parse(userString) : null } };
  },
  
  signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
    if (!email || !password) {
      return { error: { message: 'Email and password are required' } };
    }

    // Get registered users
    const registeredUsersString = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
    const registeredUsers = registeredUsersString ? JSON.parse(registeredUsersString) : [];
    
    // Find user by email and password
    const foundUser = registeredUsers.find((user: any) => user.email === email && user.password === password);
    
    if (!foundUser) {
      return { error: { message: 'Invalid email or password' } };
    }

    // Remove password from user object before storing
    const { password: _, ...userWithoutPassword } = foundUser;
    
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify({ user: userWithoutPassword }));
    return { data: { user: userWithoutPassword, session: { user: userWithoutPassword } }, error: null };
  },
  
  signUp: async ({ email, password, options }: { email: string; password: string; options?: { data?: any } }) => {
    if (!email || !password) {
      return { error: { message: 'Email and password are required' } };
    }

    // Check if user already exists
    const registeredUsersString = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
    const registeredUsers = registeredUsersString ? JSON.parse(registeredUsersString) : [];
    
    const existingUser = registeredUsers.find((user: any) => user.email === email);
    if (existingUser) {
      return { error: { message: 'User already registered' } };
    }

    // Create new user
    const newUser: User & { password: string } = {
      id: 'user_' + Date.now(),
      full_name: options?.data?.full_name || email.split('@')[0],
      email: email,
      phone: options?.data?.phone,
      role: options?.data?.role || 'owner',
      is_verified: true,
      created_at: new Date().toISOString(),
      password: password
    };
    
    // Save to registered users
    registeredUsers.push(newUser);
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registeredUsers));
    
    // Remove password from user object before storing session
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify({ user: userWithoutPassword }));
    
    return { data: { user: userWithoutPassword, session: { user: userWithoutPassword } }, error: null };
  },
  
  signOut: async () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    return { error: null };
  },
  
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    const user = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
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
            if (table === 'pets') {
              const petsString = localStorage.getItem(STORAGE_KEYS.PETS);
              const pets = petsString ? JSON.parse(petsString) : [];
              const userPets = pets.filter((pet: Pet) => pet.ownerId === value);
              
              return {
                single: async () => ({
                  data: userPets,
                  error: null
                })
              };
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
          const petsString = localStorage.getItem(STORAGE_KEYS.PETS);
          const pets = petsString ? JSON.parse(petsString) : [];
          
          const newPet = {
            ...data,
            id: 'pet_' + Date.now(),
            createdAt: new Date().toISOString()
          };
          
          pets.push(newPet);
          localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets));
          
          return {
            select: () => ({
              data: newPet,
              error: null
            })
          };
        }
        
        if (table === 'service_requests') {
          const requestsString = localStorage.getItem(STORAGE_KEYS.SERVICE_REQUESTS);
          const requests = requestsString ? JSON.parse(requestsString) : [];
          
          const newRequest = {
            ...data,
            id: 'request_' + Date.now(),
            createdAt: new Date().toISOString()
          };
          
          requests.push(newRequest);
          localStorage.setItem(STORAGE_KEYS.SERVICE_REQUESTS, JSON.stringify(requests));
          
          return {
            select: () => ({
              data: newRequest,
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
          eq: (field: string, value: any) => {
            if (table === 'service_requests') {
              const requestsString = localStorage.getItem(STORAGE_KEYS.SERVICE_REQUESTS);
              const requests = requestsString ? JSON.parse(requestsString) : [];
              
              const updatedRequests = requests.map((request: ServiceRequest) => 
                request.id === value ? { ...request, ...data } : request
              );
              
              localStorage.setItem(STORAGE_KEYS.SERVICE_REQUESTS, JSON.stringify(updatedRequests));
              
              return {
                data: null,
                error: null
              };
            }
            
            return {
              data: null,
              error: null
            };
          }
        };
      }
    };
  },
  storage: {
    from: (bucket: string) => {
      return {
        upload: async (path: string, file: File) => {
          return { data: { path }, error: null };
        },
        getPublicUrl: (path: string) => {
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
  const petsString = localStorage.getItem(STORAGE_KEYS.PETS);
  const pets = petsString ? JSON.parse(petsString) : [];
  return pets.filter((pet: Pet) => pet.ownerId === userId);
};

export const getServiceProviders = async (filters = {}) => {
  return mockServiceProviders;
};

export const getServiceRequests = async (userId: string, role: 'owner' | 'giver') => {
  const requestsString = localStorage.getItem(STORAGE_KEYS.SERVICE_REQUESTS);
  const requests = requestsString ? JSON.parse(requestsString) : [];
  
  if (role === 'owner') {
    return requests.filter((request: ServiceRequest) => request.ownerId === userId);
  } else {
    return requests.filter((request: ServiceRequest) => request.walkerId === userId || request.status === 'pending');
  }
};
