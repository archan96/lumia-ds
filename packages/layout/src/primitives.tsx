import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

const cx = (...classes: Array<string | undefined | false | null>) =>
  classes.filter(Boolean).join(' ');

export type LayoutShellProps = HTMLAttributes<HTMLDivElement>;

export const LayoutShell = forwardRef<HTMLDivElement, LayoutShellProps>(
  function LayoutShell({ children, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cx(
          'flex min-h-screen flex-col bg-background text-foreground',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

export type LayoutHeaderProps = HTMLAttributes<HTMLDivElement>;

export const LayoutHeader = forwardRef<HTMLDivElement, LayoutHeaderProps>(
  function LayoutHeader({ children, className, ...props }, ref) {
    return (
      <header
        ref={ref}
        className={cx(
          'flex items-center justify-between gap-3 border-b border-border bg-background/80 px-6 py-4 backdrop-blur supports-[backdrop-filter]:backdrop-blur',
          className,
        )}
        {...props}
      >
        {children}
      </header>
    );
  },
);

export type LayoutBodyProps = HTMLAttributes<HTMLDivElement>;

export const LayoutBody = forwardRef<HTMLDivElement, LayoutBodyProps>(
  function LayoutBody({ children, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cx('flex flex-1 min-h-0 bg-background', className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

export type LayoutSidebarProps = HTMLAttributes<HTMLDivElement> & {
  collapsed?: boolean;
};

export const LayoutSidebar = forwardRef<HTMLDivElement, LayoutSidebarProps>(
  function LayoutSidebar(
    { children, className, collapsed = false, ...props },
    ref,
  ) {
    return (
      <aside
        ref={ref}
        data-collapsed={collapsed}
        className={cx(
          'hidden border-r border-border bg-muted/40 transition-[width,transform] duration-200 md:flex md:flex-col',
          collapsed ? 'w-20' : 'w-64',
          className,
        )}
        {...props}
      >
        {children}
      </aside>
    );
  },
);

export type LayoutMainProps = HTMLAttributes<HTMLDivElement>;

export const LayoutMain = forwardRef<HTMLDivElement, LayoutMainProps>(
  function LayoutMain({ children, className, ...props }, ref) {
    return (
      <main
        ref={ref}
        className={cx(
          'flex-1 overflow-hidden bg-background text-foreground',
          className,
        )}
        {...props}
      >
        {children}
      </main>
    );
  },
);

export type LayoutContentProps = HTMLAttributes<HTMLDivElement> & {
  padded?: boolean;
};

export const LayoutContent = forwardRef<HTMLDivElement, LayoutContentProps>(
  function LayoutContent(
    { children, className, padded = true, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cx(
          'mx-auto flex max-w-6xl flex-col gap-6',
          padded && 'px-6 py-6',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

export type LayoutFooterProps = HTMLAttributes<HTMLDivElement>;

export const LayoutFooter = forwardRef<HTMLDivElement, LayoutFooterProps>(
  function LayoutFooter({ children, className, ...props }, ref) {
    return (
      <footer
        ref={ref}
        className={cx(
          'border-t border-border bg-background px-6 py-4 text-sm text-muted-foreground',
          className,
        )}
        {...props}
      >
        {children}
      </footer>
    );
  },
);
