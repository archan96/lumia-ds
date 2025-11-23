/* istanbul ignore file */
import type { ButtonProps } from './button';
import { Button } from './button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Click',
    variant: 'primary',
    size: 'md',
  },
};

export default meta;

export const Playground = (args: ButtonProps) => <Button {...args} />;

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-3 bg-background p-4">
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="destructive">Destructive</Button>
    <Button variant="link">Link</Button>
  </div>
);

export const Sizes = () => (
  <div className="flex flex-wrap items-center gap-3 bg-background p-4">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
    <Button size="icon" aria-label="Icon button">
      *
    </Button>
  </div>
);
