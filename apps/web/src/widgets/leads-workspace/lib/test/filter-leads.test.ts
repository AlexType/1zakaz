import { describe, expect, it } from "vitest";
import { DEMO_LEADS } from "../stories/leads-demo";
import {
  EMPTY_LEAD_FILTERS,
  filterLeads,
  isLeadOverdue,
} from "../filter-leads";

describe("filterLeads", () => {
  it("ищет одновременно по клиенту, телефону и запросу", () => {
    expect(
      filterLeads(DEMO_LEADS, {
        ...EMPTY_LEAD_FILTERS,
        search: "Monjaro",
      }).map((lead) => lead.id),
    ).toEqual(["L-1041"]);

    expect(
      filterLeads(DEMO_LEADS, {
        ...EMPTY_LEAD_FILTERS,
        search: "5552010",
      }).map((lead) => lead.id),
    ).toEqual(["L-1041"]);
  });

  it("оставляет только просроченные незакрытые заявки", () => {
    const now = new Date("2026-09-24T12:00:00Z");
    const result = filterLeads(
      DEMO_LEADS,
      { ...EMPTY_LEAD_FILTERS, overdueOnly: true },
      now,
    );

    expect(result.map((lead) => lead.id)).toEqual(["L-1042", "L-1040"]);
    expect(isLeadOverdue(DEMO_LEADS[3], now)).toBe(false);
  });
});
