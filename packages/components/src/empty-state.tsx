import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { Icon, type IconId } from '@lumia/icons';
import { Button, buttonStyles } from './button';
import { cn } from './utils';

export type EmptyStateAction = {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: IconId;
};

export type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  icon?: IconId;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
};

const actionClassName = (variant: 'primary' | 'outline') =>
  cn(
    buttonStyles.base,
    buttonStyles.variants[variant],
    buttonStyles.sizes.md,
    'inline-flex',
  );

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState(
    {
      title,
      description,
      icon,
      primaryAction,
      secondaryAction,
      className,
      ...props
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          'flex w-full flex-col items-center justify-center gap-4 px-6 py-12 text-center',
          className,
        )}
        {...props}
      >
        {icon ? (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-600">
            <Icon id={icon} size={32} aria-hidden="true" />
          </div>
        ) : null}

        <div className="flex max-w-prose flex-col items-center gap-2">
          <h3 className="text-xl font-semibold leading-7 tracking-tight text-foreground">
            {title}
          </h3>
          {description ? (
            <p className="text-sm leading-6 text-muted">{description}</p>
          ) : null}
        </div>

        {primaryAction || secondaryAction ? (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {primaryAction ? (
              <ActionButton action={primaryAction} variant="primary" />
            ) : null}
            {secondaryAction ? (
              <ActionButton action={secondaryAction} variant="outline" />
            ) : null}
          </div>
        ) : null}
      </div>
    );
  },
);

type ActionButtonProps = {
  action: EmptyStateAction;
  variant: 'primary' | 'outline';
};

const ActionButton = ({ action, variant }: ActionButtonProps) => {
  const content = (
    <>
      {action.icon ? (
        <Icon id={action.icon} size={16} className="shrink-0" />
      ) : null}
      <span>{action.label}</span>
    </>
  );

  if (action.href) {
    return (
      <a
        href={action.href}
        onClick={action.onClick}
        className={actionClassName(variant)}
      >
        {content}
      </a>
    );
  }

  return (
    <Button
      variant={variant === 'primary' ? 'primary' : 'outline'}
      onClick={action.onClick}
    >
      {content}
    </Button>
  );
};
