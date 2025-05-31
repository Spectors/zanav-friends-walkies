
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Filter, Heart } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Pet = Database['public']['Tables']['pets']['Row'];

const AvailablePets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterAge, setFilterAge] = useState<string>('all');

  // Mock data for now - replace with real API call later
  const mockPets: Pet[] = [
    {
      id: '1',
      name: 'מקס',
      type: 'dog',
      breed: 'גולדן רטריבר',
      birth_date: '2021-05-15',
      description: 'כלב ידידותי ואוהב משחקים',
      avatar: null,
      owner_id: 'mock-owner-1',
      location: null,
      safe_zone: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'לונה',
      type: 'cat',
      breed: 'חתול פרסי',
      birth_date: '2020-08-20',
      description: 'חתולה שקטה ואוהבת ליטופים',
      avatar: null,
      owner_id: 'mock-owner-2',
      location: null,
      safe_zone: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const filteredPets = mockPets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (pet.breed || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || pet.type === filterType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">חיות זמינות לאימוץ</h1>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="חפש לפי שם או גזע..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="סוג חיה" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל החיות</SelectItem>
              <SelectItem value="dog">כלבים</SelectItem>
              <SelectItem value="cat">חתולים</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="w-full md:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            סינון מתקדם
          </Button>
        </div>
      </div>

      {/* Pets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPets.map((pet) => (
          <Card key={pet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square overflow-hidden">
              <img
                src={pet.avatar || '/placeholder.svg'}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{pet.name}</h3>
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-gray-600 mb-2">{pet.breed}</p>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                {pet.description}
              </p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>תל אביב</span>
                </div>
                <Button size="sm">
                  פרטים נוספים
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">לא נמצאו חיות התואמות לחיפוש</p>
        </div>
      )}
    </div>
  );
};

export default AvailablePets;
