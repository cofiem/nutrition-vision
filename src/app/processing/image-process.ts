// noinspection UnnecessaryLocalVariableJS

// @ts-nocheck

import * as cv from "../../assets/js/opencv"
import {createWorker} from "tesseract.js";
import {fromEvent} from "rxjs";


/**
 * Draw and scale an image.
 *
 * From: https://gist.github.com/Jonarod/77d8e3a15c5c1bb55fa9d057d12f95bd
 *
 * @param img The iamge element.
 * @param limit The scale limit.
 * @returns The results from drawing the image to a canvas.
 */
const drawAndScaleImage = function (img: HTMLImageElement, limit: number = 256):
  { canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, width: number, height: number } {

  // Limit to 256x256px while preserving aspect ratio
  let [width, height] = [img.width, img.height]
  // let aspectRatio = w / h
  // Say the file is 1920x1080
  // divide max(w,h) by 256 to get factor
  let factor = Math.max(width, height) / limit
  width = width / factor
  height = height / factor

  // REMINDER
  // 256x256 = 65536 pixels with 4 channels (RGBA) = 262144 data points for each image
  // Data is encoded as Uint8ClampedArray with BYTES_PER_ELEMENT = 1
  // So each images = 262144bytes
  // 1000 images = 260Mb
  let canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  let ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Cannot get canvas 2d context.");
  ctx.drawImage(img, 0, 0);

  return {canvas: canvas, context: ctx, width: width, height: height};
}

/**
 * Convert a Blob to a Base64 string.
 *
 * From: https://gist.github.com/Jonarod/77d8e3a15c5c1bb55fa9d057d12f95bd
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
    let result = drawAndScaleImage(img);
    return result.canvas.toDataURL();
  })
}

/**
 * Convert a Blob to an ImageData object.
 *
 * From: https://gist.github.com/Jonarod/77d8e3a15c5c1bb55fa9d057d12f95bd
 *
 * @param blob The image binary blob.
 * @returns A promise that resolves to the ImageData object.
 */
const convertBlobToImageData = function (blob: Blob) {
  let blobUrl = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = err => reject(err);
    img.src = blobUrl;
  }).then((img: any) => {
    URL.revokeObjectURL(blobUrl);

    let result = drawAndScaleImage(img);

    // some browsers synchronously decode image here
    return result.context.getImageData(0, 0, result.width, result.height);
  })
}

/**
 * Convert an ImageData object to a Blob.
 *
 * From: https://gist.github.com/Jonarod/77d8e3a15c5c1bb55fa9d057d12f95bd
 *
 * @param imageData The image data object.
 * @returns A promise that resolves to the binary Blob.
 */
const convertImageDataToBlob = function (imageData: ImageData) {
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
 * From: https://gist.github.com/Jonarod/77d8e3a15c5c1bb55fa9d057d12f95bd
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
 * Convert a Blob to an Object Url.
 *
 * From: https://gist.github.com/Jonarod/77d8e3a15c5c1bb55fa9d057d12f95bd
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
 * Apply a threshold (binarization) to image pixel data.
 *
 * Based on https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/
 * Based on https://github.com/pa7/binarize.js/blob/master/src/binarize.js
 *
 * @param pixels The image pixel data.
 * @param threshold The threshold to apply (between 0 - 255).
 * @param method The threshold method to use.
 * @returns A one dimensional array of image pixel data with the threshold applied.
 */
const thresholdImageBasic = function (pixels: ImageData, threshold: number = 127, method: string = 'luminance'): Uint8ClampedArray {
  if (threshold < 0 || threshold > 255) {
    throw new Error("Threshold value must be between 0 and 255.");
  }

  let result = []

  // get the grayscale values and histogram
  for (let i = 0, length = pixels.data.length; i < length; i += 4) {
    const r = pixels.data[i];
    const g = pixels.data[i + 1];
    const b = pixels.data[i + 2];
    const a = pixels.data[i + 3];

    let grayscaleMethod: number;
    switch (method) {
      case 'luminance':
        grayscaleMethod = ((0.21 * r + 0.71 * g + 0.07 * b) >> 0);
        break;
      case 'average':
        grayscaleMethod = (r + g + b) / 3;
        break;
      case 'lightness':
        grayscaleMethod = (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
        break;
      default:
        throw new Error("The 'method' must be one of 'luminance', 'average', 'lightness'.");
    }

    const grayscaleValue = (grayscaleMethod < threshold) ? 0 : 1

    // R
    result.push(grayscaleValue);
    // G
    result.push(grayscaleValue);
    // B
    result.push(grayscaleValue);
    // A
    result.push(a);
  }

  return new Uint8ClampedArray(result);
}

/**
 * Apply an adaptive threshold (binarization) to image pixel data.
 *
 * From: https://github.com/federovskys/image-thresholding-OCR/blob/master/adaptativeThreshold.py
 *
 * @param imageInput The input image.
 * @param threshold The threshold percentage (0 - 100)
 * @returns A two-dimensional array of pixel data with the threshold applied.
 */
const thresholdImageAdaptiveCustom01 = function (
  imageInput: string | HTMLImageElement | HTMLCanvasElement,
  threshold: number = 25): number[][] {
  if (threshold < 0 || threshold > 100) {
    throw new Error("Threshold must be greater than or equal to 0 and less than or equal to 100.");
  }

  // load the image
  const image = cv.imread(imageInput);

  // Convert image to grayscale
  const gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY);

  // Original image size
  let orignrows: number, origncols: number;
  [orignrows, origncols] = gray.shape

  // Windows size
  const M = Math.floor(orignrows / 16) + 1;
  const N = Math.floor(origncols / 16) + 1;

  // Image border padding related to windows size
  const Mextend = Math.round(M / 2) - 1;
  const Nextend = Math.round(N / 2) - 1;

  // Padding image
  // _, top, bottom, left, right, borderType
  const aux = cv.copyMakeBorder(gray, Mextend, Mextend, Nextend, Nextend, cv.BORDER_REFLECT);

  const windows: number[][] = new Array(M).fill(0).map(() => new Array(N).fill(0));

  // Image integral calculation
  const imageIntegral = cv.integral(aux, windows, -1);

  // Integral image size
  let nrows: number, ncols: number;
  [nrows, ncols] = imageIntegral.shape;

  // allocation for cumulative region image
  const result: number[][] = new Array(orignrows).fill(0).map(() => new Array(origncols).fill(0));

  // Image cumulative pixels in windows size calculation
  const rowsMax = nrows - M;
  const colsMax = ncols - N;
  for (let i = 0; i < rowsMax; i++) {
    for (let j = 0; j < colsMax; j++) {
      result[i][j] = imageIntegral[i + M][j + N] - imageIntegral[i][j + N] + imageIntegral[i][j] - imageIntegral[i + M][j];
    }
  }

  // Output binary image allocation
  const binaryBool: boolean[][] = new Array(orignrows).fill(true).map(() => new Array(origncols).fill(true));

  // Gray image weighted by windows size
  // const graymult = (gray).astype('float64') * M * N;
  const graymult: number[][] = new Array(orignrows).fill(0).map(() => new Array(origncols).fill(0));
  for (let i = 0; i < orignrows; i++) {
    for (let j = 0; j < origncols; j++) {
      graymult[i][j] = gray[i][j] * M * N;
    }
  }

  // Output image binarization
  // binaryBool[graymult <= result * (100.0 - threshold) / 100.0] = False
  for (let i = 0; i < orignrows; i++) {
    for (let j = 0; j < origncols; j++) {
      binaryBool[i][j] = graymult[i][j] > result[i][j] * (100.0 - threshold) / 100.0;
    }
  }

  // binary image to UINT8 conversion
  // binaryInt =  = (255 * binaryBool).astype(np.uint8)
  const binaryInt: number[][] = new Array(orignrows).fill(0).map(() => new Array(origncols).fill(0));
  for (let i = 0; i < orignrows; i++) {
    for (let j = 0; j < origncols; j++) {
      binaryInt[i][j] = binaryBool[i][j] ? 255 : 0;
    }
  }

  return binaryInt;
}

/**
 * Use OpenCV Adaptive Threshold.
 *
 * Example: https://docs.opencv.org/4.7.0/d7/d4d/tutorial_py_thresholding.html
 * Example: https://github.com/adrn-mm/local-adaptive-threshold/blob/master/local-adaptive-threshold.py
 * Docs: https://docs.opencv.org/4.7.0/d7/d1b/group__imgproc__misc.html#ga72b913f352e4a1b1b397736707afcde3
 * Docs: https://docs.opencv.org/4.7.0/d7/dd0/tutorial_js_thresholding.html
 *
 * @param imageInput The input image.
 * @param thresholdValue The value to assign to pixels that pass the threshold.
 * @param thresholdMethod The adaptive threshold algorithm to use. Must be 'gaussian' or 'mean'.
 * @param thresholdType The type of threshold. Must be 'standard' or 'inverse'.
 * @param thresholdBlockSize The size of the pixel neighborhood that is used to calculate a threshold value. Must be 3 or greater and odd.
 * @param thresholdConstant The constant subtracted from the mean or weighted mean. Usually positive, but may be zero or negative.
 * @returns The thresholded image as
 */
const thresholdImageAdaptiveCv = function (
  imageInput: string | HTMLImageElement | HTMLCanvasElement,
  thresholdValue: number = 0, thresholdMethod: string = 'gaussian',
  thresholdType: string = 'standard', thresholdBlockSize: number = 11,
  thresholdConstant: number = 2): number[][] {

  // maxValue	non-zero value assigned to the pixels for which the condition is satisfied
  // e.g. 200, 0, 255
  if (thresholdValue < 0 || thresholdValue > 255) {
    throw new Error("Threshold value must be between 0 and 255.");
  }

  // constant e.g. 19, 2

  // adaptiveMethod	adaptive thresholding algorithm to use.
  // adaptiveMethod - It decides how thresholding value is calculated:
  // cv.ADAPTIVE_THRESH_MEAN_C or cv.ADAPTIVE_THRESH_GAUSSIAN_C
  let thresholdMethodValue: number;
  switch (thresholdMethod) {
    case 'gaussian':
      thresholdMethodValue = cv.ADAPTIVE_THRESH_GAUSSIAN_C;
      break;
    case 'mean':
      thresholdMethodValue = cv.ADAPTIVE_THRESH_MEAN_C;
      break;
    default:
      throw new Error("Invalid threshold method " + thresholdMethod);
  }

  // thresholdType	thresholding type that must be either cv.THRESH_BINARY or cv.THRESH_BINARY_INV.
  let thresholdTypeValue: number;
  switch (thresholdType) {
    case 'standard':
      thresholdTypeValue = cv.THRESH_BINARY;
      break;
    case 'inverse':
      thresholdTypeValue = cv.THRESH_BINARY_INV;
      break;
    default:
      throw new Error("Invalid threshold type " + thresholdType);
  }

  // blockSize	size of a pixel neighborhood that is used to calculate a threshold value for the pixel: 3, 5, 7, and so on.
  // e.g. 255, 3
  if (thresholdBlockSize < 3 || thresholdBlockSize % 2 === 0) {
    throw new Error("Threshold value must be 3 or greater and odd.");
  }

  // input and output images

  // src	source 8-bit single-channel image.
  const src = cv.imread(imageInput);

  // dst	destination image of the same size and the same type as src.
  const dst = new cv.Mat();

  // convert the source image to grayscale
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);

  // (optional) gamma correction
  const gamma = 1.2;
  cv.intensity_transform.gammaCorrection(src, src, gamma);

  // (optional) histogramm equalization
  cv.equalizeHist(src, src);

  const result = cv.adaptiveThreshold(src, dst, thresholdValue, thresholdMethodValue, thresholdTypeValue, thresholdBlockSize, thresholdConstant);
  return result;
  // cv.imshow('canvasOutput', dst);
  // src.delete();
  // dst.delete();
}

/**
 * Create a new Tesseract worker.
 *
 * @param infoHandler The function for info events.
 * @param errorHandler The function for error events.
 */
const createTesseractWorker = async function (
  infoHandler?: (arg: any) => void,
  errorHandler?: (arg: any) => void) {
  const tesseractWorker = await createWorker({
    logger: infoHandler || function (arg) {
      console.info(arg);
    },
    errorHandler: errorHandler || function (arg) {
      console.error(arg);
    },
  });
  await tesseractWorker.loadLanguage("eng");
  await tesseractWorker.initialize("eng");

  const browserBeforeUnload = fromEvent<BeforeUnloadEvent>(document, 'beforeunload')

  browserBeforeUnload.subscribe({
    next: async function (v) {
      console.info(v);
      if (tesseractWorker) {
        await tesseractWorker.terminate();
      }
    }, error: console.error
  });
  return tesseractWorker;
}

export {
  drawAndScaleImage,
  convertBlobToBase64,
  convertBlobToImageData,
  convertImageDataToBlob,
  convertObjectURLToBlob,
  convertBlobToObjectURL,
  convertTwoDimArrayToImageData,
  thresholdImageBasic,
  thresholdImageAdaptiveCustom01,
  thresholdImageAdaptiveCv,
  createTesseractWorker,
};

