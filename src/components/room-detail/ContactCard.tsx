import { Phone, MessageCircle, User, CheckCircle2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ContactCardProps {
  ownerName: string;
  ownerPhone: string;
  ownerWhatsApp?: string;
  isVerified: boolean;
  rent: number;
}

const ContactCard = ({ ownerName, ownerPhone, ownerWhatsApp, isVerified, rent }: ContactCardProps) => {
  const formatRent = (rent: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(rent);
  };

  const handleCall = () => {
    window.location.href = `tel:${ownerPhone}`;
  };

  const handleWhatsApp = () => {
    const phone = ownerWhatsApp || ownerPhone;
    const message = encodeURIComponent('Hi, I found your room listing on Miskinerbasha. Is it still available?');
    window.open(`https://wa.me/${phone.replace(/\+/g, '')}?text=${message}`, '_blank');
  };

  return (
    <Card className="sticky top-24 border-primary/20 bg-card shadow-lg">
      <CardContent className="p-6">
        {/* Price */}
        <div className="mb-6 text-center">
          <p className="text-sm text-muted-foreground">Monthly Rent</p>
          <p className="font-heading text-3xl font-bold text-primary">{formatRent(rent)}</p>
          <p className="text-sm text-muted-foreground">per month</p>
        </div>

        {/* Owner Info */}
        <div className="mb-6 flex items-center gap-3 rounded-lg bg-muted/50 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground">{ownerName}</p>
              {isVerified && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Property Owner</p>
          </div>
        </div>

        {/* Contact Buttons */}
        <div className="space-y-3">
          <Button onClick={handleCall} className="w-full gap-2" size="lg">
            <Phone className="h-5 w-5" />
            Call Now
          </Button>
          <Button onClick={handleWhatsApp} variant="outline" className="w-full gap-2 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700" size="lg">
            <MessageCircle className="h-5 w-5" />
            WhatsApp
          </Button>
        </div>

        {/* Safety Notice */}
        <div className="mt-6 flex items-start gap-2 rounded-lg bg-accent/50 p-3 text-xs text-muted-foreground">
          <Shield className="h-4 w-4 flex-shrink-0 text-accent-foreground" />
          <p>
            Always visit the room in person before making any payment. Never pay in advance without proper documentation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
