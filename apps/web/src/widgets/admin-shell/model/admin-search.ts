import type { TablerIcon } from "@tabler/icons-react";
import type { AdminSection } from "./admin-navigation";

export type AdminSearchItem = {
  id: string;
  label: string;
  description: string;
  group: string;
  section: AdminSection;
  keywords?: string[];
  icon: TablerIcon;
};
