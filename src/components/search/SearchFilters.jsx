import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SlidersHorizontal, X } from 'lucide-react';
import { DHAKA_AREAS } from '@/types/room';

// Interface removed

const SearchFilters = ({ filters, onFiltersChange, onClearFilters  }) => {
  const updateFilter = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className="bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <SlidersHorizontal className="h-5 w-5" />
            Filters
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Area */}
        <div className="space-y-2">
          <Label>Area</Label>
          <Select
            value={filters.area}
            onValueChange={(value) => updateFilter('area', value)}
          >
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

        {/* Budget Range */}
        <div className="space-y-2">
          <Label>Budget Range (BDT/month)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minBudget || ''}
              onChange={(e) => updateFilter('minBudget', Number(e.target.value) || 0)}
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxBudget || ''}
              onChange={(e) => updateFilter('maxBudget', Number(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Room Type */}
        <div className="space-y-2">
          <Label>Room Type</Label>
          <Select
            value={filters.roomType}
            onValueChange={(value) => updateFilter('roomType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any type</SelectItem>
              <SelectItem value="single">Single Room</SelectItem>
              <SelectItem value="shared">Shared Room</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Gender Preference */}
        <div className="space-y-2">
          <Label>Gender Preference</Label>
          <Select
            value={filters.genderPreference}
            onValueChange={(value) => updateFilter('genderPreference', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="male">Male Only</SelectItem>
              <SelectItem value="female">Female Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Toggle Filters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="attached-bath">Attached Bathroom</Label>
            <Switch
              id="attached-bath"
              checked={filters.hasAttachedBathroom === true}
              onCheckedChange={(checked) => updateFilter('hasAttachedBathroom', checked ? true : null)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="furnished">Furnished</Label>
            <Switch
              id="furnished"
              checked={filters.isFurnished === true}
              onCheckedChange={(checked) => updateFilter('isFurnished', checked ? true : null)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="wifi">WiFi Included</Label>
            <Switch
              id="wifi"
              checked={filters.wifiIncluded === true}
              onCheckedChange={(checked) => updateFilter('wifiIncluded', checked ? true : null)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
