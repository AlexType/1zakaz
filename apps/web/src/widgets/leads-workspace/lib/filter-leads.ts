import type { Lead } from "@/entities/lead";
import { LEAD_VEHICLE_TYPE_LABELS } from "../model/leads-options";

export type LeadFilters = {
  search: string;
  status: string;
  manager: string;
  source: string;
  country: string;
  overdueOnly: boolean;
};

export const EMPTY_LEAD_FILTERS: LeadFilters = {
  search: "",
  status: "all",
  manager: "all",
  source: "all",
  country: "all",
  overdueOnly: false,
};

export function isLeadOverdue(lead: Lead, now = new Date()) {
  if (!lead.nextActionAt || lead.status === "won" || lead.status === "lost") {
    return false;
  }

  return new Date(lead.nextActionAt).getTime() < now.getTime();
}

export function filterLeads(
  leads: Lead[],
  filters: LeadFilters,
  now = new Date(),
) {
  const query = filters.search.trim().toLocaleLowerCase("ru-RU");
  const queryDigits = query.replace(/\D/g, "");

  return leads.filter((lead) => {
    const request = [
      lead.id,
      lead.clientName,
      lead.phone,
      lead.subject,
      lead.message,
      lead.vehicleQuery,
      lead.vehicleType ? LEAD_VEHICLE_TYPE_LABELS[lead.vehicleType] : null,
      lead.carLabel,
      lead.source,
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("ru-RU");
    const matchesSearch =
      !query ||
      request.includes(query) ||
      (queryDigits.length >= 3 &&
        lead.phone.replace(/\D/g, "").includes(queryDigits));

    return (
      matchesSearch &&
      (filters.status === "all" || lead.status === filters.status) &&
      (filters.country === "all" || lead.country === filters.country) &&
      (filters.source === "all" || lead.source === filters.source) &&
      (filters.manager === "all" ||
        (filters.manager === "none"
          ? !lead.managerName
          : lead.managerName === filters.manager)) &&
      (!filters.overdueOnly || isLeadOverdue(lead, now))
    );
  });
}
