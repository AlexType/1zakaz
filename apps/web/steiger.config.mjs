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
    // Маршрут Next.js лежит вне src и ссылается на срез один раз.
    files: ["./src/_pages/**"],
    rules: {
      "fsd/insignificant-slice": "off",
    },
  },
]);
