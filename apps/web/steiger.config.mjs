import { defineConfig } from "steiger";
import fsd from "@feature-sliced/steiger-plugin";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // Префикс _ у _app и _pages — имя из гайда FSD для Next.js, не опечатка.
    rules: {
      "fsd/typo-in-layer-name": "off",
    },
  },
  {
    // Маршруты Next.js лежат вне src; часть фич пока доступна только в Storybook.
    // Анализ ссылок внутри src не видит ни маршрут, ни историю компонента.
    files: ["./src/_pages/**", "./src/features/**"],
    rules: {
      "fsd/insignificant-slice": "off",
    },
  },
  {
    // Тесты утилит находятся в lib/test и не входят в публичный API.
    files: ["./src/shared/lib/test/**"],
    rules: {
      "fsd/public-api": "off",
    },
  },
]);
