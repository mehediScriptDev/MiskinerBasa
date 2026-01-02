import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import RoomCard from '@/components/rooms/RoomCard';
import { mockRooms } from '@/data/mockRooms';
import { ArrowRight } from 'lucide-react';

const FeaturedRooms = () => {
  const featuredRooms = mockRooms.slice(0, 6);

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Featured Rooms
            </h2>
            <p className="mt-2 text-muted-foreground">
              Handpicked rooms that students love
            </p>
          </div>
          <Link to="/search">
            <Button variant="outline" className="gap-2">
              View All Rooms
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredRooms.map((room, index) => (
            <div
              key={room.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <RoomCard room={room} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRooms;
