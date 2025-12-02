import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Simulate } from 'react-dom/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { Controller, useForm, useFormContext } from 'react-hook-form';
import { LumiaForm } from './form';
import { ValidatedInput } from './validated-input';
import { required } from './validation';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const createTestRoot = () => {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);

  return { host, root };
};

const DirtyFlag = () => {
  const { formState } = useFormContext<{ name: string }>();
  return (
    <span data-dirty={formState.isDirty ? 'true' : 'false'} aria-hidden="true">
      state
    </span>
  );
};

describe('LumiaForm', () => {
  it('uses provided methods, wraps FormProvider, and submits values', async () => {
    const handleSubmit = vi.fn();
    const Form = () => {
      const methods = useForm<{ name: string }>({
        defaultValues: { name: '' },
      });

      return (
        <LumiaForm methods={methods} onSubmit={handleSubmit}>
          {({ control }) => (
            <>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field, fieldState }) => (
                  <ValidatedInput
                    {...field}
                    ref={field.ref}
                    value={field.value ?? ''}
                    onChange={(next) => field.onChange(next)}
                    onBlur={field.onBlur}
                    hint="Full name"
                    errorMessage={fieldState.error?.message}
                    rules={[required('Name is required')]}
                  />
                )}
              />
              <DirtyFlag />
              <button type="submit">Save</button>
            </>
          )}
        </LumiaForm>
      );
    };

    const { host, root } = createTestRoot();

    await act(async () => {
      root.render(<Form />);
    });

    const form = host.querySelector('form') as HTMLFormElement;
    const input = host.querySelector('input') as HTMLInputElement;
    const state = host.querySelector('span[data-dirty]') as HTMLSpanElement;

    expect(state.dataset.dirty).toBe('false');

    await act(async () => {
      input.value = 'Ada Lovelace';
      Simulate.change(input, { target: { value: 'Ada Lovelace' } });
      await Promise.resolve();
    });

    expect(state.dataset.dirty).toBe('true');

    await act(async () => {
      Simulate.submit(form);
      await Promise.resolve();
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      { name: 'Ada Lovelace' },
      expect.anything(),
    );

    await act(async () => root.unmount());
    document.body.removeChild(host);
  });

  it('creates methods from options when not provided and reports validation errors', async () => {
    const handleSubmit = vi.fn();
    const handleError = vi.fn();

    const Form = () => (
      <LumiaForm
        onSubmit={handleSubmit}
        onError={handleError}
        options={{ defaultValues: { name: '' } }}
      >
        {({ control }) => (
          <>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field, fieldState }) => (
                <ValidatedInput
                  {...field}
                  ref={field.ref}
                  value={field.value ?? ''}
                  onChange={(next) => field.onChange(next)}
                  onBlur={field.onBlur}
                  hint="Full name"
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
            <button type="submit">Submit</button>
          </>
        )}
      </LumiaForm>
    );

    const { host, root } = createTestRoot();

    await act(async () => {
      root.render(<Form />);
    });

    const form = host.querySelector('form') as HTMLFormElement;
    const input = host.querySelector('input') as HTMLInputElement;

    expect(input.getAttribute('aria-invalid')).toBeNull();

    await act(async () => {
      Simulate.submit(form);
      await Promise.resolve();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
    expect(handleError).toHaveBeenCalledTimes(1);
    expect(host.querySelector('p')?.textContent).toBe('Name is required');
    expect(input.getAttribute('aria-invalid')).toBe('true');

    await act(async () => root.unmount());
    document.body.removeChild(host);
  });
});
