import { Link } from 'react-router-dom';
import { useFavorites } from '@/contexts/FavoritesContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RoomCard from '@/components/rooms/RoomCard';
import { Button } from '@/components/ui/button';
import { Heart, Search } from 'lucide-react';

const Favorites = () => {
  const { favoriteRooms } = useFavorites();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
            My Favorites
          </h1>
          <p className="mt-1 text-muted-foreground">
            Rooms you've saved for later
          </p>
        </div>

        {favoriteRooms.length > 0 ? (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{favoriteRooms.length}</span>{' '}
              {favoriteRooms.length === 1 ? 'room' : 'rooms'} saved
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {favoriteRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-20 text-center">
            <div className="rounded-full bg-muted p-4">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mt-6 font-heading text-xl font-semibold text-foreground">
              No favorites yet
            </h2>
            <p className="mt-2 max-w-sm text-muted-foreground">
              Start exploring rooms and save your favorites by clicking the heart icon on any room card.
            </p>
            <Link to="/search">
              <Button className="mt-6 gap-2">
                <Search className="h-4 w-4" />
                Find Rooms
              </Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;
