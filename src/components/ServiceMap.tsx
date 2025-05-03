
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

// Declare the global google namespace for TypeScript
declare global {
  interface Window {
    initMap?: () => void;
    google: typeof google;
  }
}

interface ServiceMapProps {
  coordinates: [number, number]; // [longitude, latitude]
  trackingData?: [number, number][]; // array of [longitude, latitude] points
  isLive?: boolean;
}

const ServiceMap = ({ coordinates, trackingData, isLive = false }: ServiceMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const [simulationActive, setSimulationActive] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [apiKeyEntered, setApiKeyEntered] = useState(false);
  const [apiKey, setApiKey] = useState('');
  
  // Initialize the map
  useEffect(() => {
    if (!apiKeyEntered || !mapRef.current) return;

    // Create map instance
    const mapOptions = {
      center: { lat: coordinates[1], lng: coordinates[0] },
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
    };

    const map = new google.maps.Map(mapRef.current, mapOptions);
    mapInstanceRef.current = map;
    
    // Create marker for current position
    const marker = new google.maps.Marker({
      position: { lat: coordinates[1], lng: coordinates[0] },
      map: map,
      title: 'מיקום נוכחי',
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      }
    });
    markerRef.current = marker;
    
    // Create polyline for the tracking path
    if (trackingData && trackingData.length > 0) {
      const path = trackingData.map(point => ({
        lat: point[1],
        lng: point[0]
      }));
      
      const polyline = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#4A8FE7',
        strokeOpacity: 1.0,
        strokeWeight: 5
      });
      
      polyline.setMap(map);
      polylineRef.current = polyline;
    }
    
    // Add location tracking if in live mode
    if (isLive) {
      // In a real app, this would connect to a real-time service
      // For demo purposes, we'll use the simulated data if available
      if (trackingData && trackingData.length > 0) {
        setSimulationActive(true);
      }
    }
    
    return () => {
      // Clean up would happen here in a real implementation
      if (mapInstanceRef.current) {
        // No cleanup needed for now
      }
    };
  }, [coordinates, trackingData, isLive, apiKeyEntered]);
  
  // Handle simulated movement along the tracking path
  useEffect(() => {
    if (!simulationActive || !trackingData || trackingData.length === 0 || !apiKeyEntered) return;
    
    const interval = setInterval(() => {
      setCurrentPosition((prev) => {
        const nextPos = (prev + 1) % trackingData.length;
        
        if (markerRef.current && trackingData[nextPos]) {
          const newPos = { 
            lat: trackingData[nextPos][1], 
            lng: trackingData[nextPos][0] 
          };
          markerRef.current.setPosition(newPos);
          
          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo(newPos);
          }
        }
        
        return nextPos;
      });
    }, 2000); // Move every 2 seconds
    
    return () => clearInterval(interval);
  }, [simulationActive, trackingData, apiKeyEntered]);
  
  // Toggle simulation
  const toggleSimulation = () => {
    setSimulationActive(prev => !prev);
  };

  // For demo purposes, allow the user to input a Maps API key
  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      setApiKeyEntered(true);
      
      // Load Google Maps API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      // Define the callback function
      window.initMap = () => {
        console.log('Google Maps API loaded');
      };
      
      document.head.appendChild(script);
    }
  };

  if (!apiKeyEntered) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h3 className="text-xl font-bold mb-4">הכנסת מפתח Google Maps</h3>
        <p className="text-sm text-gray-500 mb-4 text-center">
          לצורך הדגמה בלבד, יש להכניס מפתח Google Maps API לצפייה במפה
        </p>
        <form onSubmit={handleApiKeySubmit} className="w-full max-w-md">
          <div className="flex gap-2">
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="הזן מפתח Google Maps API"
              className="flex-grow px-3 py-2 border rounded"
            />
            <Button type="submit">אישור</Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow relative" ref={mapRef} />
      
      {isLive && trackingData && trackingData.length > 0 && (
        <div className="absolute bottom-4 right-4">
          <Button 
            onClick={toggleSimulation}
            className={simulationActive ? "bg-red-500" : "bg-green-500"}
          >
            {simulationActive ? <Pause size={16} /> : <Play size={16} />}
            {simulationActive ? "עצור סימולציה" : "הפעל סימולציה"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServiceMap;
