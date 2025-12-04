import { EditorState } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import { DocNode } from '../schema/docSchema';
import { pmSchema } from '../schema/pmSchema';
import type { FontConfig } from '../config/fontConfig';
import { normalizeFontId } from '../config/fontConfig';

/**
 * Recursively maps node types in the JSON tree and cleans up fontId attrs.
 * @param node The node to traverse.
 * @param mapFn Function to map the node type.
 * @returns The transformed node.
 */
function traverseAndMap(
  node: unknown,
  mapFn: (type: string) => string,
): unknown {
  if (typeof node !== 'object' || node === null) {
    return node;
  }

  const newNode = { ...(node as Record<string, unknown>) };

  if (typeof newNode.type === 'string') {
    newNode.type = mapFn(newNode.type);
  }

  // Clean up null fontId attrs for backward compatibility
  if (
    typeof newNode.attrs === 'object' &&
    newNode.attrs !== null &&
    'fontId' in newNode.attrs &&
    (newNode.attrs as Record<string, unknown>).fontId === null
  ) {
    const attrs = { ...(newNode.attrs as Record<string, unknown>) };
    delete attrs.fontId;
    // Only keep attrs if it has other properties
    newNode.attrs = Object.keys(attrs).length > 0 ? attrs : undefined;
  }

  if (Array.isArray(newNode.content)) {
    newNode.content = newNode.content.map((child: unknown) =>
      traverseAndMap(child, mapFn),
    );
  }

  return newNode;
}

/**
 * Converts a ProseMirror EditorState to a DocNode JSON tree.
 * @param editorState The EditorState to convert.
 * @returns The DocNode JSON tree.
 */
export function editorStateToJson(editorState: EditorState): DocNode {
  const json = editorState.doc.toJSON();
  return traverseAndMap(json, (type) =>
    type === 'link_node' ? 'link' : type,
  ) as DocNode;
}

/**
 * Recursively normalize font IDs in a document tree.
 * Invalid or disallowed fonts are mapped to defaultFontId.
 *
 * @param node The DocNode to normalize
 * @param config The FontConfig to validate against
 * @returns A new DocNode with normalized font IDs
 */
export function normalizeDocumentFonts(
  node: DocNode,
  config: FontConfig,
): DocNode {
  if (typeof node !== 'object' || node === null) {
    return node;
  }

  const newNode = { ...node } as DocNode;

  // Normalize fontId in attrs if present
  if (
    'attrs' in newNode &&
    newNode.attrs &&
    typeof newNode.attrs === 'object'
  ) {
    const attrs = { ...newNode.attrs };

    if ('fontId' in attrs && typeof attrs.fontId === 'string') {
      attrs.fontId = normalizeFontId(attrs.fontId, config);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (newNode as any).attrs = attrs;
  }

  // Recursively normalize content
  if ('content' in newNode && Array.isArray(newNode.content)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (newNode as any).content = newNode.content!.map((child) =>
      normalizeDocumentFonts(child, config),
    );
  }

  return newNode;
}

/**
 * Converts a DocNode JSON tree to a ProseMirror EditorState.
 * If fontConfig is provided, fonts will be normalized before conversion.
 *
 * @param json The DocNode JSON tree to convert.
 * @param fontConfig Optional font configuration for normalization
 * @returns The EditorState.
 */
export function jsonToEditorState(
  json: DocNode,
  fontConfig?: FontConfig,
): EditorState {
  // Normalize fonts if config is provided
  const normalizedJson = fontConfig
    ? normalizeDocumentFonts(json, fontConfig)
    : json;

  const mappedJson = traverseAndMap(normalizedJson, (type) =>
    type === 'link' ? 'link_node' : type,
  );
  const node = Node.fromJSON(pmSchema, mappedJson);
  return EditorState.create({
    doc: node,
    schema: pmSchema,
  });
}
