/*
 * Original is copyright https://gist.github.com/Jonarod
 *
 * Used under fair use / small content / modifications made.
 *
 * Source: https://gist.github.com/Jonarod/77d8e3a15c5c1bb55fa9d057d12f95bd
 *
 * Includes modifications by https://github.com/cofiem
 */

/**
 * Draw an image to a canvas.
 *
 * @param img The image element.
 * @returns The results from drawing the image to a canvas.
 */
const drawImageToCanvas = function (img: HTMLImageElement):
  { canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, width: number, height: number } {

  // REMINDER
  // 256x256 = 65536 pixels with 4 channels (RGBA) = 262144 data points for each image
  // Data is encoded as Uint8ClampedArray with BYTES_PER_ELEMENT = 1
  // So each images = 262144bytes
  // 1000 images = 260Mb
  let canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  let ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Cannot get canvas 2d context.");
  ctx.drawImage(img, 0, 0);

  return {canvas: canvas, context: ctx, width: img.width, height: img.height};
}


/**
 * Convert a Blob (or File) to a Base64 string.
 *
 * @param blob The image binary blob.
 * @returns A promise that resolves to the base64 string.
 */
const convertBlobToBase64 = function (blob: Blob) {
  let blobUrl = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = err => reject(err);
    img.src = blobUrl;
  }).then((img: any) => {
    URL.revokeObjectURL(blobUrl);
    let result = drawImageToCanvas(img);
    return result.canvas.toDataURL();
  })
}

/**
 * Convert a Blob (or File) to an ImageData object.
 *
 * @param blob The image binary blob.
 * @returns A promise that resolves to the ImageData object.
 */
const convertBlobToImageData = function (blob: Blob) {
  const blobUrl = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = err => reject(err);
    img.src = blobUrl;
  }).then((img: any) => {
    URL.revokeObjectURL(blobUrl);
    const result = drawImageToCanvas(img);

    // some browsers synchronously decode image here
    return result.context.getImageData(0, 0, result.width, result.height);
  })
}

/**
 * Convert an ImageData object to a Blob.
 *
 * @param imageData The image data object.
 * @returns A promise that resolves to the binary Blob.
 */
const convertImageDataToBlob = function (imageData: ImageData): Promise<Blob | null> {
  let w = imageData.width;
  let h = imageData.height;
  let canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  let ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Cannot get canvas 2d context.");
  // synchronous
  ctx.putImageData(imageData, 0, 0);

  return new Promise((resolve) => {
    // implied image/png format
    canvas.toBlob(resolve);
  })
}

/**
 * Convert a url to a Blob.
 *
 * @param url The image url.
 * @returns A promise that resolves to the binary Blob.
 */
const convertObjectURLToBlob = function (url: string) {
  return new Promise(async (resolve, reject) => {
    try {
      let blob = await fetch(url)
      resolve(blob)
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Convert a Blob (or File) to an Object Url.
 *
 * @param blob The image binary blob.
 * @returns A promise that resolves to the Object Url.
 */
const convertBlobToObjectURL = function (blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      resolve(URL.createObjectURL(blob))
    } catch (err) {
      reject(err)
    }
  })
}

export {
  drawImageToCanvas,
  convertBlobToBase64,
  convertBlobToImageData,
  convertImageDataToBlob,
  convertObjectURLToBlob,
  convertBlobToObjectURL,
}
