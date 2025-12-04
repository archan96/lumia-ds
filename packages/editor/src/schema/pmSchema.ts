import { Schema } from 'prosemirror-model';

/**
 * ProseMirror schema definition that aligns with the DocNode structure.
 */
export const pmSchema = new Schema({
  nodes: {
    doc: {
      content: 'block+',
    },
    paragraph: {
      attrs: { fontId: { default: null } },
      content: 'inline*',
      group: 'block',
      parseDOM: [
        {
          tag: 'p',
          getAttrs(dom) {
            return {
              fontId: (dom as HTMLElement).getAttribute('data-font-id'),
            };
          },
        },
      ],
      toDOM(node) {
        const attrs = node.attrs.fontId
          ? { 'data-font-id': node.attrs.fontId }
          : {};
        return ['p', attrs, 0];
      },
    },
    heading: {
      attrs: { level: { default: 1 }, fontId: { default: null } },
      content: 'inline*',
      group: 'block',
      defining: true,
      parseDOM: [
        {
          tag: 'h1',
          getAttrs(dom) {
            return {
              level: 1,
              fontId: (dom as HTMLElement).getAttribute('data-font-id'),
            };
          },
        },
        {
          tag: 'h2',
          getAttrs(dom) {
            return {
              level: 2,
              fontId: (dom as HTMLElement).getAttribute('data-font-id'),
            };
          },
        },
        {
          tag: 'h3',
          getAttrs(dom) {
            return {
              level: 3,
              fontId: (dom as HTMLElement).getAttribute('data-font-id'),
            };
          },
        },
        {
          tag: 'h4',
          getAttrs(dom) {
            return {
              level: 4,
              fontId: (dom as HTMLElement).getAttribute('data-font-id'),
            };
          },
        },
        {
          tag: 'h5',
          getAttrs(dom) {
            return {
              level: 5,
              fontId: (dom as HTMLElement).getAttribute('data-font-id'),
            };
          },
        },
        {
          tag: 'h6',
          getAttrs(dom) {
            return {
              level: 6,
              fontId: (dom as HTMLElement).getAttribute('data-font-id'),
            };
          },
        },
      ],
      toDOM(node) {
        const attrs = node.attrs.fontId
          ? { 'data-font-id': node.attrs.fontId }
          : {};
        return ['h' + node.attrs.level, attrs, 0];
      },
    },
    bullet_list: {
      content: 'list_item+',
      group: 'block',
      parseDOM: [{ tag: 'ul' }],
      toDOM() {
        return ['ul', 0];
      },
    },
    ordered_list: {
      content: 'list_item+',
      group: 'block',
      attrs: { order: { default: 1 } },
      parseDOM: [
        {
          tag: 'ol',
          getAttrs(dom) {
            return {
              order: (dom as HTMLElement).hasAttribute('start')
                ? +(dom as HTMLElement).getAttribute('start')!
                : 1,
            };
          },
        },
      ],
      toDOM(node) {
        return node.attrs.order === 1
          ? ['ol', 0]
          : ['ol', { start: node.attrs.order }, 0];
      },
    },
    list_item: {
      attrs: { fontId: { default: null } },
      content: 'paragraph block*',
      parseDOM: [
        {
          tag: 'li',
          getAttrs(dom) {
            return {
              fontId: (dom as HTMLElement).getAttribute('data-font-id'),
            };
          },
        },
      ],
      toDOM(node) {
        const attrs = node.attrs.fontId
          ? { 'data-font-id': node.attrs.fontId }
          : {};
        return ['li', attrs, 0];
      },
      defining: true,
    },
    image: {
      inline: true,
      attrs: {
        src: {},
        alt: { default: null },
        title: { default: null },
      },
      group: 'inline',
      draggable: true,
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs(dom) {
            return {
              src: (dom as HTMLElement).getAttribute('src'),
              title: (dom as HTMLElement).getAttribute('title'),
              alt: (dom as HTMLElement).getAttribute('alt'),
            };
          },
        },
      ],
      toDOM(node) {
        const { src, alt, title } = node.attrs;
        return ['img', { src, alt, title }];
      },
    },
    link_node: {
      attrs: {
        href: {},
        title: { default: null },
        target: { default: '_blank' },
      },
      content: 'block+',
      group: 'block',
      parseDOM: [
        {
          tag: 'div[data-type="link"]',
          getAttrs(dom) {
            return {
              href: (dom as HTMLElement).getAttribute('data-href'),
              title: (dom as HTMLElement).getAttribute('title'),
              target: (dom as HTMLElement).getAttribute('target'),
            };
          },
        },
      ],
      toDOM(node) {
        const { href, title, target } = node.attrs;
        return [
          'div',
          { 'data-type': 'link', 'data-href': href, title, target },
          0,
        ];
      },
    },
    code_block: {
      content: 'text*',
      marks: '',
      group: 'block',
      code: true,
      defining: true,
      attrs: { language: { default: '' } },
      parseDOM: [
        {
          tag: 'pre',
          preserveWhitespace: 'full',
          getAttrs(dom) {
            return {
              language: (dom as HTMLElement).getAttribute('data-language'),
            };
          },
        },
      ],
      toDOM(node) {
        return ['pre', { 'data-language': node.attrs.language }, ['code', 0]];
      },
    },
    text: {
      group: 'inline',
    },
  },
  marks: {
    bold: {
      parseDOM: [
        { tag: 'strong' },
        {
          tag: 'b',
          getAttrs: (node) =>
            (node as HTMLElement).style.fontWeight !== 'normal' && null,
        },
        {
          style: 'font-weight',
          getAttrs: (value) =>
            /^(bold(er)?|[5-9]\d{2,})$/.test(value as string) && null,
        },
      ],
      toDOM() {
        return ['strong', 0];
      },
    },
    italic: {
      parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
      toDOM() {
        return ['em', 0];
      },
    },
    underline: {
      parseDOM: [{ tag: 'u' }, { style: 'text-decoration=underline' }],
      toDOM() {
        return ['u', 0];
      },
    },
    code: {
      parseDOM: [{ tag: 'code' }],
      toDOM() {
        return ['code', 0];
      },
    },
    link: {
      attrs: {
        href: {},
        title: { default: null },
        target: { default: '_blank' },
      },
      inclusive: false,
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs(dom) {
            return {
              href: (dom as HTMLElement).getAttribute('href'),
              title: (dom as HTMLElement).getAttribute('title'),
              target: (dom as HTMLElement).getAttribute('target'),
            };
          },
        },
      ],
      toDOM(node) {
        const { href, title, target } = node.attrs;
        return ['a', { href, title, target }, 0];
      },
    },
  },
});
