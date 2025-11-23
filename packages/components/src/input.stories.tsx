/* istanbul ignore file */
import type { InputProps } from './input';
import { Input, Textarea } from './input';

const meta = {
  title: 'Components/Input',
  component: Input,
  args: {
    placeholder: 'Type here',
  },
};

export default meta;

export const Playground = (args: InputProps) => <Input {...args} />;

export const States = () => (
  <div className="flex flex-col gap-4 bg-background p-6">
    <Input placeholder="Regular input" hint="Helper text" />
    <Input
      placeholder="Invalid input"
      invalid
      hint="This field is required"
    />
    <Textarea placeholder="Textarea" hint="Use multiple lines if needed" />
    <Textarea
      placeholder="Textarea invalid"
      invalid
      hint="Please provide more details"
    />
  </div>
);
