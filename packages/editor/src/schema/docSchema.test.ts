import { describe, it, expect } from 'vitest';
import type { DocNode, Doc, TextNode, Heading } from './docSchema';

describe('DocNode Schema', () => {
  it('should allow creating a valid document structure', () => {
    const doc: Doc = {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [
            {
              type: 'text',
              text: 'Hello World',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is a paragraph.',
              marks: [
                {
                  type: 'bold',
                },
              ],
            },
          ],
        },
      ],
    };

    expect(doc.type).toBe('doc');
    expect(doc.content).toHaveLength(2);
    expect(doc.content![0].type).toBe('heading');
    expect((doc.content![0] as Heading).attrs.level).toBe(1);
  });

  it('should allow creating a link node', () => {
    const linkNode: DocNode = {
      type: 'link',
      attrs: {
        href: 'https://example.com',
        title: 'Example',
      },
      content: [
        {
          type: 'text',
          text: 'Click me',
        },
      ],
    };
    expect(linkNode.type).toBe('link');
  });

  it('should validate node types at runtime (simple validator)', () => {
    const isValidNode = (node: unknown): node is DocNode => {
      if (typeof node !== 'object' || node === null || !('type' in node)) {
        return false;
      }
      const type = (node as { type: unknown }).type;
      if (typeof type !== 'string') {
        return false;
      }
      const validTypes = [
        'doc',
        'paragraph',
        'heading',
        'bullet_list',
        'ordered_list',
        'list_item',
        'image',
        'link',
        'code_block',
        'text',
      ];
      return validTypes.includes(type);
    };

    const validNode: TextNode = { type: 'text', text: 'hello' };
    const invalidNode = { type: 'unknown', text: 'hello' };

    expect(isValidNode(validNode)).toBe(true);
    expect(isValidNode(invalidNode)).toBe(false);
  });
});
