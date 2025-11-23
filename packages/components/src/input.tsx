import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { forwardRef, useId } from 'react';
import { cn } from './utils';

type FieldProps = {
  invalid?: boolean;
  hint?: string;
};

export type InputProps = InputHTMLAttributes<HTMLInputElement> & FieldProps;

export type TextareaProps =
  TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps;

const fieldWrapperClasses = 'flex flex-col gap-1.5';
const baseFieldClasses =
  'flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50';
const invalidFieldClasses =
  'border-destructive focus-visible:ring-destructive';
const hintClasses = 'text-sm leading-5 text-muted';
const invalidHintClasses = 'text-destructive';
const textareaAdditionalClasses = 'min-h-[120px] resize-y';

const buildAriaDescribedBy = (
  describedBy?: string | null,
  hintId?: string,
) => [describedBy, hintId].filter(Boolean).join(' ') || undefined;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, hint, invalid = false, 'aria-describedby': describedBy, ...props },
  ref,
) {
  const generatedHintId = useId();
  const hintId = hint ? generatedHintId : undefined;
  const ariaDescribedBy = buildAriaDescribedBy(describedBy, hintId);

  return (
    <div className={fieldWrapperClasses}>
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        aria-describedby={ariaDescribedBy}
        className={cn(
          baseFieldClasses,
          invalid && invalidFieldClasses,
          className,
        )}
        {...props}
      />
      {hint ? (
        <p id={hintId} className={cn(hintClasses, invalid && invalidHintClasses)}>
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      className,
      hint,
      invalid = false,
      'aria-describedby': describedBy,
      ...props
    },
    ref,
  ) {
    const generatedHintId = useId();
    const hintId = hint ? generatedHintId : undefined;
    const ariaDescribedBy = buildAriaDescribedBy(describedBy, hintId);

    return (
      <div className={fieldWrapperClasses}>
        <textarea
          ref={ref}
          aria-invalid={invalid || undefined}
          aria-describedby={ariaDescribedBy}
          className={cn(
            baseFieldClasses,
            textareaAdditionalClasses,
            invalid && invalidFieldClasses,
            className,
          )}
          {...props}
        />
        {hint ? (
          <p
            id={hintId}
            className={cn(hintClasses, invalid && invalidHintClasses)}
          >
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
