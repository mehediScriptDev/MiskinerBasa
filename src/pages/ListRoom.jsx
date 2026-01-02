import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { DHAKA_AREAS, UNIVERSITIES } from '@/types/room';
import { toast } from '@/hooks/use-toast';
import { useRooms } from '@/hooks/useRooms';
import { useAuth } from '@/hooks/useAuth';
import {
  Home,
  MapPin,
  DollarSign,
  Users,
  Image,
  FileText,
  Phone,
  Upload,
  X,
  Plus,
  CheckCircle2,
} from 'lucide-react';

const listingSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(100, 'Title must be less than 100 characters'),
  area: z.string().min(1, 'Please select an area'),
  address: z.string().min(10, 'Address must be at least 10 characters').max(200, 'Address must be less than 200 characters'),
  rent: z.number().min(1000, 'Rent must be at least ৳1,000').max(100000, 'Rent must be less than ৳100,000'),
  roomType: z.enum(['single', 'shared'], { required_error: 'Please select room type' }),
  seats: z.number().min(1, 'At least 1 seat required').max(10, 'Maximum 10 seats'),
  genderPreference: z.enum(['male', 'female', 'any'], { required_error: 'Please select gender preference' }),
  hasAttachedBathroom: z.boolean(),
  isFurnished: z.boolean(),
  wifiIncluded: z.boolean(),
  gasIncluded: z.boolean(),
  electricityIncluded: z.boolean(),
  description: z.string().min(50, 'Description must be at least 50 characters').max(1000, 'Description must be less than 1000 characters'),
  nearbyUniversities: z.array(z.string()).optional(),
  ownerName: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  ownerPhone: z.string().regex(/^\+?[0-9]{10,14}$/, 'Please enter a valid phone number'),
  ownerWhatsApp: z.string().regex(/^\+?[0-9]{10,14}$/, 'Please enter a valid WhatsApp number').optional().or(z.literal('')),
});

// Type removed

const HOUSE_RULES = [
  'Bachelor allowed',
  'No smoking',
  'No pets',
  'No overnight guests',
  'Curfew at 10 PM',
  'Curfew at 11 PM',
  'Female only',
  'Male only',
  'No loud music after 10 PM',
  'Cooking allowed',
  'Visitors allowed with notice',
];

const ListRoom = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createRoom, isLoading } = useRooms();
  const [selectedRules, setSelectedRules] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const form = useForm({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: '',
      area: '',
      address: '',
      rent: 5000,
      roomType: 'single',
      seats: 1,
      genderPreference: 'any',
      hasAttachedBathroom: false,
      isFurnished: false,
      wifiIncluded: false,
      gasIncluded: true,
      electricityIncluded: false,
      description: '',
      nearbyUniversities: [],
      ownerName: '',
      ownerPhone: '',
      ownerWhatsApp: '',
    },
  });

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (!files) return;

    if (imageFiles.length + files.length > 5) {
      toast({
        title: 'Too many images',
        description: 'You can upload maximum 5 images.',
        variant: 'destructive',
      });
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `${file.name} is larger than 5MB.`,
          variant: 'destructive',
        });
        return;
      }

      setImageFiles((prev) => [...prev, file]);
      
      const reader = new FileReader();
      reader.onloadend = () => {
            setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleRule = (rule) => {
    setSelectedRules((prev) =>
      prev.includes(rule) ? prev.filter((r) => r !== rule) : [...prev, rule]
    );
  };

  const onSubmit = async (data) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to list a room.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    if (imageFiles.length === 0) {
      toast({
        title: 'Images required',
        description: 'Please upload at least one photo of your room.',
        variant: 'destructive',
      });
      return;
    }

    const result = await createRoom({
      title: data.title,
      area: data.area,
      address: data.address,
      rent: data.rent,
      roomType: data.roomType,
      seats: data.seats,
      genderPreference: data.genderPreference,
      hasAttachedBathroom: data.hasAttachedBathroom,
      isFurnished: data.isFurnished,
      wifiIncluded: data.wifiIncluded,
      gasIncluded: data.gasIncluded,
      electricityIncluded: data.electricityIncluded,
      description: data.description,
      nearbyUniversities: data.nearbyUniversities,
      ownerName: data.ownerName,
      ownerPhone: data.ownerPhone,
      ownerWhatsApp: data.ownerWhatsApp,
      rules: selectedRules,
    }, imageFiles);

    if (result) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="mx-auto max-w-3xl">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              List Your Room
            </h1>
            <p className="mt-2 text-muted-foreground">
              Help students find their perfect home. Fill in the details below to list your room.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-primary" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Provide the essential details about your room
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Listing Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Spacious Single Room Near DU"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A catchy title to attract students
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="roomType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="single">Single Room</SelectItem>
                              <SelectItem value="shared">Shared Room</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seats"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Seats</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={10}
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="genderPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender Preference</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select preference" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="any">Any Gender</SelectItem>
                            <SelectItem value="male">Male Only</SelectItem>
                            <SelectItem value="female">Female Only</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Location
                  </CardTitle>
                  <CardDescription>
                    Where is your room located?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Area</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select area" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DHAKA_AREAS.map((area) => (
                              <SelectItem key={area} value={area}>
                                {area}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., House 15, Road 27, Dhanmondi, Dhaka"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nearbyUniversities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nearby Universities (Optional)</FormLabel>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {UNIVERSITIES.map((university) => (
                            <div key={university} className="flex items-center space-x-2">
                              <Checkbox
                                id={university}
                                checked={field.value?.includes(university)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...(field.value || []), university]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter((u) => u !== university)
                                    );
                                  }
                                }}
                              />
                              <Label htmlFor={university} className="text-sm font-normal cursor-pointer">
                                {university}
                              </Label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Rent & Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Rent & Amenities
                  </CardTitle>
                  <CardDescription>
                    Set your price and list included amenities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="rent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Rent (BDT)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">৳</span>
                            <Input
                              type="number"
                              className="pl-8"
                              min={1000}
                              max={100000}
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <Label>Amenities</Label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="hasAttachedBathroom"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="font-normal">Attached Bathroom</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isFurnished"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="font-normal">Furnished</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="wifiIncluded"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="font-normal">WiFi Included</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gasIncluded"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="font-normal">Gas Included</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="electricityIncluded"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border border-border p-3 sm:col-span-2">
                            <div className="space-y-0.5">
                              <FormLabel className="font-normal">Electricity Included</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Photos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5 text-primary" />
                    Photos
                  </CardTitle>
                  <CardDescription>
                    Upload up to 5 photos of your room (max 5MB each)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {imagePreviews.map((image, index) => (
                      <div key={index} className="relative aspect-video overflow-hidden rounded-lg border border-border">
                        <img
                          src={image}
                          alt={`Room photo ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    {imagePreviews.length < 5 && (
                      <label className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary hover:bg-muted/50">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="mt-2 text-sm text-muted-foreground">Add Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Description & Rules */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Description & Rules
                  </CardTitle>
                  <CardDescription>
                    Describe your room and set house rules
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your room, neighborhood, and what makes it special..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum 50 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3">
                    <Label>House Rules (Select all that apply)</Label>
                    <div className="flex flex-wrap gap-2">
                      {HOUSE_RULES.map((rule) => (
                        <button
                          key={rule}
                          type="button"
                          onClick={() => toggleRule(rule)}
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                            selectedRules.includes(rule)
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                          }`}
                        >
                          {selectedRules.includes(rule) && (
                            <CheckCircle2 className="h-3 w-3" />
                          )}
                          {rule}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>
                    How can students reach you?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="ownerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Rahman Uncle" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="ownerPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+8801XXXXXXXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ownerWhatsApp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="+8801XXXXXXXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="gap-2">
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      List My Room
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ListRoom;
