import { describe, it, expect } from 'vitest';
import { defaultTheme, tokens, type ThemeTokens } from './index';

describe('@lumia/tokens', () => {
    it('exports tokens in ThemeTokens shape', () => {
        const theme: ThemeTokens = defaultTheme;

        expect(theme).toBeDefined();
        expect(typeof theme).toBe('object');
    });

    it('exposes defaultTheme as the primary theme export', () => {
        expect(defaultTheme).toEqual(tokens);
    });

    it('includes required color slots', () => {
        expect(defaultTheme.colors).toMatchObject({
            primary: expect.any(String),
            secondary: expect.any(String),
            background: expect.any(String),
            foreground: expect.any(String),
            border: expect.any(String),
            muted: expect.any(String),
            destructive: expect.any(String),
        });
        expect(defaultTheme.colors).toMatchObject({
            primary: '#0f172a',
            secondary: '#f1f5f9',
            background: '#ffffff',
            foreground: '#020817',
            border: '#e2e8f0',
            muted: '#f1f5f9',
            destructive: '#ef4444',
        });
    });

    it('exposes typography families, sizes, and weights', () => {
        expect(defaultTheme.typography.families).toMatchObject({
            sans: expect.any(String),
            mono: expect.any(String),
            display: expect.any(String),
        });
        expect(defaultTheme.typography.sizes).toMatchObject({
            xs: expect.any(String),
            sm: expect.any(String),
            md: expect.any(String),
            lg: expect.any(String),
            xl: expect.any(String),
            '2xl': expect.any(String),
        });
        expect(defaultTheme.typography.weights).toMatchObject({
            regular: expect.any(Number),
            medium: expect.any(Number),
            semibold: expect.any(Number),
            bold: expect.any(Number),
        });
    });

    it('covers spacing, radii, and shadows', () => {
        expect(defaultTheme.spacing).toMatchObject({
            xxs: expect.any(String),
            xs: expect.any(String),
            sm: expect.any(String),
            md: expect.any(String),
            lg: expect.any(String),
            xl: expect.any(String),
            '2xl': expect.any(String),
        });
        expect(defaultTheme.radii).toMatchObject({
            xs: expect.any(String),
            sm: expect.any(String),
            md: expect.any(String),
            lg: expect.any(String),
            pill: expect.any(String),
        });
        expect(defaultTheme.shadows).toMatchObject({
            xs: expect.any(String),
            sm: expect.any(String),
            md: expect.any(String),
            lg: expect.any(String),
            inset: expect.any(String),
        });
    });
});
