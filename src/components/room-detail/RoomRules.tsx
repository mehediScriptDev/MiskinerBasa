import { ClipboardList, Check } from 'lucide-react';

interface RoomRulesProps {
  rules: string[];
}

const RoomRules = ({ rules }: RoomRulesProps) => {
  if (rules.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 font-heading font-semibold text-foreground">
        <ClipboardList className="h-5 w-5 text-primary" />
        House Rules
      </h3>
      <ul className="grid gap-2 sm:grid-cols-2">
        {rules.map((rule, index) => (
          <li
            key={index}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Check className="h-4 w-4 flex-shrink-0 text-primary" />
            {rule}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomRules;
