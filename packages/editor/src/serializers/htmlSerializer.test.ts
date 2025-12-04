import { describe, it, expect } from 'vitest';
import {
  docNodeToHtml,
  getFontFamily,
  getFontClassName,
} from './htmlSerializer';
import { DocNode } from '../schema/docSchema';
import type { FontConfig } from '../config/fontConfig';

describe('htmlSerializer', () => {
  const mockFontConfig: FontConfig = {
    allFonts: [
      { id: 'inter', label: 'Inter', category: 'sans' },
      { id: 'roboto', label: 'Roboto', category: 'sans' },
      { id: 'lora', label: 'Lora', category: 'serif' },
    ],
    allowedFonts: ['inter', 'roboto'],
    defaultFontId: 'inter',
  };

  describe('getFontClassName', () => {
    it('returns correct class name for valid font ID', () => {
      const className = getFontClassName('roboto');
      expect(className).toBe('font-roboto');
    });

    it('returns undefined for undefined fontId', () => {
      const className = getFontClassName(undefined);
      expect(className).toBeUndefined();
    });

    it('returns undefined for default font (no redundant classes)', () => {
      const className = getFontClassName('inter', mockFontConfig);
      expect(className).toBeUndefined();
    });

    it('returns class name for non-default font', () => {
      const className = getFontClassName('roboto', mockFontConfig);
      expect(className).toBe('font-roboto');
    });

    it('normalizes disallowed font to default and returns undefined', () => {
      const className = getFontClassName('lora', mockFontConfig);
      // lora is not allowed, gets normalized to inter (default), so no class needed
      expect(className).toBeUndefined();
    });
  });

  describe('getFontFamily', () => {
    it('returns correct font stack for valid font ID', () => {
      const fontFamily = getFontFamily('inter');
      expect(fontFamily).toContain('Inter');
      expect(fontFamily).toContain('sans-serif');
    });

    it('returns undefined for undefined fontId', () => {
      const fontFamily = getFontFamily(undefined);
      expect(fontFamily).toBeUndefined();
    });

    it('normalizes disallowed font to default when config is provided', () => {
      const fontFamily = getFontFamily('lora', mockFontConfig);
      // lora is not allowed, should fallback to inter (default)
      expect(fontFamily).toContain('Inter');
    });
  });

  describe('docNodeToHtml', () => {
    describe('block-level font classes', () => {
      it('paragraph with fontId generates correct class', () => {
        const doc: DocNode = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              attrs: { fontId: 'roboto' },
              content: [{ type: 'text', text: 'Hello World' }],
            },
          ],
        };

        const html = docNodeToHtml(doc, { fonts: mockFontConfig });
        expect(html).toBe('<p class="font-roboto">Hello World</p>');
      });

      it('paragraph with default font does not generate redundant class', () => {
        const doc: DocNode = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              attrs: { fontId: 'inter' },
              content: [{ type: 'text', text: 'Hello World' }],
            },
          ],
        };

        const html = docNodeToHtml(doc, { fonts: mockFontConfig });
        expect(html).toBe('<p>Hello World</p>');
        expect(html).not.toContain('class=');
      });

      it('paragraph without fontId does not generate class', () => {
        const doc: DocNode = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Hello World' }],
            },
          ],
        };

        const html = docNodeToHtml(doc);
        expect(html).toBe('<p>Hello World</p>');
      });

      it('normalizes disallowed fontId to default (no class)', () => {
        const doc: DocNode = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              attrs: { fontId: 'lora' }, // Not allowed
              content: [{ type: 'text', text: 'Hello World' }],
            },
          ],
        };

        const html = docNodeToHtml(doc, { fonts: mockFontConfig });
        // lora → inter (default) → no class
        expect(html).toBe('<p>Hello World</p>');
        expect(html).not.toContain('class=');
      });

      it('heading with fontId generates correct class', () => {
        const doc: DocNode = {
          type: 'doc',
          content: [
            {
              type: 'heading',
              attrs: { level: 1, fontId: 'roboto' },
              content: [{ type: 'text', text: 'Heading' }],
            },
          ],
        };

        const html = docNodeToHtml(doc, { fonts: mockFontConfig });
        expect(html).toBe('<h1 class="font-roboto">Heading</h1>');
      });

      it('heading without fontId does not generate class', () => {
        const doc: DocNode = {
          type: 'doc',
          content: [
            {
              type: 'heading',
              attrs: { level: 2 },
              content: [{ type: 'text', text: 'Heading 2' }],
            },
          ],
        };

        const html = docNodeToHtml(doc);
        expect(html).toBe('<h2>Heading 2</h2>');
      });

      it('list item with fontId generates correct class', () => {
        const doc: DocNode = {
          type: 'doc',
          content: [
            {
              type: 'bullet_list',
              content: [
                {
                  type: 'list_item',
                  attrs: { fontId: 'roboto' },
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Item 1' }],
                    },
                  ],
                },
              ],
            },
          ],
        };

        const html = docNodeToHtml(doc, { fonts: mockFontConfig });
        expect(html).toContain('<li class="font-roboto">');
        expect(html).toContain('Item 1');
        expect(html).toContain('</li>');
      });
    });

    describe('inline font marks', () => {
      it('text with font mark generates span with class', () => {
        const doc: DocNode = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Normal ' },
                {
                  type: 'text',
                  text: 'special',
                  marks: [{ type: 'font', attrs: { fontId: 'roboto' } }],
                },
              ],
            },
          ],
        };

        const html = docNodeToHtml(doc, { fonts: mockFontConfig });
        expect(html).toBe(
          '<p>Normal <span class="font-roboto">special</span></p>',
        );
      });

      it('font mark with default fontId does not generate span', () => {
        const doc: DocNode = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'text',
                  marks: [{ type: 'font', attrs: { fontId: 'inter' } }],
                },
              ],
            },
          ],
        };

        const html = docNodeToHtml(doc, { fonts: mockFontConfig });
        expect(html).toBe('<p>text</p>');
        expect(html).not.toContain('span');
      });

      it('font mark normalizes disallowed fonts', () => {
        const doc: DocNode = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'text',
                  marks: [{ type: 'font', attrs: { fontId: 'lora' } }],
                },
              ],
            },
          ],
        };

        const html = docNodeToHtml(doc, { fonts: mockFontConfig });
        // lora → inter (default) → no span
        expect(html).toBe('<p>text</p>');
        expect(html).not.toContain('span');
      });

      it('nested marks with font work correctly', () => {
        const doc: DocNode = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'bold roboto',
                  marks: [
                    { type: 'bold' },
                    { type: 'font', attrs: { fontId: 'roboto' } },
                  ],
                },
              ],
            },
          ],
        };

        const html = docNodeToHtml(doc, { fonts: mockFontConfig });
        expect(html).toContain('<strong>');
        expect(html).toContain('font-roboto');
        expect(html).toContain('bold roboto');
      });
    });

    describe('basic serialization', () => {
      it('serializes a simple paragraph', () => {
        const doc: DocNode = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Hello World' }],
            },
          ],
        };

        const html = docNodeToHtml(doc);
        expect(html).toBe('<p>Hello World</p>');
      });

      it('applies text marks correctly', () => {
        const doc: DocNode = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Normal ' },
                {
                  type: 'text',
                  text: 'bold',
                  marks: [{ type: 'bold' }],
                },
                { type: 'text', text: ' and ' },
                {
                  type: 'text',
                  text: 'italic',
                  marks: [{ type: 'italic' }],
                },
              ],
            },
          ],
        };

        const html = docNodeToHtml(doc);
        expect(html).toBe(
          '<p>Normal <strong>bold</strong> and <em>italic</em></p>',
        );
      });

      it('escapes HTML special characters', () => {
        const doc: DocNode = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: '<script>alert("XSS")</script>' },
              ],
            },
          ],
        };

        const html = docNodeToHtml(doc);
        expect(html).not.toContain('<script>');
        expect(html).toContain('&lt;script&gt;');
        expect(html).toContain('&lt;/script&gt;');
      });

      it('serializes complex document with mixed content', () => {
        const doc: DocNode = {
          type: 'doc',
          content: [
            {
              type: 'heading',
              attrs: { level: 1, fontId: 'roboto' },
              content: [{ type: 'text', text: 'Title' }],
            },
            {
              type: 'paragraph',
              attrs: { fontId: 'roboto' },
              content: [
                { type: 'text', text: 'This is ' },
                { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
                { type: 'text', text: ' text.' },
              ],
            },
            {
              type: 'bullet_list',
              content: [
                {
                  type: 'list_item',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'List item' }],
                    },
                  ],
                },
              ],
            },
          ],
        };

        const html = docNodeToHtml(doc, { fonts: mockFontConfig });
        expect(html).toContain('<h1');
        expect(html).toContain('font-roboto');
        expect(html).toContain('Title</h1>');
        expect(html).toContain('<p');
        expect(html).toContain('<strong>bold</strong>');
        expect(html).toContain('<ul>');
        expect(html).toContain('<li>');
      });
    });
  });
});
