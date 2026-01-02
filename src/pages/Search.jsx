import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockRooms } from '@/data/mockRooms';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchFilters from '@/components/search/SearchFilters';
import RoomCard from '@/components/rooms/RoomCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Search as SearchIcon, SlidersHorizontal, Grid3X3, LayoutList, MapPin } from 'lucide-react';

const defaultFilters = {
  area: '',
  minBudget: 0,
  maxBudget: 0,
  roomType: '',
  genderPreference: '',
  hasAttachedBathroom: null,
  isFurnished: null,
  wifiIncluded: null,
};

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => {
    // Initialize filters from URL params
    return {
      area: searchParams.get('area') || '',
      minBudget: Number(searchParams.get('minBudget')) || 0,
      maxBudget: Number(searchParams.get('maxBudget')) || 0,
      roomType: searchParams.get('roomType') || '',
      genderPreference: searchParams.get('genderPreference') || '',
      hasAttachedBathroom: searchParams.get('hasAttachedBathroom') === 'true' ? true : null,
      isFurnished: searchParams.get('isFurnished') === 'true' ? true : null,
      wifiIncluded: searchParams.get('wifiIncluded') === 'true' ? true : null,
    };
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.area) params.set('area', filters.area);
    if (filters.minBudget > 0) params.set('minBudget', filters.minBudget.toString());
    if (filters.maxBudget > 0) params.set('maxBudget', filters.maxBudget.toString());
    if (filters.roomType) params.set('roomType', filters.roomType);
    if (filters.genderPreference) params.set('genderPreference', filters.genderPreference);
    if (filters.hasAttachedBathroom) params.set('hasAttachedBathroom', 'true');
    if (filters.isFurnished) params.set('isFurnished', 'true');
    if (filters.wifiIncluded) params.set('wifiIncluded', 'true');
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Filter and sort rooms
  const filteredRooms = useMemo(() => {
    let rooms = [...mockRooms];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      rooms = rooms.filter(
        (room) =>
          room.title.toLowerCase().includes(query) ||
          room.area.toLowerCase().includes(query) ||
          room.address.toLowerCase().includes(query) ||
          room.description.toLowerCase().includes(query)
      );
    }

    // Filter by area
    if (filters.area && filters.area !== 'all') {
      rooms = rooms.filter((room) => room.area === filters.area);
    }

    // Filter by budget
    if (filters.minBudget > 0) {
      rooms = rooms.filter((room) => room.rent >= filters.minBudget);
    }
    if (filters.maxBudget > 0) {
      rooms = rooms.filter((room) => room.rent <= filters.maxBudget);
    }

    // Filter by room type
    if (filters.roomType) {
      rooms = rooms.filter((room) => room.roomType === filters.roomType);
    }

    // Filter by gender preference
    if (filters.genderPreference) {
      rooms = rooms.filter(
        (room) =>
          room.genderPreference === filters.genderPreference ||
          room.genderPreference === 'any'
      );
    }

    // Filter by amenities
    if (filters.hasAttachedBathroom) {
      rooms = rooms.filter((room) => room.hasAttachedBathroom);
    }
    if (filters.isFurnished) {
      rooms = rooms.filter((room) => room.isFurnished);
    }
    if (filters.wifiIncluded) {
      rooms = rooms.filter((room) => room.utilitiesIncluded.wifi);
    }

    // Only show available rooms
    rooms = rooms.filter((room) => room.isAvailable);

    // Sort rooms
    switch (sortBy) {
      case 'price-low':
        rooms.sort((a, b) => a.rent - b.rent);
        break;
      case 'price-high':
        rooms.sort((a, b) => b.rent - a.rent);
        break;
      case 'newest':
      default:
        rooms.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return rooms;
  }, [filters, searchQuery, sortBy]);

  const clearFilters = () => {
    setFilters(defaultFilters);
    setSearchQuery('');
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.area && filters.area !== 'all') count++;
    if (filters.minBudget > 0) count++;
    if (filters.maxBudget > 0) count++;
    if (filters.roomType) count++;
    if (filters.genderPreference) count++;
    if (filters.hasAttachedBathroom) count++;
    if (filters.isFurnished) count++;
    if (filters.wifiIncluded) count++;
    return count;
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
            Find Your Perfect Room
          </h1>
          <p className="mt-1 text-muted-foreground">
            Discover affordable rooms near universities in Dhaka
          </p>
        </div>

        {/* Search Bar & Controls */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-xl">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by area, title, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 lg:hidden">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <SearchFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    onClearFilters={clearFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="hidden items-center gap-1 rounded-lg border border-border p-1 sm:flex">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('list')}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <SearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* Results */}
          <div>
            {/* Results Count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{filteredRooms.length}</span>{' '}
                {filteredRooms.length === 1 ? 'room' : 'rooms'} found
                {filters.area && filters.area !== 'all' && (
                  <span className="inline-flex items-center gap-1 ml-2">
                    <MapPin className="h-3 w-3" />
                    in {filters.area}
                  </span>
                )}
              </p>
            </div>

            {/* Room Grid */}
            {filteredRooms.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3'
                    : 'flex flex-col gap-4'
                }
              >
                {filteredRooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
                <div className="rounded-full bg-muted p-4">
                  <SearchIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                  No rooms found
                </h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Try adjusting your filters or search query to find available rooms.
                </p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Search;
