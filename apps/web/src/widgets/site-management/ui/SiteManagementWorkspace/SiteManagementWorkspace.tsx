"use client";

import { useState } from "react";
import { Paper, Stack, Tabs } from "@mantine/core";
import {
  IconBuilding,
  IconFileText,
  IconForms,
  IconMenu2,
  IconRoute,
  IconTemplate,
} from "@tabler/icons-react";
import { showActionSuccess } from "@/shared/lib/show-action-notification";
import { AdminPageHeader } from "@/shared/ui/AdminPageHeader";
import { GridErrorState } from "@/shared/ui/GridErrorState";
import { PageLoadingState } from "@/shared/ui/PageLoadingState";
import {
  DEMO_COMPANY,
  DEMO_LEGAL_DOCUMENTS,
  DEMO_NAVIGATION,
  DEMO_REDIRECTS,
  DEMO_SITE_ARTICLES,
  DEMO_SITE_FORMS,
  DEMO_SITE_PAGES,
} from "../../lib/stories/site-management-demo";
import type {
  CompanyDetails,
  LegalDocument,
  NavigationItem,
  SitePage,
  SiteRedirect,
  SiteFormSettings,
} from "../../model/site-management";
import { CompanyDetailsCard } from "../CompanyDetailsCard";
import { LegalDocumentsCard } from "../LegalDocumentsCard";
import { SiteNavigationCard } from "../SiteNavigationCard";
import { SiteFormsCard } from "../SiteFormsCard";
import { SitePagesCard } from "../SitePagesCard";
import { SiteRedirectsCard } from "../SiteRedirectsCard";
import classes from "./SiteManagementWorkspace.module.css";

type Props = {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  initialTab?: string;
};

export function SiteManagementWorkspace({
  loading = false,
  error = null,
  onRetry,
  initialTab = "pages",
}: Props = {}) {
  const [pages, setPages] = useState<SitePage[]>(DEMO_SITE_PAGES);
  const [navigation, setNavigation] =
    useState<NavigationItem[]>(DEMO_NAVIGATION);
  const [company, setCompany] = useState<CompanyDetails>(DEMO_COMPANY);
  const [documents, setDocuments] =
    useState<LegalDocument[]>(DEMO_LEGAL_DOCUMENTS);
  const [redirects, setRedirects] = useState<SiteRedirect[]>(DEMO_REDIRECTS);
  const [forms, setForms] = useState<SiteFormSettings[]>(DEMO_SITE_FORMS);

  function savePage(page: SitePage) {
    setPages((current) =>
      current.map((item) => (item.id === page.id ? page : item)),
    );
    showActionSuccess(
      page.status === "published"
        ? "Страница опубликована"
        : "Черновик страницы сохранён",
    );
  }
  function saveDocument(document: LegalDocument) {
    setDocuments((current) =>
      current.map((item) => (item.id === document.id ? document : item)),
    );
    showActionSuccess("Документ сохранён");
  }
  function saveForm(form: SiteFormSettings) {
    setForms((current) =>
      current.map((item) => (item.id === form.id ? form : item)),
    );
    showActionSuccess("Настройки формы сохранены");
  }

  return (
    <section className={classes.section} aria-label="Управление сайтом">
      <Stack gap="lg">
        <AdminPageHeader
          title="Сайт"
          description="Страницы, навигация, формы и данные компании"
        />
        {loading ? (
          <Paper withBorder radius="lg">
            <PageLoadingState label="Загружаем настройки сайта…" />
          </Paper>
        ) : error ? (
          <Paper withBorder radius="lg">
            <GridErrorState
              title="Не удалось загрузить настройки сайта"
              message={error}
              onRetry={onRetry}
            />
          </Paper>
        ) : (
          <Tabs defaultValue={initialTab}>
            <Tabs.List className={classes.tabsList}>
              <Tabs.Tab value="pages" leftSection={<IconTemplate size={17} />}>
                Страницы
              </Tabs.Tab>
              <Tabs.Tab
                value="navigation"
                leftSection={<IconMenu2 size={17} />}
              >
                Шапка и подвал
              </Tabs.Tab>
              <Tabs.Tab
                value="company"
                leftSection={<IconBuilding size={17} />}
              >
                Компания
              </Tabs.Tab>
              <Tabs.Tab
                value="documents"
                leftSection={<IconFileText size={17} />}
              >
                Документы
              </Tabs.Tab>
              <Tabs.Tab value="forms" leftSection={<IconForms size={17} />}>
                Формы
              </Tabs.Tab>
              <Tabs.Tab value="redirects" leftSection={<IconRoute size={17} />}>
                Перенаправления
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="pages" pt="lg">
              <SitePagesCard pages={pages} onSave={savePage} />
            </Tabs.Panel>
            <Tabs.Panel value="navigation" pt="lg">
              <SiteNavigationCard
                items={navigation}
                onChange={setNavigation}
                onSave={() => showActionSuccess("Меню сайта сохранено")}
              />
            </Tabs.Panel>
            <Tabs.Panel value="company" pt="lg">
              <CompanyDetailsCard
                value={company}
                onChange={setCompany}
                onSave={() => showActionSuccess("Данные компании сохранены")}
              />
            </Tabs.Panel>
            <Tabs.Panel value="documents" pt="lg">
              <LegalDocumentsCard documents={documents} onSave={saveDocument} />
            </Tabs.Panel>
            <Tabs.Panel value="forms" pt="lg">
              <SiteFormsCard
                forms={forms}
                articleOptions={DEMO_SITE_ARTICLES}
                documents={documents}
                onSave={saveForm}
              />
            </Tabs.Panel>
            <Tabs.Panel value="redirects" pt="lg">
              <SiteRedirectsCard
                redirects={redirects}
                onChange={setRedirects}
                onSave={() => showActionSuccess("Перенаправления сохранены")}
              />
            </Tabs.Panel>
          </Tabs>
        )}
      </Stack>
    </section>
  );
}
