import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

  const uploadImages = async (images: File[]): Promise<string[]> => {
    if (!user) throw new Error('Must be logged in to upload images');
    
    const uploadedUrls: string[] = [];
    
    for (const image of images) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('room-images')
        .upload(fileName, image);
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('room-images')
        .getPublicUrl(fileName);
      
      uploadedUrls.push(publicUrl);
    }
    
    return uploadedUrls;
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
      // Upload images first
      const imageUrls = await uploadImages(imageFiles);
      
      // Prepare nearby universities as JSONB
      const nearbyUniversities = roomData.nearbyUniversities?.map(name => ({
        name,
        distance: 'Nearby'
      })) || [];

      const { data, error } = await supabase
        .from('rooms')
        .insert({
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
          description: roomData.description,
          rules: roomData.rules,
          nearby_universities: nearbyUniversities,
          owner_name: roomData.ownerName,
          owner_phone: roomData.ownerPhone,
          owner_whatsapp: roomData.ownerWhatsApp || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Create room error:', error);
        throw new Error(error.message);
      }

      toast({
        title: 'Room Listed Successfully!',
        description: 'Your room is now visible to students.',
      });

      return data as RoomData;
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

    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching rooms:', error);
      return [];
    }

    return (data || []) as RoomData[];
  };

  const getAllRooms = async (): Promise<RoomData[]> => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching rooms:', error);
      return [];
    }

    return (data || []) as RoomData[];
  };

  const getRoomById = async (id: string): Promise<RoomData | null> => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching room:', error);
      return null;
    }

    return data as RoomData | null;
  };

  const updateRoom = async (id: string, updates: Partial<RoomInsert>): Promise<boolean> => {
    if (!user) return false;

    const { error } = await supabase
      .from('rooms')
      .update({
        ...updates,
        room_type: updates.roomType,
        gender_preference: updates.genderPreference,
        has_attached_bathroom: updates.hasAttachedBathroom,
        is_furnished: updates.isFurnished,
        wifi_included: updates.wifiIncluded,
        gas_included: updates.gasIncluded,
        electricity_included: updates.electricityIncluded,
        owner_name: updates.ownerName,
        owner_phone: updates.ownerPhone,
        owner_whatsapp: updates.ownerWhatsApp,
      })
      .eq('id', id)
      .eq('owner_id', user.id);

    if (error) {
      console.error('Error updating room:', error);
      toast({
        title: 'Error',
        description: 'Failed to update room listing.',
        variant: 'destructive',
      });
      return false;
    }

    toast({
      title: 'Room Updated',
      description: 'Your room listing has been updated.',
    });

    return true;
  };

  const deleteRoom = async (id: string): Promise<boolean> => {
    if (!user) return false;

    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id)
      .eq('owner_id', user.id);

    if (error) {
      console.error('Error deleting room:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete room listing.',
        variant: 'destructive',
      });
      return false;
    }

    toast({
      title: 'Room Deleted',
      description: 'Your room listing has been removed.',
    });

    return true;
  };

  const toggleAvailability = async (id: string, isAvailable: boolean): Promise<boolean> => {
    if (!user) return false;

    const { error } = await supabase
      .from('rooms')
      .update({ is_available: isAvailable })
      .eq('id', id)
      .eq('owner_id', user.id);

    if (error) {
      console.error('Error toggling availability:', error);
      return false;
    }

    toast({
      title: isAvailable ? 'Room Available' : 'Room Unavailable',
      description: isAvailable 
        ? 'Your room is now visible to students.'
        : 'Your room is now hidden from listings.',
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
