import type { FC, ReactNode } from 'react';
export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from './card';
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './card';
export type { ButtonProps } from './button';
export { Button, buttonStyles } from './button';
export type { CheckboxProps } from './checkbox';
export { Checkbox } from './checkbox';
export type { InputProps, TextareaProps } from './input';
export { Input, Textarea } from './input';
export type { RadioProps } from './radio';
export { Radio } from './radio';
export type { SelectProps } from './select';
export { Select } from './select';
export type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from './tabs';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
export type {
  DialogProps,
  DialogTriggerProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogFooterProps,
} from './dialog';
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './dialog';
export type {
  SheetProps,
  SheetTriggerProps,
  SheetContentProps,
  SheetHeaderProps,
  SheetTitleProps,
  SheetDescriptionProps,
  SheetFooterProps,
} from './sheet';
export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from './sheet';

export type HelloProps = {
  name?: string;
  children?: ReactNode;
};

export const Hello: FC<HelloProps> = ({ name = 'Lumia', children }) => {
  return (
    <div role="status">
      <p>Hello, {name}!</p>
      {children}
    </div>
  );
};

export default Hello;
