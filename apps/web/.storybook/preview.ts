import type { Preview } from "@storybook/nextjs-vite";
import { createElement } from "react";
import { AdminProviders } from "../src/_app/admin";
import { MantineAppProvider } from "../src/_app/mantine";
import "@fontsource-variable/inter/wght.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@blocknote/mantine/blocknoteStyles.css";
import "mantine-datatable/styles.css";
import "@mantine/tiptap/styles.css";
import "@mantine/lightbox/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import "../src/_app/styles/globals.css";

const preview: Preview = {
  decorators: [
    (Story) =>
      createElement(
        MantineAppProvider,
        null,
        createElement(AdminProviders, null, createElement(Story)),
      ),
  ],
  parameters: {
    options: {
      storySort: (
        left = { title: "", name: "" },
        right = { title: "", name: "" },
      ) => {
        const rootOrder = ["Авторизация", "Панель управления"];
        const sectionOrder = [
          "Общее",
          "Заявки",
          "Автомобили",
          "Статьи",
          "Сайт",
          "Справочники",
          "Сотрудники",
          "Профиль",
        ];
        const screenOrder = [
          "Список",
          "Редактор",
          "Приглашение",
          "Настройки",
          "Навигация",
        ];
        const stateOrder = [
          "Основной вид",
          "Пустой список",
          "Загрузка",
          "Ошибка загрузки",
          "Создание",
          "Редактирование",
          "Создание копии",
          "Ошибка сохранения",
        ];
        const collator = new Intl.Collator("ru-RU", { numeric: true });
        const compareNames = (first = "", second = "", order = [""]) => {
          const firstRank = order.indexOf(first);
          const secondRank = order.indexOf(second);
          if (firstRank !== secondRank) {
            if (firstRank === -1) return 1;
            if (secondRank === -1) return -1;
            return firstRank - secondRank;
          }
          return collator.compare(first, second);
        };

        const firstPath = left.title.split("/");
        const secondPath = right.title.split("/");
        const root = compareNames(firstPath[0], secondPath[0], rootOrder);
        if (root) return root;
        const groupOrder =
          firstPath[0] === "Авторизация"
            ? [
                "Вход и регистрация",
                "Состояния входа",
                "Состояния подтверждения",
              ]
            : sectionOrder;
        const section = compareNames(
          firstPath[1] ?? "",
          secondPath[1] ?? "",
          groupOrder,
        );
        if (section) return section;
        const screen = compareNames(
          firstPath[2] ?? "",
          secondPath[2] ?? "",
          screenOrder,
        );
        if (screen) return screen;
        return compareNames(left.name, right.name, stateOrder);
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
