import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Home } from 'lucide-react';

const areas = [
  { name: 'Dhanmondi', count: 45, color: 'bg-primary/10' },
  { name: 'Mirpur', count: 62, color: 'bg-accent/10' },
  { name: 'Uttara', count: 38, color: 'bg-success/10' },
  { name: 'Mohammadpur', count: 28, color: 'bg-warning/10' },
  { name: 'Banani', count: 22, color: 'bg-primary/10' },
  { name: 'Bashundhara', count: 54, color: 'bg-accent/10' },
  { name: 'Gulshan', count: 18, color: 'bg-success/10' },
  { name: 'Badda', count: 35, color: 'bg-warning/10' },
];

const AreaGrid = () => {
  return (
    <section className="bg-secondary/30 py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Explore by Area
          </h2>
          <p className="mt-2 text-muted-foreground">
            Find rooms in your preferred neighborhood
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {areas.map((area, index) => (
            <Link
              key={area.name}
              to={`/search?area=${area.name}`}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <Card className="group cursor-pointer hover-lift bg-card">
                <CardContent className="p-6">
                  <div className={`mb-4 inline-flex rounded-lg p-3 ${area.color}`}>
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground">
                    {area.name}
                  </h3>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Home className="h-3 w-3" />
                    {area.count} rooms available
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AreaGrid;
