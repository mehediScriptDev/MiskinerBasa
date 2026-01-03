import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFavorites } from '@/contexts/FavoritesContext';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Wifi, 
  CheckCircle2,
  Heart,
  GraduationCap,
  User,
  Users
} from 'lucide-react';

// Interface removed

const RoomCard = ({ room  }) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  const formatRent = (rent) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(rent);
  };

  return (
    <Card className="group overflow-hidden hover-lift bg-card">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={room.images[0]}
          alt={room.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        
        {/* Price Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded-lg bg-card px-3 py-1.5 font-heading text-lg font-bold text-foreground shadow-md">
            {formatRent(room.rent)}/mo
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(room.id);
          }}
          className="absolute right-3 top-3 rounded-full bg-card/80 p-2 backdrop-blur-sm transition-all hover:bg-card hover:scale-110"
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isFavorite(room.id) ? 'fill-destructive text-destructive' : 'text-muted-foreground'
            }`}
          />
        </button>

        {/* Verified Badge */}
        {room.isVerified && (
          <div className="absolute left-3 top-3">
            <Badge className="gap-1 bg-primary text-primary-foreground">
              <CheckCircle2 className="h-3 w-3" />
              Verified
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-heading font-semibold text-foreground line-clamp-1">
            {room.title}
          </h3>
        </div>

        <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="line-clamp-1">{room.area}, Dhaka</span>
        </div>

        {/* Features */}
        <div className="mb-4 flex flex-wrap gap-2">
          {room.genderPreference && (
            <Badge variant="secondary" className="gap-1 text-xs">
              {room.genderPreference === 'any' ? (
                <Users className="h-3 w-3" />
              ) : (
                <User className="h-3 w-3" />
              )}
              {room.genderPreference === 'male'
                ? 'Male'
                : room.genderPreference === 'female'
                ? 'Female'
                : 'Any'}
            </Badge>
          )}

          <Badge variant="secondary" className="gap-1 text-xs">
            <Bed className="h-3 w-3" />
            {room.roomType === 'single' ? 'Single' : 'Shared'}
          </Badge>
          {room.hasAttachedBathroom && (
            <Badge variant="secondary" className="gap-1 text-xs">
              <Bath className="h-3 w-3" />
              Attached Bath
            </Badge>
          )}
          {room.utilitiesIncluded.wifi && (
            <Badge variant="secondary" className="gap-1 text-xs">
              <Wifi className="h-3 w-3" />
              WiFi
            </Badge>
          )}
        </div>

        {/* University Distance */}
        {room.nearbyUniversities.length > 0 && (
          <p className="mb-4 text-xs text-muted-foreground">
            <MapPin className="inline h-4 w-4 text-primary mr-1" />
            {room.nearbyUniversities[0].distance} from {room.nearbyUniversities[0].name}
          </p>
        )}

        <Link to={`/room/${room.id}`}>
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
