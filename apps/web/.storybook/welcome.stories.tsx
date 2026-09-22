import type { Meta, StoryObj } from "@storybook/nextjs-vite";

function Welcome() {
  return (
    <main>
      <h1>Storybook готов</h1>
    </main>
  );
}

const meta = {
  title: "Storybook/Готов",
  component: Welcome,
} satisfies Meta<typeof Welcome>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
