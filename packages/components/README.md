# @lumia/components

Lumia design-system React components, wrapping shadcn primitives and themed via `@lumia/theme` and `@lumia/tokens`.

## Usage

```tsx
import { Button, Input, Textarea } from '@lumia/components';

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <Button variant="primary" size="md">
        Click
      </Button>

      <Input placeholder="Your name" hint="This will be visible to admins" />

      <Textarea
        placeholder="Describe the issue"
        invalid
        hint="Please add more detail"
      />
    </div>
  );
}
```

Storybook (Button playground):  
`HOME=$(pwd) STORYBOOK_DISABLE_TELEMETRY=1 pnpm --filter @lumia/components storybook -- -p 6006`

More details: see `docs/storybook.md`.

## Local development

- Build: `pnpm --filter @lumia/components build`
- Test (happy-dom): `pnpm --filter @lumia/components test`
