import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { mockRooms } from '@/data/mockRooms';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PhotoGallery from '@/components/room-detail/PhotoGallery';
import AmenitiesList from '@/components/room-detail/AmenitiesList';
import LocationMap from '@/components/room-detail/LocationMap';
import NearbyUniversities from '@/components/room-detail/NearbyUniversities';
import ContactCard from '@/components/room-detail/ContactCard';
import RoomRules from '@/components/room-detail/RoomRules';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Flag,
  MapPin,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const room = mockRooms.find((r) => r.id === id);

  if (!room) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20 text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground">Room Not Found</h1>
          <p className="mt-2 text-muted-foreground">The room you're looking for doesn't exist.</p>
          <Button className="mt-6" onClick={() => navigate('/')}>
            Go Back Home
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: room.title,
          text: `Check out this room: ${room.title} in ${room.area}`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copied!',
        description: 'Room link has been copied to clipboard.',
      });
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
      description: isFavorite
        ? 'This room has been removed from your favorites.'
        : 'This room has been saved to your favorites.',
    });
  };

  const handleReport = () => {
    toast({
      title: 'Report Submitted',
      description: 'Thank you for helping keep our community safe.',
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6">
        {/* Back Button & Actions */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavorite}
              className={isFavorite ? 'text-destructive' : ''}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleReport}>
              <Flag className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Photo Gallery */}
            <PhotoGallery images={room.images} title={room.title} />

            {/* Title & Basic Info */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-start gap-3">
                <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                  {room.title}
                </h1>
                {room.isVerified && (
                  <Badge className="gap-1 bg-primary text-primary-foreground">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
                {room.isAvailable ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Available
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-red-100 text-red-700">
                    Not Available
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {room.area}, Dhaka
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Listed on {formatDate(room.createdAt)}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="font-heading text-xl font-semibold text-foreground">About This Room</h2>
              <p className="leading-relaxed text-muted-foreground">{room.description}</p>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-foreground">Amenities & Features</h2>
              <AmenitiesList room={room} />
            </div>

            {/* House Rules */}
            <RoomRules rules={room.rules} />

            {/* Nearby Universities */}
            <NearbyUniversities universities={room.nearbyUniversities} />

            {/* Location */}
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-foreground">Location</h2>
              <LocationMap
                coordinates={room.coordinates}
                address={room.address}
                area={room.area}
              />
            </div>
          </div>

          {/* Sidebar - Contact Card */}
          <div className="lg:block">
            <ContactCard
              ownerName={room.ownerName}
              ownerPhone={room.ownerPhone}
              ownerWhatsApp={room.ownerWhatsApp}
              isVerified={room.isVerified}
              rent={room.rent}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RoomDetail;
