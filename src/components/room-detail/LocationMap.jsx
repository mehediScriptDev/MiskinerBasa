import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Interface removed

const LocationMap = ({ coordinates, address, area  }) => {
  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Map Placeholder - Shows a static map image */}
      <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
        <img
          src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-l+10b981(${coordinates.lng},${coordinates.lat})/${coordinates.lng},${coordinates.lat},14,0/800x400@2x?access_token=pk.placeholder`}
          alt={`Map of ${address}`}
          className="h-full w-full object-cover"
          onError={(e) => {
            // Fallback to a simple gradient placeholder
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement.classList.add('map-placeholder');
          }}
        />
        {/* Fallback Map UI */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-accent/10">
          <div className="rounded-full bg-primary p-4 shadow-lg">
            <MapPin className="h-8 w-8 text-primary-foreground" />
          </div>
          <p className="mt-4 font-medium text-foreground">{area}, Dhaka</p>
          <p className="text-sm text-muted-foreground">{address}</p>
        </div>
      </div>

      {/* Address & Directions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2">
          <MapPin className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
          <div>
            <p className="font-medium text-foreground">{address}</p>
            <p className="text-sm text-muted-foreground">{area}, Dhaka, Bangladesh</p>
          </div>
        </div>
        <Button variant="outline" onClick={openInGoogleMaps} className="gap-2">
          <Navigation className="h-4 w-4" />
          Get Directions
        </Button>
      </div>
    </div>
  );
};

export default LocationMap;
