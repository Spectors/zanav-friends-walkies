
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
