import {
  DocNode,
  ParentNode,
  TextNode,
  Heading,
  Paragraph,
  ListItem,
} from '../schema/docSchema';
import type { FontConfig } from '../config/fontConfig';
import { normalizeFontId } from '../config/fontConfig';

/**
 * Options for HTML serialization.
 */
export interface HtmlSerializerOptions {
  /** Optional font configuration for rendering fonts */
  fontConfig?: FontConfig;
}

/**
 * Map of font IDs to CSS font-family stacks.
 * This provides fallback fonts for common fonts.
 */
const FONT_STACKS: Record<string, string> = {
  inter:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  roboto:
    '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
  'open-sans':
    '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  montserrat:
    '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  lora: '"Lora", Georgia, "Times New Roman", serif',
  merriweather: '"Merriweather", Georgia, "Times New Roman", serif',
  'roboto-mono': '"Roboto Mono", "Courier New", Courier, monospace',
  'source-code-pro': '"Source Code Pro", "Courier New", Courier, monospace',
};

/**
 * Get the CSS font-family stack for a given font ID.
 * @param fontId The font ID
 * @param config Optional font configuration for validation
 * @returns CSS font-family value
 */
export function getFontFamily(
  fontId: string | undefined,
  config?: FontConfig,
): string | undefined {
  if (!fontId) return undefined;

  // Normalize font ID if config is provided
  const normalizedFontId = config ? normalizeFontId(fontId, config) : fontId;

  return (
    FONT_STACKS[normalizedFontId] ||
    FONT_STACKS[config?.defaultFontId || 'inter']
  );
}

/**
 * Serialize a DocNode to an HTML string.
 * @param doc The DocNode to serialize
 * @param options Serialization options
 * @returns HTML string
 */
export function docNodeToHtml(
  doc: DocNode,
  options?: HtmlSerializerOptions,
): string {
  return serializeNode(doc, options);
}

/**
 * Recursively serialize a DocNode to HTML.
 * @param node The node to serialize
 * @param options Serialization options
 * @returns HTML string
 */
function serializeNode(node: DocNode, options?: HtmlSerializerOptions): string {
  switch (node.type) {
    case 'doc':
      return serializeChildren(node as ParentNode, options);

    case 'paragraph':
      return serializeParagraph(node as Paragraph, options);

    case 'heading':
      return serializeHeading(node as Heading, options);

    case 'bullet_list':
      return `<ul>${serializeChildren(node as ParentNode, options)}</ul>`;

    case 'ordered_list':
      return `<ol>${serializeChildren(node as ParentNode, options)}</ol>`;

    case 'list_item':
      return serializeListItem(node as ListItem, options);

    case 'code_block': {
      const codeContent = serializeChildren(node as ParentNode, options, true);
      return `<pre><code>${codeContent}</code></pre>`;
    }

    case 'text':
      return escapeHtml((node as TextNode).text);

    case 'image': {
      const imageNode = node as {
        attrs: { src: string; alt?: string; title?: string };
      };
      const { src, alt, title } = imageNode.attrs;
      const altAttr = alt ? ` alt="${escapeHtml(alt)}"` : '';
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
      return `<img src="${escapeHtml(src)}"${altAttr}${titleAttr} />`;
    }

    case 'link': {
      const linkNode = node as {
        attrs: { href: string; target?: string; title?: string };
      };
      const { href, target, title: linkTitle } = linkNode.attrs;
      const targetAttr = target ? ` target="${escapeHtml(target)}"` : '';
      const linkTitleAttr = linkTitle
        ? ` title="${escapeHtml(linkTitle)}"`
        : '';
      return `<a href="${escapeHtml(href)}"${targetAttr}${linkTitleAttr}>${serializeChildren(node as ParentNode, options)}</a>`;
    }

    default:
      return '';
  }
}

/**
 * Serialize a paragraph node.
 */
function serializeParagraph(
  node: Paragraph,
  options?: HtmlSerializerOptions,
): string {
  const fontFamily = getFontFamily(node.attrs?.fontId, options?.fontConfig);
  const styleAttr = fontFamily ? ` style="font-family: ${fontFamily}"` : '';
  return `<p${styleAttr}>${serializeChildren(node, options)}</p>`;
}

/**
 * Serialize a heading node.
 */
function serializeHeading(
  node: Heading,
  options?: HtmlSerializerOptions,
): string {
  const level = node.attrs.level || 1;
  const fontFamily = getFontFamily(node.attrs.fontId, options?.fontConfig);
  const styleAttr = fontFamily ? ` style="font-family: ${fontFamily}"` : '';
  return `<h${level}${styleAttr}>${serializeChildren(node, options)}</h${level}>`;
}

/**
 * Serialize a list item node.
 */
function serializeListItem(
  node: ListItem,
  options?: HtmlSerializerOptions,
): string {
  const fontFamily = getFontFamily(node.attrs?.fontId, options?.fontConfig);
  const styleAttr = fontFamily ? ` style="font-family: ${fontFamily}"` : '';
  return `<li${styleAttr}>${serializeChildren(node, options)}</li>`;
}

/**
 * Serialize child nodes.
 */
function serializeChildren(
  node: ParentNode,
  options?: HtmlSerializerOptions,
  skipMarks = false,
): string {
  if (!node.content || node.content.length === 0) {
    return '';
  }

  return node.content
    .map((child) => {
      if (child.type === 'text') {
        const text = escapeHtml((child as TextNode).text);
        if (skipMarks || !child.marks || child.marks.length === 0) {
          return text;
        }
        return applyMarks(text, child.marks);
      }
      return serializeNode(child, options);
    })
    .join('');
}

/**
 * Apply text marks (bold, italic, etc.) to text content.
 */
function applyMarks(
  text: string,
  marks: Array<{ type: string; attrs?: Record<string, unknown> }>,
): string {
  let result = text;
  marks.forEach((mark) => {
    switch (mark.type) {
      case 'bold':
        result = `<strong>${result}</strong>`;
        break;
      case 'italic':
        result = `<em>${result}</em>`;
        break;
      case 'underline':
        result = `<u>${result}</u>`;
        break;
      case 'code':
        result = `<code>${result}</code>`;
        break;
      case 'link': {
        const href = (mark.attrs?.href as string) || '#';
        const target = mark.attrs?.target
          ? ` target="${escapeHtml(mark.attrs.target as string)}"`
          : '';
        const title = mark.attrs?.title
          ? ` title="${escapeHtml(mark.attrs.title as string)}"`
          : '';
        result = `<a href="${escapeHtml(href)}"${target}${title}>${result}</a>`;
        break;
      }
    }
  });
  return result;
}

/**
 * Escape HTML special characters.
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
