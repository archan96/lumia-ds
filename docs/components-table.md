# Table wrapper (DS-701)

Design-system table wrapper around Shadcn primitives with DS tokens and a minimal API (no pagination/sorting yet).

## Exports
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell` from `@lumia/components`.

## Props
- `Table`
  - `density?: 'comfortable' | 'compact'` (default: `comfortable`) – controls row height and padding.
  - `zebra?: boolean` (default: `false`) – applies `odd` row striping in the body.
  - `stickyHeader?: boolean` (default: `false`) – keeps header cells pinned with a subtle backdrop blur.
- `TableCell`
  - `as?: 'td' | 'th'` – defaults to `td`; use `th` for headers.
  - `align?: 'left' | 'center' | 'right'` (default: `left`).

## Usage
```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@lumia/components';

export function UsersTable() {
  return (
    <Table density="compact" zebra stickyHeader>
      <TableHeader>
        <TableRow>
          <TableCell as="th">Name</TableCell>
          <TableCell as="th">Role</TableCell>
          <TableCell as="th" align="right">
            Status
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ada Lovelace</TableCell>
          <TableCell>Engineer</TableCell>
          <TableCell align="right">Active</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
```

## Notes
- Styling aligns with DS tokens for borders, hover state, and typography.
- No built-in pagination/sorting/virtualization; intended for straightforward data lists up to a few hundred rows.
- Sticky header works when the table sits inside a scrollable container.
