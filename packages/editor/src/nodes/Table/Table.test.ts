import { describe, test, expect } from 'vitest';
import { createHeadlessEditor } from '@lexical/headless';
import {
  TableNode,
  TableRowNode,
  TableCellNode,
  $createTableNode,
  $createTableRowNode,
  $createTableCellNode,
  SerializedTableNode,
  SerializedTableRowNode,
  SerializedTableCellNode,
  INSERT_TABLE_COMMAND,
  $isTableNode,
  registerTablePlugin,
} from '@lexical/table';
import {
  ParagraphNode,
  $createParagraphNode,
  $createTextNode,
  $getRoot,
} from 'lexical';

describe('Table Nodes', () => {
  const editor = createHeadlessEditor({
    nodes: [TableNode, TableRowNode, TableCellNode, ParagraphNode],
  });

  test('should create a table with rows and cells', () => {
    editor.update(() => {
      const tableNode = $createTableNode();
      const rowNode = $createTableRowNode();
      const cellNode = $createTableCellNode(0); // 0 = normal cell

      // Add text content to the cell
      const paragraph = $createParagraphNode();
      paragraph.append($createTextNode('Test Cell'));
      cellNode.append(paragraph);

      rowNode.append(cellNode);
      tableNode.append(rowNode);

      expect(tableNode).toBeInstanceOf(TableNode);
      expect(rowNode).toBeInstanceOf(TableRowNode);
      expect(cellNode).toBeInstanceOf(TableCellNode);
    });
  });

  test('should export table to JSON with correct hierarchy', () => {
    editor.update(() => {
      const tableNode = $createTableNode();
      const rowNode = $createTableRowNode();
      const cellNode1 = $createTableCellNode(0);
      const cellNode2 = $createTableCellNode(0);

      // Add content to cells
      const para1 = $createParagraphNode();
      para1.append($createTextNode('Cell 1'));
      cellNode1.append(para1);

      const para2 = $createParagraphNode();
      para2.append($createTextNode('Cell 2'));
      cellNode2.append(para2);

      rowNode.append(cellNode1);
      rowNode.append(cellNode2);
      tableNode.append(rowNode);

      const tableJSON = tableNode.exportJSON() as SerializedTableNode;
      expect(tableJSON.type).toBe('table');
      expect(tableJSON.children).toHaveLength(1); // 1 row

      const rowJSON = tableJSON.children[0] as SerializedTableRowNode;
      expect(rowJSON.type).toBe('tablerow');
      expect(rowJSON.children).toHaveLength(2); // 2 cells

      const cell1JSON = rowJSON.children[0] as SerializedTableCellNode;
      const cell2JSON = rowJSON.children[1] as SerializedTableCellNode;
      expect(cell1JSON.type).toBe('tablecell');
      expect(cell2JSON.type).toBe('tablecell');
    });
  });

  test('should import table from JSON correctly', () => {
    const tableJSON: SerializedTableNode = {
      type: 'table',
      version: 1,
      direction: 'ltr',
      format: '',
      indent: 0,
      colWidths: [],
      rowStriping: false,
      frozenColumnCount: 0,
      frozenRowCount: 0,
      children: [
        {
          type: 'tablerow',
          version: 1,
          direction: 'ltr',
          format: '',
          indent: 0,
          children: [
            {
              type: 'tablecell',
              version: 1,
              direction: 'ltr',
              format: '',
              indent: 0,
              colSpan: 1,
              rowSpan: 1,
              headerState: 0,
              width: undefined,
              backgroundColor: null,
              children: [],
            },
          ],
        },
      ],
    };

    editor.update(() => {
      const importedTable = TableNode.importJSON(tableJSON);
      expect(importedTable).toBeInstanceOf(TableNode);
    });
  });

  test('should handle header cells correctly', () => {
    editor.update(() => {
      // headerState = 1 indicates a header cell
      const headerCell = $createTableCellNode(1);
      const normalCell = $createTableCellNode(0);

      expect(headerCell.getHeaderStyles()).toBe(1);
      expect(normalCell.getHeaderStyles()).toBe(0);
    });
  });

  test('should serialize complete table structure to JSON', () => {
    editor.update(() => {
      const tableNode = $createTableNode();

      // Create header row
      const headerRow = $createTableRowNode();
      const header1 = $createTableCellNode(1);
      const header2 = $createTableCellNode(1);
      header1.append(
        $createParagraphNode().append($createTextNode('Header 1')),
      );
      header2.append(
        $createParagraphNode().append($createTextNode('Header 2')),
      );
      headerRow.append(header1, header2);

      // Create data row
      const dataRow = $createTableRowNode();
      const cell1 = $createTableCellNode(0);
      const cell2 = $createTableCellNode(0);
      cell1.append($createParagraphNode().append($createTextNode('Data 1')));
      cell2.append($createParagraphNode().append($createTextNode('Data 2')));
      dataRow.append(cell1, cell2);

      tableNode.append(headerRow, dataRow);

      const json = tableNode.exportJSON() as SerializedTableNode;

      // Verify structure
      expect(json.type).toBe('table');
      expect(json.children).toHaveLength(2); // 2 rows

      // Verify header row
      const headerRowJSON = json.children[0] as SerializedTableRowNode;
      expect(headerRowJSON.type).toBe('tablerow');
      expect(headerRowJSON.children).toHaveLength(2);
      expect(
        (headerRowJSON.children[0] as SerializedTableCellNode).headerState,
      ).toBe(1);
      expect(
        (headerRowJSON.children[1] as SerializedTableCellNode).headerState,
      ).toBe(1);

      // Verify data row
      const dataRowJSON = json.children[1] as SerializedTableRowNode;
      expect(dataRowJSON.type).toBe('tablerow');
      expect(dataRowJSON.children).toHaveLength(2);
      expect(
        (dataRowJSON.children[0] as SerializedTableCellNode).headerState,
      ).toBe(0);
      expect(
        (dataRowJSON.children[1] as SerializedTableCellNode).headerState,
      ).toBe(0);
    });
  });

  test('INSERT_TABLE_COMMAND should create a 3x3 table', async () => {
    // Create a new editor for this test with proper initial state
    const testEditor = createHeadlessEditor({
      nodes: [TableNode, TableRowNode, TableCellNode, ParagraphNode],
    });

    // Register the table plugin
    registerTablePlugin(testEditor);

    // Set up initial editor state with a paragraph
    await testEditor.update(() => {
      const root = $getRoot();
      root.clear();
      const paragraph = $createParagraphNode();
      root.append(paragraph);
      paragraph.select();
    });

    // Dispatch the INSERT_TABLE_COMMAND
    await testEditor.update(() => {
      testEditor.dispatchCommand(INSERT_TABLE_COMMAND, {
        rows: '3',
        columns: '3',
        includeHeaders: false,
      });
    });

    // Verify the table was created
    testEditor.getEditorState().read(() => {
      const root = $getRoot();
      const children = root.getChildren();

      // Find the table node
      const tableNodes = children.filter((child) => $isTableNode(child));
      expect(tableNodes).toHaveLength(1);

      const tableNode = tableNodes[0] as TableNode;
      const rows = tableNode.getChildren();

      // Should have 3 rows
      expect(rows).toHaveLength(3);

      // Each row should have 3 cells
      for (const row of rows) {
        const cells = (row as TableRowNode).getChildren();
        expect(cells).toHaveLength(3);
      }
    });
  });
});
