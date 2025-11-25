import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { ResourcePageRenderer } from './resource-page-renderer';
import type { DataFetcher, PageSchema, ResourceConfig } from './index';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const createTestRoot = () => {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);

  return { host, root };
};

describe('ResourcePageRenderer', () => {
  it('renders a list page using the provided fetcher', async () => {
    const resource: ResourceConfig = {
      id: 'users',
      pages: { list: 'users-list' },
    };

    const page: PageSchema = {
      id: 'users-list',
      layout: 'stack',
      blocks: [
        {
          id: 'users-table',
          kind: 'table',
          dataSourceId: 'users-data',
          props: {
            title: 'Users',
            columns: [{ key: 'email', label: 'Email' }],
          },
        },
      ],
    };

    const fetcher: DataFetcher = {
      getResourceConfig: vi.fn().mockResolvedValue(resource),
      getPageSchema: vi.fn().mockResolvedValue(page),
      getDataSource: vi.fn().mockResolvedValue({
        records: [{ id: 1, email: 'ada@example.com' }],
      }),
    };

    const { host, root } = createTestRoot();

    await act(async () => {
      root.render(
        <ResourcePageRenderer
          resourceName="users"
          screen="list"
          fetcher={fetcher}
        />,
      );
    });

    await act(async () => {
      await Promise.resolve();
    });

    const table = host.querySelector('table');
    expect(table).toBeTruthy();
    expect(host.textContent).toContain('Users');
    expect(host.textContent).toContain('ada@example.com');

    await act(async () => root.unmount());
    host.remove();
  });
});
