import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

const cx = (...classes: Array<string | undefined | false | null>) =>
  classes.filter(Boolean).join(' ');

export type StackLayoutProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export const StackLayout = forwardRef<HTMLDivElement, StackLayoutProps>(
  function StackLayout({ title, actions, children, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cx(
          'flex min-h-screen flex-col bg-background text-foreground',
          className,
        )}
        {...props}
      >
        {(title || actions) && (
          <div
            data-slot="stack-header"
            className="sticky top-0 z-10 border-b border-border/80 bg-background/80 px-6 py-5 backdrop-blur supports-[backdrop-filter]:backdrop-blur"
          >
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
              {title ? (
                <h1 className="text-xl font-semibold leading-7 tracking-tight">
                  {title}
                </h1>
              ) : (
                <span className="sr-only">Stack layout</span>
              )}

              {actions && (
                <div
                  data-slot="stack-actions"
                  className="flex flex-wrap items-center gap-3"
                >
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 bg-gradient-to-b from-background via-background to-muted/30">
          <div
            data-slot="stack-body"
            className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-6"
          >
            <div className="flex flex-col gap-4">{children}</div>
          </div>
        </div>
      </div>
    );
  },
);
