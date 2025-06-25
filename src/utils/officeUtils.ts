export function exportOfficeDocumentAsBase64(): Promise<string> {
  return new Promise((resolve, reject) => {
    Office.context.document.getFileAsync(
      Office.FileType.Compressed,
      { sliceSize: 65536 },
      (result) => {
        if (result.status !== Office.AsyncResultStatus.Succeeded) {
          return reject(result.error.message);
        }

        const file = result.value;
        const sliceCount = file.sliceCount;
        const docDataSlices: Uint8Array[] = [];
        let slicesReceived = 0;
        let gotAllSlices = true;

        const getSliceAsync = (nextSlice: number) => {
          file.getSliceAsync(nextSlice, (sliceResult) => {
            if (sliceResult.status === Office.AsyncResultStatus.Succeeded) {
              if (!gotAllSlices) return;

              docDataSlices[sliceResult.value.index] = sliceResult.value.data;
              slicesReceived++;

              if (slicesReceived === sliceCount) {
                file.closeAsync();
                const totalLength = docDataSlices.reduce((sum, s) => sum + s.length, 0);
                const fullFile = new Uint8Array(totalLength);
                let offset = 0;
                for (const slice of docDataSlices) {
                  fullFile.set(slice, offset);
                  offset += slice.length;
                }

                const base64Data = arrayBufferToBase64(fullFile.buffer);
                resolve(base64Data);
              } else {
                getSliceAsync(nextSlice + 1);
              }
            } else {
              gotAllSlices = false;
              file.closeAsync();
              reject(sliceResult.error.message);
            }
          });
        };

        getSliceAsync(0);
      }
    );
  });
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function highlightBeginGroupRows() {
  await Excel.run(async (context) => {
    const sheet = context.workbook.worksheets.getActiveWorksheet();

    // Get used range (all cells with data)
    const usedRange = sheet.getUsedRange();
    usedRange.load("values, rowCount, columnCount, address");
    await context.sync();

    const values = usedRange.values;
    const rowCount = usedRange.rowCount;
    const colCount = usedRange.columnCount;

    // Find the index of "type" column in header row (assumed to be first row, index 0)
    let typeColIndex = -1;
    for (let c = 0; c < colCount; c++) {
      if (typeof values[0][c] === "string" && values[0][c].toLowerCase() === "type") {
        typeColIndex = c;
        break;
      }
    }

    if (typeColIndex === -1) {
      console.log("Column 'type' not found");
      return;
    }

    // Loop through rows, check if the cell in "type" column starts with "begin_group"
    for (let r = 1; r < rowCount; r++) {
      const cellValue = values[r][typeColIndex];
      if (typeof cellValue === "string" && cellValue.toLowerCase().startsWith("begin_group")) {
        // Highlight the entire row r (1-based in Excel, but 0-based in JS)
        const rowRange = sheet.getRangeByIndexes(r, 0, 1, colCount);
        rowRange.format.fill.color = "#FFFF00"; // yellow highlight
      }
    }

    await context.sync();
  });
}
