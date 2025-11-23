import { describe, it, expect } from 'vitest';
import { tokens } from './index';

describe('@lumia/tokens', () => {
    it('should export tokens object', () => {
        expect(tokens).toBeDefined();
        expect(typeof tokens).toBe('object');
    });

    it('should have primary color', () => {
        expect(tokens.colors).toBeDefined();
        expect(tokens.colors.primary).toBe('#0070f3');
    });
});
