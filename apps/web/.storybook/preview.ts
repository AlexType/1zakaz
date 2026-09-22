import type { Preview } from "@storybook/nextjs-vite";
import { createElement } from "react";
import { MantineAppProvider } from "../src/_app/mantine";
import "@fontsource-variable/inter/wght.css";
import "@mantine/core/styles.css";
import "../src/_app/styles/globals.css";

const preview: Preview = {
  decorators: [
    (Story) => createElement(MantineAppProvider, null, createElement(Story)),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
