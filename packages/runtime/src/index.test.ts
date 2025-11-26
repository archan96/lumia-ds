import { describe, expect, it } from 'vitest';
import * as Runtime from './index';

describe('runtime exports', () => {
  it('exposes public APIs', () => {
    expect(Runtime.ResourcePageRenderer).toBeDefined();
    expect(Runtime.ListBlock).toBeDefined();
    expect(Runtime.DetailBlock).toBeDefined();
    expect(Runtime.FormBlock).toBeDefined();
  });
});
