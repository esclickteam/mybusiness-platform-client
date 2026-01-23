import {
  Tag,
  FileText,
  Phone,
  MapPin,
  Star,
  Heart,

  // 🆕 Review / Rating icons
  Sparkles,      // Service
  Briefcase,     // Professionalism
  Clock,         // Timeliness
  DollarSign,    // Value for money
  Target,        // Goal achievement
  Trophy,        // Overall experience
} from "lucide-react";

const ICONS = {
  /* ===== General ===== */
  category: Tag,
  description: FileText,
  phone: Phone,
  city: MapPin,
  rating: Star,
  favorite: Heart,

  /* ===== Review ratings ===== */
  service: Sparkles,
  professionalism: Briefcase,
  timeliness: Clock,
  availability: Phone,
  valueForMoney: DollarSign,
  goalAchievement: Target,
  overall: Trophy,
};

export default function Icon({
  name,
  size = 18,
  color = "#5c2d91",
  strokeWidth = 1.8,
  className = "",
}) {
  const IconComponent = ICONS[name];

  if (!IconComponent) return null;

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden
    />
  );
}
