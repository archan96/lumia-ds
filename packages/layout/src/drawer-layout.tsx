import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef, useEffect } from 'react';

const cx = (...classes: Array<string | undefined | false | null>) =>
  classes.filter(Boolean).join(' ');

export type DrawerLayoutProps = HTMLAttributes<HTMLDivElement> & {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const DrawerLayout = forwardRef<HTMLDivElement, DrawerLayoutProps>(
  function DrawerLayout(
    { isOpen, onClose, children, className, ...props },
    ref,
  ) {
    useEffect(() => {
      if (!isOpen) {
        return;
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cx(
          'fixed inset-0 z-40 flex items-start justify-end',
          className,
        )}
        {...props}
      >
        <button
          type="button"
          aria-label="Close drawer"
          data-slot="drawer-overlay"
          className="absolute inset-0 h-full w-full bg-foreground/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <aside
          role="dialog"
          aria-modal="true"
          data-slot="drawer-panel"
          className="relative z-10 flex h-full w-[min(90vw,26rem)] flex-col border-l border-border bg-background px-6 py-6 text-foreground shadow-2xl"
        >
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span aria-hidden>X</span>
              <span className="sr-only">Close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pt-2">{children}</div>
        </aside>
      </div>
    );
  },
);
