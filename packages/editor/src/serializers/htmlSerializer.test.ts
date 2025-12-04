import { describe, it, expect } from 'vitest';
import { docNodeToHtml, getFontFamily } from './htmlSerializer';
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

    it('applies font-family styles to paragraph with fontId', () => {
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

      const html = docNodeToHtml(doc, { fontConfig: mockFontConfig });
      expect(html).toContain('font-family:');
      expect(html).toContain('Roboto');
      expect(html).toContain('Hello World');
    });

    it('normalizes disallowed fontId and uses default font stack', () => {
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

      const html = docNodeToHtml(doc, { fontConfig: mockFontConfig });
      // Should use Inter (default) instead of Lora
      expect(html).toContain('Inter');
      expect(html).not.toContain('Lora');
    });

    it('serializes headings with font-family', () => {
      const doc: DocNode = {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1, fontId: 'roboto' },
            content: [{ type: 'text', text: 'Heading 1' }],
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Heading 2' }],
          },
        ],
      };

      const html = docNodeToHtml(doc, { fontConfig: mockFontConfig });
      expect(html).toContain('<h1 style="font-family:');
      expect(html).toContain('Roboto');
      expect(html).toContain('Heading 1</h1>');
      expect(html).toContain('<h2>Heading 2</h2>');
    });

    it('serializes lists with font-family on list items', () => {
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
              {
                type: 'list_item',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Item 2' }],
                  },
                ],
              },
            ],
          },
        ],
      };

      const html = docNodeToHtml(doc, { fontConfig: mockFontConfig });
      expect(html).toContain('<ul>');
      expect(html).toContain('<li style="font-family:');
      expect(html).toContain('Roboto');
      expect(html).toContain('Item 1');
      expect(html).toContain('<li><p>Item 2</p></li>');
      expect(html).toContain('</ul>');
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
            content: [{ type: 'text', text: '<script>alert("XSS")</script>' }],
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
            attrs: { level: 1, fontId: 'inter' },
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

      const html = docNodeToHtml(doc, { fontConfig: mockFontConfig });
      expect(html).toContain('<h1');
      expect(html).toContain('Title</h1>');
      expect(html).toContain('<p');
      expect(html).toContain('<strong>bold</strong>');
      expect(html).toContain('<ul>');
      expect(html).toContain('<li>');
    });
  });
});
