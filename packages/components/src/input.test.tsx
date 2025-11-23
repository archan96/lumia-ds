import { act } from 'react';
import { describe, expect, it } from 'vitest';
import { createRoot } from 'react-dom/client';
import { Input, Textarea } from './input';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const createTestRoot = () => {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);

  return { root, host };
};

describe('Input component', () => {
  it('renders with helper text and default styles', async () => {
    const { root, host } = createTestRoot();

    await act(async () => {
      root.render(<Input placeholder="Name" hint="Helper text" />);
    });

    const input = host.querySelector('input');
    const hint = host.querySelector('p');

    expect(input?.getAttribute('placeholder')).toBe('Name');
    expect(input?.getAttribute('aria-invalid')).toBeNull();
    expect(input?.className).toContain('border-border');
    expect(input?.className).toContain('focus-visible:ring-primary-500');
    expect(input?.getAttribute('aria-describedby')).toBe(hint?.id);
    expect(hint?.textContent).toBe('Helper text');
    expect(hint?.className).toContain('text-muted');

    await act(async () => root.unmount());
    document.body.removeChild(host);
  });

  it('applies invalid state and combines describedby ids', async () => {
    const { root, host } = createTestRoot();

    await act(async () => {
      root.render(
        <Input
          invalid
          hint="This field is required"
          aria-describedby="existing"
        />,
      );
    });

    const input = host.querySelector('input');
    const hint = host.querySelector('p');
    const describedBy = input?.getAttribute('aria-describedby')?.split(' ');

    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(input?.className).toContain('border-destructive');
    expect(describedBy).toContain('existing');
    expect(describedBy).toContain(hint?.id);
    expect(hint?.className).toContain('text-destructive');

    await act(async () => root.unmount());
    document.body.removeChild(host);
  });
});

describe('Textarea component', () => {
  it('renders textarea with invalid styles and hint', async () => {
    const { root, host } = createTestRoot();

    await act(async () => {
      root.render(
        <Textarea defaultValue="Details" invalid hint="Fix the issue" />,
      );
    });

    const textarea = host.querySelector('textarea');
    const hint = host.querySelector('p');

    expect(textarea?.nodeName).toBe('TEXTAREA');
    expect(textarea?.className).toContain('resize-y');
    expect(textarea?.className).toContain('border-destructive');
    expect(textarea?.getAttribute('aria-invalid')).toBe('true');
    expect(hint?.textContent).toBe('Fix the issue');
    expect(hint?.className).toContain('text-destructive');

    await act(async () => root.unmount());
    document.body.removeChild(host);
  });
});
