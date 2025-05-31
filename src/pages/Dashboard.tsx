
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Heart, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, profile } = useAuth();

  // Mock data for now
  const mockServices = [
    {
      id: '1',
      name: 'הליכת כלבים',
      description: 'שירות הליכת כלבים מקצועי',
      price: 50,
      provider: { full_name: 'יוסי כהן' }
    },
    {
      id: '2',
      name: 'טיפוח כלבים',
      description: 'טיפוח מקצועי לכלבים',
      price: 120,
      provider: { full_name: 'רחל לוי' }
    }
  ];

  const mockPosts = [
    {
      id: '1',
      content: 'מחפש המלצה על וטרינר טוב באזור תל אביב',
      author: { full_name: 'דני אברהם' },
      created_at: new Date().toISOString(),
      likes_count: 5,
      comments_count: 3
    },
    {
      id: '2',
      content: 'הכלב שלי אבד היום באזור הפארק. אשמח לעזרה!',
      author: { full_name: 'מיכל ברקו' },
      created_at: new Date().toISOString(),
      likes_count: 12,
      comments_count: 8
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          שלום {profile?.full_name || 'משתמש'}!
        </h1>
        <p className="text-gray-600">ברוך הבא לזנב+ - הפלטפורמה שלך לטיפול בחיות מחמד</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <Card className="col-span-full lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              פעולות מהירות
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/pets/add">
              <Button className="w-full justify-start">
                <PlusCircle className="h-4 w-4 mr-2" />
                הוסף חיה חדשה
              </Button>
            </Link>
            <Link to="/community">
              <Button variant="outline" className="w-full justify-start">
                <Heart className="h-4 w-4 mr-2" />
                פרסם בקהילה
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="h-4 w-4 mr-2" />
                חפש שירותים
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Services */}
        <Card className="col-span-full lg:col-span-2">
          <CardHeader>
            <CardTitle>שירותים זמינים</CardTitle>
            <CardDescription>שירותים פופולריים באזור שלך</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockServices.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{service.name}</h4>
                    <p className="text-sm text-gray-600">{service.description}</p>
                    <p className="text-sm text-gray-500">על ידי: {service.provider.full_name}</p>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-lg">₪{service.price}</p>
                    <Button size="sm">הזמן</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Community Feed */}
      <Card>
        <CardHeader>
          <CardTitle>עדכונים מהקהילה</CardTitle>
          <CardDescription>פוסטים אחרונים מחברי הקהילה</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPosts.map((post) => (
              <div key={post.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <span className="font-semibold">{post.author.full_name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString('he-IL')}
                  </span>
                </div>
                <p className="mb-3">{post.content}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{post.likes_count} לייקים</span>
                  <span>{post.comments_count} תגובות</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
