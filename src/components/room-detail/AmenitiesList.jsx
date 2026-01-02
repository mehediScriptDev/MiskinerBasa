// removed Room type import (JS build)
import { 
  Wifi, 
  Flame, 
  Zap, 
  Bath, 
  Sofa, 
  Users, 
  User,
  Bed,
  CheckCircle2,
  XCircle
} from 'lucide-react';

// Interface removed

const AmenitiesList = ({ room  }) => {
  const amenities = [
    {
      label: 'Room Type',
      value: room.roomType === 'single' ? 'Single Room' : 'Shared Room',
      icon: Bed,
      available: true,
    },
    {
      label: 'Seats',
      value: `${room.seats} ${room.seats === 1 ? 'Person' : 'People'}`,
      icon: Users,
      available: true,
    },
    {
      label: 'Gender Preference',
      value: room.genderPreference === 'male' ? 'Male Only' : room.genderPreference === 'female' ? 'Female Only' : 'Any Gender',
      icon: User,
      available: true,
    },
    {
      label: 'Attached Bathroom',
      value: room.hasAttachedBathroom ? 'Yes' : 'No',
      icon: Bath,
      available: room.hasAttachedBathroom,
    },
    {
      label: 'Furnished',
      value: room.isFurnished ? 'Yes' : 'No',
      icon: Sofa,
      available: room.isFurnished,
    },
    {
      label: 'WiFi',
      value: room.utilitiesIncluded.wifi ? 'Included' : 'Not Included',
      icon: Wifi,
      available: room.utilitiesIncluded.wifi,
    },
    {
      label: 'Gas',
      value: room.utilitiesIncluded.gas ? 'Included' : 'Not Included',
      icon: Flame,
      available: room.utilitiesIncluded.gas,
    },
    {
      label: 'Electricity',
      value: room.utilitiesIncluded.electricity ? 'Included' : 'Not Included',
      icon: Zap,
      available: room.utilitiesIncluded.electricity,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {amenities.map((amenity) => {
        const Icon = amenity.icon;
        return (
          <div
            key={amenity.label}
            className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
              amenity.available
                ? 'border-primary/20 bg-primary/5'
                : 'border-border bg-muted/50'
            }`}
          >
            <div
              className={`rounded-full p-2 ${
                amenity.available
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{amenity.label}</p>
              <p className={`text-sm font-medium truncate ${
                amenity.available ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {amenity.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AmenitiesList;
