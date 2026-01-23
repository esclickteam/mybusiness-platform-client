import {
  Tag,
  FileText,
  Phone,
  MapPin,
  Star,
  Heart,
} from "lucide-react";

const ICONS = {
  category: Tag,
  description: FileText,
  phone: Phone,
  city: MapPin,
  rating: Star,
  favorite: Heart,
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
