import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="bg-primary py-16 md:py-20">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-primary-foreground/10 p-4">
            <Home className="h-10 w-10 text-primary-foreground" />
          </div>
          
          <h2 className="mb-4 font-heading text-3xl font-bold text-primary-foreground md:text-4xl">
            Have a Room to Rent?
          </h2>
          
          <p className="mb-8 text-lg text-primary-foreground/80">
            List your room for free and connect with thousands of students 
            looking for affordable housing in Dhaka.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/list-room">
              <Button variant="heroOutline" size="xl" className="gap-2">
                List Your Room
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button 
                variant="ghost" 
                size="xl"
                className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
