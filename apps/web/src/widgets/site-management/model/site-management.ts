import type { JSONContent } from "@tiptap/react";

export type SitePageStatus = "draft" | "published";
export type SiteBlockSource = "manual" | "cars" | "articles" | "cases";

export type SitePageBlock = {
  id: string;
  title: string;
  enabled: boolean;
  source: SiteBlockSource;
};

export type SitePage = {
  id: string;
  title: string;
  path: string;
  heading: string;
  lead: string;
  status: SitePageStatus;
  updatedAt: string;
  blocks: SitePageBlock[];
};

export type NavigationItem = {
  id: string;
  label: string;
  url: string;
  placement: "header" | "footer" | "both";
  enabled: boolean;
};

export type CompanyDetails = {
  publicName: string;
  legalName: string;
  inn: string;
  ogrn: string;
  address: string;
  phone: string;
  email: string;
  telegramUrl: string;
  whatsappUrl: string;
  workingHours: string;
};

export type LegalDocument = {
  id: string;
  title: string;
  path: string;
  status: SitePageStatus;
  updatedAt: string;
  content: JSONContent;
};

export type SiteRedirect = {
  id: string;
  sourcePath: string;
  destinationPath: string;
  enabled: boolean;
};

export type SiteFormSettings = {
  id: string;
  name: string;
  successTitle: string;
  successMessage: string;
  responseTimeText: string;
  suggestedArticleIds: string[];
  consentDocumentId: string;
};

export type SiteArticleOption = {
  value: string;
  label: string;
};
