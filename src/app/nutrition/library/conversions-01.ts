import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

/**
 * Convert an HTML image element to image data.
 *
 * @param image The HTML image element.
 * @returns The image data.
 */
const convertImageToImageData = function (image: HTMLImageElement): ImageData {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Cannot get canvas 2d context.");

  context.drawImage(image, 0, 0);

  const result = context.getImageData(0, 0, canvas.width, canvas.height);
  return result;
}

/**
 * Convert image data to an HTML image.
 *
 * @param imageData The image data.
 * @returns The HTML image element.
 */
const convertImageDataToImage = function (imageData: ImageData): HTMLImageElement {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Cannot get canvas 2d context.");

  context.putImageData(imageData, 0, 0);

  const image = new Image();
  image.src = canvas.toDataURL();

  return image;
}


/**
 * Convert a two-dimensional array to image data.
 *
 * @param data The two-dimensional array containing grayscale image data.
 * @returns Image data built from the two-dimensional array.
 */
const convertTwoDimArrayToImageData = function (data: number[][]): ImageData {
  if (!data) {
    throw new Error("Must provide data.");
  }
  const alpha = 255;

  const raw: number[] = [];
  let width = data.length;
  let height: number = data[0].length;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < data[i].length; j++) {
      const value = data[i][j];
      // R
      raw.push(value);
      // G
      raw.push(value);
      // B
      raw.push(value);
      // A
      raw.push(alpha);
    }
  }
  return new ImageData(new Uint8ClampedArray(raw), width, height);
}

/**
 * Convert input type file upload to file object.
 *
 * @param input The input element.
 * @returns The uploaded file as a File object.
 */
const convertUploadToImageFile = function (input: HTMLInputElement): File {
  if (!input || !input.files || input.files.length !== 1) {
    throw new Error("Must provide input of type file with exactly one file.");
  }

  // get the selected file
  const inputFile = input.files[0];

  // ensure selected file is an image
  if (!inputFile.type.match(/image.*/)) {
    throw new Error("Uploaded file must be an image, not " + inputFile.type);
  }

  return inputFile;
}

/**
 * Convert from a Blob (or File) to an image element.
 *
 * @param blob The blob object.
 * @returns The image element with the image data.
 */
const convertBlobToImage = function (blob: Blob): Promise<HTMLImageElement> {
  const blobUrl = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = err => reject(err);
    img.src = blobUrl;
  }).then((img: any) => {
    URL.revokeObjectURL(blobUrl);
    return img;
  })
}

const convertBlobToImageSrc = function (blob: Blob, image: HTMLImageElement): Promise<void> {
  const blobUrl = URL.createObjectURL(blob);

  return new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = err => reject(err);
    image.src = blobUrl;
  }).then((img: any) => {
    URL.revokeObjectURL(blobUrl);
  })
}

const convertBlobToSafeUrl = function (blob: Blob, sanitizer: DomSanitizer): { srcUrl: SafeUrl, objectUrl: string } {
  const objUrl = URL.createObjectURL(blob);

  // TODO: other checks to run? Note that the uploaded file is checked for the 'image' type.
  if (!objUrl.startsWith('blob:')) {
    throw new Error("Unrecognised object url '" + JSON.stringify(objUrl) + "'.");
  }

  const result = sanitizer.bypassSecurityTrustUrl(objUrl);
  return {srcUrl: result, objectUrl: objUrl};
}

export {
  convertImageToImageData,
  convertImageDataToImage,
  convertTwoDimArrayToImageData,
  convertUploadToImageFile,
  convertBlobToImage,
  convertBlobToImageSrc,
  convertBlobToSafeUrl
}
