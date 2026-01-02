import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, MapPin, GraduationCap } from 'lucide-react';
import { DHAKA_AREAS, UNIVERSITIES } from '@/types/room';
import heroImage from '@/assets/hero-dhaka.jpg';

const Hero = () => {
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState('');
  const [maxBudget, setMaxBudget] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedArea && selectedArea !== 'all') params.set('area', selectedArea);
    if (maxBudget) params.set('maxBudget', maxBudget);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Dhaka cityscape"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/40" />
      </div>

      {/* Content */}
      <div className="container relative z-10">
        <div className="max-w-2xl space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-sm text-primary-foreground backdrop-blur-sm animate-fade-in">
            <GraduationCap className="h-4 w-4" />
            <span>Student-friendly housing in Dhaka</span>
          </div>

          {/* Heading */}
          <h1 className="font-heading text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl animate-slide-up">
            Find Your Perfect
            <span className="block text-primary">Student Room</span>
          </h1>

          <p className="text-lg text-primary-foreground/80 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Discover affordable, verified rooms near universities across Dhaka. 
            Safe, simple, and student-focused.
          </p>

          {/* Search Box */}
          <div 
            className="rounded-xl bg-card p-4 shadow-xl animate-slide-up" 
            style={{ animationDelay: '0.2s' }}
          >
            <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  <MapPin className="mr-1 inline h-4 w-4" />
                  Area
                </label>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Areas</SelectItem>
                    {DHAKA_AREAS.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  💰 Max Budget
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 10000"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                />
              </div>

              <div className="flex items-end">
                <Button size="lg" className="w-full gap-2" onClick={handleSearch}>
                  <Search className="h-5 w-5" />
                  Search Rooms
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <span className="text-sm text-primary-foreground/70">Popular:</span>
            {['Dhanmondi', 'Mirpur', 'Uttara', 'Bashundhara'].map((area) => (
              <Button
                key={area}
                variant="heroOutline"
                size="sm"
                onClick={() => navigate(`/search?area=${area}`)}
              >
                {area}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
