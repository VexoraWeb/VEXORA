import {
  Briefcase,
  Globe,
  LayoutTemplate,
  RefreshCw,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  ShoppingBag,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { ServiceIcon } from "@/config/site";

export const serviceIcons: Record<ServiceIcon, LucideIcon> = {
  globe: Globe,
  briefcase: Briefcase,
  rocket: Rocket,
  shopping: ShoppingBag,
  portfolio: LayoutTemplate,
  refresh: RefreshCw,
  server: Server,
  wrench: Wrench,
  search: Search,
  shield: ShieldCheck,
};
