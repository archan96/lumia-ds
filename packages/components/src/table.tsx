import type { HTMLAttributes, TableHTMLAttributes } from 'react';
import { createContext, forwardRef, useContext } from 'react';
import { cn } from './utils';

type TableDensity = 'comfortable' | 'compact';
type TableAlignment = 'left' | 'center' | 'right';

type TableContextValue = {
  density: TableDensity;
  zebra: boolean;
  stickyHeader: boolean;
};

const TableContext = createContext<TableContextValue>({
  density: 'comfortable',
  zebra: false,
  stickyHeader: false,
});

const TableSectionContext = createContext<'header' | 'body'>('body');

const densityClasses: Record<TableDensity, string> = {
  comfortable: 'h-12 px-4 py-3',
  compact: 'h-10 px-3 py-2',
};

const alignmentClasses: Record<TableAlignment, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const useTableContext = () => useContext(TableContext);
const useTableSection = () => useContext(TableSectionContext);

export type TableProps = TableHTMLAttributes<HTMLTableElement> & {
  density?: TableDensity;
  zebra?: boolean;
  stickyHeader?: boolean;
};

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  {
    children,
    className,
    density = 'comfortable',
    zebra = false,
    stickyHeader = false,
    ...props
  },
  ref,
) {
  return (
    <TableContext.Provider value={{ density, zebra, stickyHeader }}>
      <table
        ref={ref}
        className={cn(
          'w-full border border-border/80 bg-background text-sm text-foreground border-separate border-spacing-0 rounded-lg shadow-sm overflow-hidden',
          className,
        )}
        {...props}
      >
        {children}
      </table>
    </TableContext.Provider>
  );
});

export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;
export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(function TableHeader({ children, className, ...props }, ref) {
  return (
    <TableSectionContext.Provider value="header">
      <thead
        ref={ref}
        className={cn('bg-muted/60 text-muted-foreground', className)}
        {...props}
      >
        {children}
      </thead>
    </TableSectionContext.Provider>
  );
});

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;
export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody({ children, className, ...props }, ref) {
    return (
      <TableSectionContext.Provider value="body">
        <tbody
          ref={ref}
          className={cn(
            'bg-background [&_tr:last-child_td]:border-b-0 [&_tr:last-child_th]:border-b-0 [&_tr:last-child_td:first-child]:rounded-bl-lg [&_tr:last-child_td:last-child]:rounded-br-lg',
            className,
          )}
          {...props}
        >
          {children}
        </tbody>
      </TableSectionContext.Provider>
    );
  },
);

export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow({ className, ...props }, ref) {
    const { zebra } = useTableContext();
    const section = useTableSection();

    return (
      <tr
        ref={ref}
        className={cn(
          'transition-colors',
          section === 'body' && 'hover:bg-muted/40',
          section === 'body' && zebra && 'odd:bg-muted/30',
          className,
        )}
        {...props}
      />
    );
  },
);

export type TableCellProps = HTMLAttributes<HTMLTableCellElement> & {
  as?: 'td' | 'th';
  align?: TableAlignment;
};

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell(
    { as = 'td', align = 'left', className, children, ...props },
    ref,
  ) {
    const { density, stickyHeader } = useTableContext();
    const section = useTableSection();
    const Component = as;
    const isHeaderCell = section === 'header' || as === 'th';

    return (
      <Component
        ref={ref as never}
        className={cn(
          'align-middle border-b border-border/70',
          densityClasses[density],
          alignmentClasses[align],
          isHeaderCell
            ? 'text-xs font-semibold uppercase tracking-wide text-muted-foreground'
            : 'text-sm text-foreground',
          stickyHeader &&
            isHeaderCell &&
            'sticky top-0 z-10 bg-muted/70 backdrop-blur-sm',
          section === 'header' && 'first:rounded-tl-lg last:rounded-tr-lg',
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
