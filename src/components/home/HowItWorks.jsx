import { Search, MessageCircle, Key } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Search Rooms',
    description: 'Browse through verified listings. Filter by area, budget, and amenities.',
  },
  {
    icon: MessageCircle,
    title: 'Contact Owner',
    description: 'Connect directly with homeowners via call or WhatsApp.',
  },
  {
    icon: Key,
    title: 'Move In',
    description: 'Visit the room, finalize the deal, and start your new chapter.',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            How It Works
          </h2>
          <p className="mt-2 text-muted-foreground">
            Finding your perfect room is just 3 steps away
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-[60%] top-12 hidden h-0.5 w-[80%] bg-border md:block" />
                )}

                {/* Step Number */}
                <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-primary/10" />
                  <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </div>
                  <Icon className="h-10 w-10 text-primary" />
                </div>

                <h3 className="mb-2 font-heading text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
