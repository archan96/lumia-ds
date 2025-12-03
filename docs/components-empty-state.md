# EmptyState (DS-709)

Reusable empty state pattern for screens with no data yet. Works within a Card or full-page container.

## Exports
- `EmptyState` from `@lumia/components`.

## Props
- `title: string` – required headline.
- `description?: string` – supporting copy.
- `icon?: IconId` – optional leading icon.
- `primaryAction?: { label: string; onClick?: () => void; href?: string; icon?: IconId }`.
- `secondaryAction?: { label: string; onClick?: () => void; href?: string; icon?: IconId }`.
- `className?: string` plus standard `HTMLAttributes<HTMLDivElement>` passthrough.

## Usage
```tsx
import type { IconId } from '@lumia/icons';
import { Card, CardContent, EmptyState } from '@lumia/components';

const sparkle = 'sparkle' as IconId;

export function EmptyTable() {
  return (
    <Card className="h-full">
      <CardContent className="h-full">
        <EmptyState
          icon={sparkle}
          title="No rows yet"
          description="Add your first record to populate the table."
          primaryAction={{ label: 'Add row', onClick: () => console.log('add') }}
          secondaryAction={{ label: 'Invite teammate', href: '/invite' }}
        />
      </CardContent>
    </Card>
  );
}
```

## Notes
- Centered layout with generous spacing; flexes to parent width and fits inside cards or stand-alone sections.
- Actions render as buttons by default; `href` renders as a styled link-like button while keeping the same visuals.
- Icon is optional; without it, the layout remains centered with title/description stacking.
