export function exportOfficeDocumentAsBase64(): Promise<string> {
  return new Promise((resolve, reject) => {
    Office.context.document.getFileAsync(
      Office.FileType.Compressed,
      { sliceSize: 65536 },
      (result) => {
        if (result.status !== "succeeded") {
          return reject(result.error.message);
        }

        const file = result.value;
        const sliceCount = file.sliceCount;
        const docDataSlices: Uint8Array[] = [];
        let slicesReceived = 0;
        let gotAllSlices = true;

        const getSliceAsync = (nextSlice: number) => {
          file.getSliceAsync(nextSlice, (sliceResult) => {
            if (sliceResult.status === "succeeded") {
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
