import pdfjsLib from 'pdfjs-dist'

/**
 * [getDocumentFromFile description]
 * @param  {[File]} file [description]
 * @return {[Promise]}      [description]
 */
export function getDocumentFromFile(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = function () {
      //Step 4:turn array buffer into typed array
      const typedarray = new Uint8Array(this.result);
      //Step 5:PDFJS should be able to read this
      pdfjsLib.getDocument(typedarray).then((pdf) => {
        resolve(pdf)
      })
    }
    // Read the file as ArrayBuffer
    fileReader.readAsArrayBuffer(file)
  })
}
