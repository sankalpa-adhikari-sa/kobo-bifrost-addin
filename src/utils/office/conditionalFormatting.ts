export async function addMultipleConditionalFormatting(
  formatRules = [
    { prefix: "end_group", color: "#b5e6a2" },
    { prefix: "begin_group", color: "#f7c7ac" },
    { prefix: "begin_repeat", color: "#94dcf8" },
    { prefix: "end_repeat", color: "#e49edd" },
  ],
  additionalRows = 50,
  typeColumnName = "type"
) {
  await Excel.run(async (context) => {
    const sheet = context.workbook.worksheets.getActiveWorksheet();

    const usedRange = sheet.getUsedRange();
    usedRange.load("values, rowCount, columnCount, address");
    await context.sync();

    const values = usedRange.values;
    const rowCount = usedRange.rowCount;
    const colCount = usedRange.columnCount;

    let typeColIndex = -1;
    for (let c = 0; c < colCount; c++) {
      if (
        typeof values[0][c] === "string" &&
        values[0][c].toLowerCase() === typeColumnName.toLowerCase()
      ) {
        typeColIndex = c;
        break;
      }
    }

    if (typeColIndex === -1) {
      console.log(`Column '${typeColumnName}' not found`);
      return;
    }

    const typeColumnLetter = getColumnLetter(typeColIndex);
    const totalRowsToFormat = rowCount - 1 + additionalRows;
    const dataRange = sheet.getRangeByIndexes(1, 0, totalRowsToFormat, colCount);

    dataRange.conditionalFormats.clearAll();

    formatRules.forEach((rule) => {
      const conditionalFormat = dataRange.conditionalFormats.add(
        Excel.ConditionalFormatType.custom
      );
      conditionalFormat.custom.rule.formula = `=LOWER(LEFT($${typeColumnLetter}2,${rule.prefix.length}))="${rule.prefix.toLowerCase()}"`;
      conditionalFormat.custom.format.fill.color = rule.color;
    });

    await context.sync();

    console.log(
      `Multiple conditional formatting rules added successfully for ${totalRowsToFormat} rows (${additionalRows} additional rows beyond current data)`
    );
    console.log(`Rules applied for: ${formatRules.map((rule) => rule.prefix).join(", ")}`);
  });
}

function getColumnLetter(columnIndex: number) {
  let columnLetter = "";
  while (columnIndex >= 0) {
    columnLetter = String.fromCharCode(65 + (columnIndex % 26)) + columnLetter;
    columnIndex = Math.floor(columnIndex / 26) - 1;
  }
  return columnLetter;
}
