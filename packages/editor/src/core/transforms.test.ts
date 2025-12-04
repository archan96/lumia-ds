import { describe, it, expect } from 'vitest';
import {
  editorStateToJson,
  jsonToEditorState,
  normalizeDocumentFonts,
} from './transforms';
import { DocNode } from '../schema/docSchema';
import type { FontConfig } from '../config/fontConfig';

describe('transforms', () => {
  const sampleDoc: DocNode = {
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
            text: 'This is a ',
          },
          {
            type: 'text',
            text: 'bold',
            marks: [{ type: 'bold' }],
          },
          {
            type: 'text',
            text: ' paragraph.',
          },
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
                content: [
                  {
                    type: 'text',
                    text: 'Item 1',
                  },
                ],
              },
            ],
          },
          {
            type: 'list_item',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Item 2',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  it('should convert JSON to EditorState and back to deeply equal JSON', () => {
    const editorState = jsonToEditorState(sampleDoc);
    const jsonOutput = editorStateToJson(editorState);

    expect(jsonOutput).toEqual(sampleDoc);
  });

  it('should handle basic marks correctly', () => {
    const docWithMarks: DocNode = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Bold',
              marks: [{ type: 'bold' }],
            },
            {
              type: 'text',
              text: ' and ',
            },
            {
              type: 'text',
              text: 'Italic',
              marks: [{ type: 'italic' }],
            },
          ],
        },
      ],
    };

    const editorState = jsonToEditorState(docWithMarks);
    const jsonOutput = editorStateToJson(editorState);

    expect(jsonOutput).toEqual(docWithMarks);
  });

  it('should handle link nodes correctly (mapping to link_node internally)', () => {
    const docWithLinkNode: DocNode = {
      type: 'doc',
      content: [
        {
          type: 'link',
          attrs: {
            href: 'https://example.com',
            target: '_blank',
            title: null,
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Link Content',
                },
              ],
            },
          ],
        },
      ],
    } as unknown as DocNode; // Cast to DocNode because definition might be strict about 'link' type but we want to test the transform

    const editorState = jsonToEditorState(docWithLinkNode);
    const jsonOutput = editorStateToJson(editorState);

    expect(jsonOutput).toEqual(docWithLinkNode);
  });
});

describe('normalizeDocumentFonts', () => {
  const mockFontConfig: FontConfig = {
    allFonts: [
      { id: 'inter', label: 'Inter', category: 'sans' as const },
      { id: 'roboto', label: 'Roboto', category: 'sans' as const },
      { id: 'lora', label: 'Lora', category: 'serif' as const },
    ],
    allowedFonts: ['inter', 'roboto'],
    defaultFontId: 'inter',
  };

  it('should normalize disallowed fontId to defaultFontId', () => {
    const doc: DocNode = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          attrs: { fontId: 'lora' }, // lora is in allFonts but not in allowedFonts
          content: [{ type: 'text', text: 'Hello World' }],
        },
      ],
    };

    const normalized = normalizeDocumentFonts(doc, mockFontConfig);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((normalized as any).content[0].attrs.fontId).toBe('inter');
  });

  it('should normalize missing fontId to defaultFontId', () => {
    const doc: DocNode = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          attrs: { fontId: 'nonexistent' },
          content: [{ type: 'text', text: 'Hello World' }],
        },
      ],
    };

    const normalized = normalizeDocumentFonts(doc, mockFontConfig);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((normalized as any).content[0].attrs.fontId).toBe('inter');
  });

  it('should preserve allowed fontId', () => {
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

    const normalized = normalizeDocumentFonts(doc, mockFontConfig);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((normalized as any).content[0].attrs.fontId).toBe('roboto');
  });

  it('should handle nested structures (headings and lists)', () => {
    const doc: DocNode = {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1, fontId: 'lora' }, // Should be normalized
          content: [{ type: 'text', text: 'Heading' }],
        },
        {
          type: 'bullet_list',
          content: [
            {
              type: 'list_item',
              attrs: { fontId: 'nonexistent' }, // Should be normalized
              content: [
                {
                  type: 'paragraph',
                  attrs: { fontId: 'roboto' }, // Should be preserved
                  content: [{ type: 'text', text: 'Item 1' }],
                },
              ],
            },
          ],
        },
      ],
    };

    const normalized = normalizeDocumentFonts(doc, mockFontConfig);

    // Heading should be normalized
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((normalized as any).content[0].attrs.fontId).toBe('inter');

    // List item should be normalized
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listItem = (normalized as any).content[1].content[0];
    expect(listItem.attrs.fontId).toBe('inter');

    // Paragraph in list item should be preserved
    expect(listItem.content[0].attrs.fontId).toBe('roboto');
  });

  it('should not modify nodes without fontId', () => {
    const doc: DocNode = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello World' }],
        },
      ],
    };

    const normalized = normalizeDocumentFonts(doc, mockFontConfig);
    expect(normalized).toEqual(doc);
  });
});
