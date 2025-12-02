/* istanbul ignore file */
import type { Meta, StoryObj } from '@storybook/react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from './table';

const roster = [
  {
    name: 'Ava Green',
    role: 'Product Designer',
    location: 'Remote',
    status: 'Active',
  },
  {
    name: 'Miles Hart',
    role: 'Engineering Manager',
    location: 'New York, USA',
    status: 'Active',
  },
  {
    name: 'Priya Shah',
    role: 'Staff Engineer',
    location: 'Toronto, CA',
    status: 'On leave',
  },
  {
    name: 'Kai Lee',
    role: 'Researcher',
    location: 'Seoul, KR',
    status: 'Active',
  },
  {
    name: 'Lucia Gomez',
    role: 'Data Scientist',
    location: 'Madrid, ES',
    status: 'Contract',
  },
  {
    name: 'Robin Xu',
    role: 'QA Lead',
    location: 'Singapore',
    status: 'Active',
  },
];

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  args: {
    density: 'comfortable',
    zebra: true,
    stickyHeader: false,
  },
  argTypes: {
    density: {
      control: 'select',
      options: ['comfortable', 'compact'],
    },
    zebra: {
      control: 'boolean',
    },
    stickyHeader: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof Table>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-5xl overflow-hidden rounded-lg border border-border bg-background p-4 shadow-sm">
      <Table {...args}>
        <TableHeader>
          <TableRow>
            <TableCell as="th">Name</TableCell>
            <TableCell as="th">Role</TableCell>
            <TableCell as="th">Location</TableCell>
            <TableCell as="th" align="right">
              Status
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roster.map((person) => (
            <TableRow key={person.name}>
              <TableCell>{person.name}</TableCell>
              <TableCell>{person.role}</TableCell>
              <TableCell>{person.location}</TableCell>
              <TableCell align="right">{person.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};

const manyRows = Array.from({ length: 120 }, (_, index) => ({
  id: index + 1,
  owner: index % 3 === 0 ? 'Platform' : index % 2 === 0 ? 'Design' : 'Payments',
  uptime: `${99 + (index % 5) * 0.1}%`,
  alerts: index % 4 === 0 ? '2 open' : 'None',
}));

export const StickyHeaderWithManyRows: Story = {
  render: () => (
    <div className="max-w-5xl rounded-lg border border-border bg-background p-4 shadow-sm">
      <p className="mb-3 text-sm text-muted">
        Sticky headers stay visible while scrolling, and compact density keeps
        high row counts legible.
      </p>
      <div className="max-h-[420px] overflow-auto rounded-md border border-border/80">
        <Table density="compact" zebra stickyHeader>
          <TableHeader>
            <TableRow>
              <TableCell as="th">Service</TableCell>
              <TableCell as="th">Owner</TableCell>
              <TableCell as="th" align="right">
                Uptime
              </TableCell>
              <TableCell as="th" align="right">
                Alerts
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {manyRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>svc-{row.id.toString().padStart(3, '0')}</TableCell>
                <TableCell>{row.owner}</TableCell>
                <TableCell align="right">{row.uptime}</TableCell>
                <TableCell align="right">{row.alerts}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows sticky headers and compact padding while rendering 100+ rows without pagination or virtualization.',
      },
    },
  },
};
