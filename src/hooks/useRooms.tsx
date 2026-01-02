import { useState } from 'react';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface RoomInsert {
  title: string;
  area: string;
  address: string;
  rent: number;
  roomType: 'single' | 'shared';
  seats: number;
  genderPreference: 'male' | 'female' | 'any';
  hasAttachedBathroom: boolean;
  isFurnished: boolean;
  wifiIncluded: boolean;
  gasIncluded: boolean;
  electricityIncluded: boolean;
  description: string;
  rules: string[];
  nearbyUniversities?: string[];
  ownerName: string;
  ownerPhone: string;
  ownerWhatsApp?: string;
}

export interface RoomData {
  id: string;
  owner_id: string;
  title: string;
  area: string;
  address: string;
  rent: number;
  room_type: 'single' | 'shared';
  gender_preference: 'male' | 'female' | 'any';
  seats: number;
  has_attached_bathroom: boolean;
  is_furnished: boolean;
  wifi_included: boolean;
  gas_included: boolean;
  electricity_included: boolean;
  images: string[];
  description: string | null;
  rules: string[];
  nearby_universities: { name: string; distance: string }[];
  coordinates: { lat: number; lng: number } | null;
  owner_name: string;
  owner_phone: string;
  owner_whatsapp: string | null;
  is_verified: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export const useRooms = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const uploadImages = async (images: File[]): Promise<string[]> => {
    if (!user) throw new Error('Must be logged in to upload images');
    const uploaded: string[] = [];
    for (const img of images) {
      try {
        const dataUrl = await readFileAsDataUrl(img);
        uploaded.push(dataUrl);
      } catch (err) {
        console.error('Image read error', err);
        throw err;
      }
    }
    return uploaded;
  };

  const createRoom = async (roomData: RoomInsert, imageFiles: File[]): Promise<RoomData | null> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to list a room.',
        variant: 'destructive',
      });
      return null;
    }

    setIsLoading(true);
    
    try {
      // Upload images first (stored as data URLs in localStorage)
      const imageUrls = await uploadImages(imageFiles);

      const nearbyUniversities = roomData.nearbyUniversities?.map((name) => ({ name, distance: 'Nearby' })) || [];

      const rooms = JSON.parse(localStorage.getItem('miskinerbasa_rooms') || '[]') as RoomData[];
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const now = new Date().toISOString();
      const newRoom: RoomData = {
        id,
        owner_id: user.id,
        title: roomData.title,
        area: roomData.area,
        address: roomData.address,
        rent: roomData.rent,
        room_type: roomData.roomType,
        gender_preference: roomData.genderPreference,
        seats: roomData.seats,
        has_attached_bathroom: roomData.hasAttachedBathroom,
        is_furnished: roomData.isFurnished,
        wifi_included: roomData.wifiIncluded,
        gas_included: roomData.gasIncluded,
        electricity_included: roomData.electricityIncluded,
        images: imageUrls,
        description: roomData.description || null,
        rules: roomData.rules,
        nearby_universities: nearbyUniversities,
        coordinates: null,
        owner_name: roomData.ownerName,
        owner_phone: roomData.ownerPhone,
        owner_whatsapp: roomData.ownerWhatsApp || null,
        is_verified: false,
        is_available: true,
        created_at: now,
        updated_at: now,
      };

      rooms.unshift(newRoom);
      localStorage.setItem('miskinerbasa_rooms', JSON.stringify(rooms));

      toast({ title: 'Room Listed Successfully!', description: 'Your room is now visible to students.' });

      return newRoom;
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create room listing.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getMyRooms = async (): Promise<RoomData[]> => {
    if (!user) return [];
    const rooms = JSON.parse(localStorage.getItem('miskinerbasa_rooms') || '[]') as RoomData[];
    return rooms.filter((r) => r.owner_id === user.id).sort((a, b) => (b.created_at > a.created_at ? 1 : -1));
  };

  const getAllRooms = async (): Promise<RoomData[]> => {
    const rooms = JSON.parse(localStorage.getItem('miskinerbasa_rooms') || '[]') as RoomData[];
    return rooms.filter((r) => r.is_available).sort((a, b) => (b.created_at > a.created_at ? 1 : -1));
  };

  const getRoomById = async (id: string): Promise<RoomData | null> => {
    const rooms = JSON.parse(localStorage.getItem('miskinerbasa_rooms') || '[]') as RoomData[];
    return rooms.find((r) => r.id === id) || null;
  };

  const updateRoom = async (id: string, updates: Partial<RoomInsert>): Promise<boolean> => {
    if (!user) return false;
    const rooms = JSON.parse(localStorage.getItem('miskinerbasa_rooms') || '[]') as RoomData[];
    const idx = rooms.findIndex((r) => r.id === id && r.owner_id === user.id);
    if (idx === -1) return false;

    const updated = {
      ...rooms[idx],
      ...updates,
      room_type: updates.roomType ?? rooms[idx].room_type,
      gender_preference: updates.genderPreference ?? rooms[idx].gender_preference,
      has_attached_bathroom: updates.hasAttachedBathroom ?? rooms[idx].has_attached_bathroom,
      is_furnished: updates.isFurnished ?? rooms[idx].is_furnished,
      wifi_included: updates.wifiIncluded ?? rooms[idx].wifi_included,
      gas_included: updates.gasIncluded ?? rooms[idx].gas_included,
      electricity_included: updates.electricityIncluded ?? rooms[idx].electricity_included,
      owner_name: updates.ownerName ?? rooms[idx].owner_name,
      owner_phone: updates.ownerPhone ?? rooms[idx].owner_phone,
      owner_whatsapp: updates.ownerWhatsApp ?? rooms[idx].owner_whatsapp,
      updated_at: new Date().toISOString(),
    } as unknown as RoomData;

    rooms[idx] = updated;
    localStorage.setItem('miskinerbasa_rooms', JSON.stringify(rooms));

    toast({ title: 'Room Updated', description: 'Your room listing has been updated.' });
    return true;
  };

  const deleteRoom = async (id: string): Promise<boolean> => {
    if (!user) return false;
    const rooms = JSON.parse(localStorage.getItem('miskinerbasa_rooms') || '[]') as RoomData[];
    const idx = rooms.findIndex((r) => r.id === id && r.owner_id === user.id);
    if (idx === -1) return false;
    rooms.splice(idx, 1);
    localStorage.setItem('miskinerbasa_rooms', JSON.stringify(rooms));

    toast({ title: 'Room Deleted', description: 'Your room listing has been removed.' });
    return true;
  };

  const toggleAvailability = async (id: string, isAvailable: boolean): Promise<boolean> => {
    if (!user) return false;
    const rooms = JSON.parse(localStorage.getItem('miskinerbasa_rooms') || '[]') as RoomData[];
    const idx = rooms.findIndex((r) => r.id === id && r.owner_id === user.id);
    if (idx === -1) return false;
    rooms[idx].is_available = isAvailable;
    rooms[idx].updated_at = new Date().toISOString();
    localStorage.setItem('miskinerbasa_rooms', JSON.stringify(rooms));

    toast({
      title: isAvailable ? 'Room Available' : 'Room Unavailable',
      description: isAvailable ? 'Your room is now visible to students.' : 'Your room is now hidden from listings.',
    });

    return true;
  };

  return {
    isLoading,
    createRoom,
    getMyRooms,
    getAllRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
    toggleAvailability,
    uploadImages,
  };
};
