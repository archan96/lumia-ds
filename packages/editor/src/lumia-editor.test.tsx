import { act } from 'react';
import { describe, expect, it } from 'vitest';
import { createRoot } from 'react-dom/client';
import { LumiaEditor } from './lumia-editor';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const createTestRoot = () => {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);

  return { root, host };
};

describe('LumiaEditor', () => {
  it('renders a textarea', async () => {
    const { root, host } = createTestRoot();

    await act(async () => {
      root.render(<LumiaEditor />);
    });

    const textarea = host.querySelector('textarea');
    expect(textarea).toBeTruthy();

    await act(async () => root.unmount());
    document.body.removeChild(host);
  });

  it('renders with custom placeholder', async () => {
    const { root, host } = createTestRoot();

    await act(async () => {
      root.render(<LumiaEditor placeholder="Custom placeholder" />);
    });

    const textarea = host.querySelector('textarea');
    expect(textarea?.placeholder).toBe('Custom placeholder');

    await act(async () => root.unmount());
    document.body.removeChild(host);
  });
});
