// Generic Storybook example
import type { Meta, StoryObj } from "@storybook/react-vite";

const Button = ({ label }: { label: string }) => <button type="button">{label}</button>;

const meta: Meta<typeof Button> = {
  title: "Example/Button",
  component: Button,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Click me",
  },
};
