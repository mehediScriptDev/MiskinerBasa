export type RoomType = 'single' | 'shared';
export type GenderPreference = 'male' | 'female' | 'any';

export interface Room {
  id: string;
  title: string;
  area: string;
  address: string;
  rent: number;
  roomType: RoomType;
  genderPreference: GenderPreference;
  seats: number;
  hasAttachedBathroom: boolean;
  isFurnished: boolean;
  utilitiesIncluded: {
    wifi: boolean;
    gas: boolean;
    electricity: boolean;
  };
  images: string[];
  description: string;
  rules: string[];
  nearbyUniversities: { name: string; distance: string }[];
  coordinates: { lat: number; lng: number };
  ownerName: string;
  ownerPhone: string;
  ownerWhatsApp?: string;
  isVerified: boolean;
  isAvailable: boolean;
  createdAt: string;
}

export interface SearchFilters {
  area: string;
  minBudget: number;
  maxBudget: number;
  roomType: RoomType | '';
  genderPreference: GenderPreference | '';
  hasAttachedBathroom: boolean | null;
  isFurnished: boolean | null;
  wifiIncluded: boolean | null;
}

export const DHAKA_AREAS = [
  'Dhanmondi',
  'Mirpur',
  'Uttara',
  'Mohammadpur',
  'Banani',
  'Gulshan',
  'Motijheel',
  'Farmgate',
  'Tejgaon',
  'Badda',
  'Bashundhara',
  'Rampura',
  'Khilgaon',
  'Shyamoli',
  'Lalmatia',
] as const;

export const UNIVERSITIES = [
  'Dhaka University',
  'BUET',
  'North South University',
  'BRAC University',
  'East West University',
  'Independent University',
  'American International University',
  'Ahsanullah University',
  'United International University',
  'Daffodil International University',
] as const;
