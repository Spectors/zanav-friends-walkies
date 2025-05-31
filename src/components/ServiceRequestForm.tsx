
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ServiceRequestFormProps {
  formData: {
    serviceType: string;
    date: string;
    timeFrom: string;
    timeTo: string;
    duration: string;
    notes: string;
    location: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({
  formData,
  onInputChange,
  onSelectChange,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>פרטי הבקשה</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="serviceType">סוג שירות</Label>
            <Select 
              value={formData.serviceType} 
              onValueChange={(value) => onSelectChange('serviceType', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="בחר סוג שירות" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="walking">טיול 🐕</SelectItem>
                <SelectItem value="sitting">פנסיון 🏠</SelectItem>
                <SelectItem value="grooming">טיפוח ✂️</SelectItem>
                <SelectItem value="training">אילוף 🎓</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">תאריך</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={onInputChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeFrom">שעת התחלה</Label>
              <Input
                id="timeFrom"
                name="timeFrom"
                type="time"
                value={formData.timeFrom}
                onChange={onInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeTo">שעת סיום</Label>
              <Input
                id="timeTo"
                name="timeTo"
                type="time"
                value={formData.timeTo}
                onChange={onInputChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">משך זמן (דקות)</Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={onInputChange}
              min="15"
              max="240"
              step="15"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">מיקום</Label>
            <Input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={onInputChange}
              placeholder="כתובת או אזור לטיול"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">הערות נוספות</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={onInputChange}
              placeholder="הערות מיוחדות או הוראות למטייל"
              rows={4}
            />
          </div>
          
          <div className="flex gap-4">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'שולח בקשה...' : 'שלח בקשה'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={onCancel}
            >
              ביטול
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ServiceRequestForm;
