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
  const [mode, setMode] = useState('area');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
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
            {/* Mode Tabs */}
            <div className="mb-3 flex items-center gap-2">
              <button
                onClick={() => setMode('area')}
                className={`rounded-full px-4 py-2 text-sm ${mode === 'area' ? 'bg-white/90 text-foreground shadow' : 'bg-transparent text-muted-foreground'}`}
              >
                <MapPin className="mr-2 inline h-4 w-4" />
                Search by Area
              </button>
              <button
                onClick={() => setMode('university')}
                className={`rounded-full px-4 py-2 text-sm ${mode === 'university' ? 'bg-white/90 text-foreground shadow' : 'bg-transparent text-muted-foreground'}`}
              >
                <GraduationCap className="mr-2 inline h-4 w-4" />
                Near University
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_auto] items-end">
              <div className="flex w-full flex-col md:flex-row items-center gap-3">
                {mode === 'area' ? (
                  <Select value={selectedArea} onValueChange={setSelectedArea} className="w-full md:flex-1">
                    <SelectTrigger>
                      <SelectValue placeholder="Select an area..." />
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
                ) : (
                  <Select value={selectedUniversity} onValueChange={setSelectedUniversity} className="w-full md:flex-1">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a university..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Universities</SelectItem>
                      {UNIVERSITIES.map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {/* Budget input: full-width on mobile, compact on md+ */}
                <div className="w-full md:w-auto">
                  <Input
                    type="number"
                    placeholder="Max rice"
                    className="w-full md:w-28"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                  />
                </div>
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
