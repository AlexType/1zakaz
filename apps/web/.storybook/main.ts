import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: ["./welcome.stories.tsx", "../src/**/*.stories.@(ts|tsx)"],
  framework: "@storybook/nextjs-vite",
};

export default config;
