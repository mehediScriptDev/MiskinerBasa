import { GraduationCap, MapPin } from 'lucide-react';

interface NearbyUniversitiesProps {
  universities: { name: string; distance: string }[];
}

const NearbyUniversities = ({ universities }: NearbyUniversitiesProps) => {
  if (universities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 font-heading font-semibold text-foreground">
        <GraduationCap className="h-5 w-5 text-primary" />
        Nearby Universities
      </h3>
      <div className="grid gap-2 sm:grid-cols-2">
        {universities.map((university, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/30 hover:bg-primary/5"
          >
            <div className="rounded-full bg-primary/10 p-2">
              <GraduationCap className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{university.name}</p>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {university.distance} away
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyUniversities;
