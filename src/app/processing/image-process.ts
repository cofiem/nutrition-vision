// noinspection UnnecessaryLocalVariableJS

import {createWorker, RecognizeOptions, RecognizeResult, Rectangle} from "tesseract.js";
import {fromEvent} from "rxjs";
import * as Tesseract from "tesseract.js";
import {
  opencvWrapADAPTIVE_THRESH_GAUSSIAN_C,
  opencvWrapADAPTIVE_THRESH_MEAN_C,
  opencvWrapAdaptiveThreshold,
  opencvWrapBORDER_REFLECT,
  opencvWrapCOLOR_BGR2GRAY,
  opencvWrapCOLOR_RGBA2GRAY,
  opencvWrapCopyMakeBorder,
  opencvWrapCvtColor,
  opencvWrapCvtColorFull, opencvWrapDilate,
  opencvWrapEqualizeHist, opencvWrapFindContours,
  opencvWrapGaussianBlur, opencvWrapGetStructuringElement,
  opencvWrapImread,
  opencvWrapIntegral,
  opencvWrapIntensityTransformGammaCorrection,
  opencvWrapMat, opencvWrapMORPH_RECT,
  opencvWrapTHRESH_BINARY,
  opencvWrapTHRESH_BINARY_INV, opencvWrapTHRESH_OTSU,
  opencvWrapThreshold
} from "./opencv-wrapper";


/**
 * Draw and scale an image.
 *
 * From: https://gist.github.com/Jonarod/77d8e3a15c5c1bb55fa9d057d12f95bd
 *
 * @param img The image element.
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
 * Resize an image.
 *
 * From: https://github.com/eyalc4/ts-image-resizer
 * Can also consider: https://github.com/ericnograles/browser-image-resizer
 *
 * @param image The HTML image element.
 * @param width The image width.
 * @param height The image height.
 * @returns The image data for the resized image.
 */
const imageResizeVariation01 = function (image: HTMLImageElement, width: number, height: number): ImageData {
  if (!width || width < 1 || !height || height < 1) {
    throw new Error("Width and height must be greater than 0.");
  }

// Make sure the width and height preserve the original aspect ratio and adjust if needed
  if (image.height > image.width) {
    width = Math.floor(height * (image.width / image.height));
  } else {
    height = Math.floor(width * (image.height / image.width));
  }

  let resizingCanvas: HTMLCanvasElement = document.createElement('canvas');
  let resizingCanvasContext = resizingCanvas.getContext("2d");
  if (!resizingCanvasContext) throw new Error("Cannot get canvas 2d context.");

  // Start with original image size
  resizingCanvas.width = image.width;
  resizingCanvas.height = image.height;

  // Draw the original image on the (temp) resizing canvas
  resizingCanvasContext.drawImage(image, 0, 0, resizingCanvas.width, resizingCanvas.height);

  let curImageDimensions = {
    width: Math.floor(image.width),
    height: Math.floor(image.height)
  };

  let halfImageDimensions: { width: number | undefined, height: number | undefined } = {
    width: undefined,
    height: undefined
  };

  // Reduce the size by 50% each iteration, until the size is less than 2x time the target size
  // The motivation is to reduce the aliasing that would have been created with direct reduction
  // of very big image to small image.
  while (curImageDimensions.width * 0.5 > width) {
    // Reduce the resizing canvas by half and refresh the image
    halfImageDimensions.width = Math.floor(curImageDimensions.width * 0.5);
    halfImageDimensions.height = Math.floor(curImageDimensions.height * 0.5);

    resizingCanvasContext.drawImage(resizingCanvas, 0, 0, curImageDimensions.width, curImageDimensions.height,
      0, 0, halfImageDimensions.width, halfImageDimensions.height);

    curImageDimensions.width = halfImageDimensions.width;
    curImageDimensions.height = halfImageDimensions.height;
  }

  // Now do final resize for the resizingCanvas to meet the dimension requirments
  // directly to the output canvas, that will output the final image
  let outputCanvas: HTMLCanvasElement = document.createElement('canvas');
  let outputCanvasContext = outputCanvas.getContext("2d");
  if (!outputCanvasContext) throw new Error("Cannot get canvas 2d context.");

  outputCanvas.width = width;
  outputCanvas.height = height;

  outputCanvasContext.drawImage(
    resizingCanvas, 0, 0, curImageDimensions.width, curImageDimensions.height,
    0, 0, width, height);

  const result = outputCanvasContext.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
  return result;
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
const imageThresholdVariation01 = function (pixels: ImageData, threshold: number = 127, method: string = 'luminance'): Uint8ClampedArray {
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
const imageThresholdVariation02 = function (
  imageInput: string | HTMLImageElement | HTMLCanvasElement,
  threshold: number = 25): number[][] {
  if (threshold < 0 || threshold > 100) {
    throw new Error("Threshold must be greater than or equal to 0 and less than or equal to 100.");
  }

  // load the image
  const image = opencvWrapImread(imageInput);

  // Convert image to grayscale
  const gray = opencvWrapCvtColor(image, opencvWrapCOLOR_BGR2GRAY);

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
  const aux = opencvWrapCopyMakeBorder(gray, Mextend, Mextend, Nextend, Nextend, opencvWrapBORDER_REFLECT);

  const windows: number[][] = new Array(M).fill(0).map(() => new Array(N).fill(0));

  // Image integral calculation
  const imageIntegral = opencvWrapIntegral(aux, windows, -1);

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
const imageThresholdVariation03 = function (
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
      thresholdMethodValue = opencvWrapADAPTIVE_THRESH_GAUSSIAN_C;
      break;
    case 'mean':
      thresholdMethodValue = opencvWrapADAPTIVE_THRESH_MEAN_C;
      break;
    default:
      throw new Error("Invalid threshold method " + thresholdMethod);
  }

  // thresholdType	thresholding type that must be either cv.THRESH_BINARY or cv.THRESH_BINARY_INV.
  let thresholdTypeValue: number;
  switch (thresholdType) {
    case 'standard':
      thresholdTypeValue = opencvWrapTHRESH_BINARY;
      break;
    case 'inverse':
      thresholdTypeValue = opencvWrapTHRESH_BINARY_INV;
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
  const src = opencvWrapImread(imageInput);

  // dst	destination image of the same size and the same type as src.
  const dst = opencvWrapMat();

  // convert the source image to grayscale
  opencvWrapCvtColorFull(src, src, opencvWrapCOLOR_RGBA2GRAY, 0);

  // (optional) gamma correction
  const gamma = 1.2;
  opencvWrapIntensityTransformGammaCorrection(src, src, gamma);

  // (optional) histogramm equalization
  opencvWrapEqualizeHist(src, src);

  const result = opencvWrapAdaptiveThreshold(src, dst, thresholdValue, thresholdMethodValue, thresholdTypeValue, thresholdBlockSize, thresholdConstant);
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

const executeTesseractRecognize = async function (
  worker: Tesseract.Worker, image: ImageData, rect: Rectangle | undefined): Promise<RecognizeResult | undefined> {
  if (!worker || !image) {
    throw new Error("Must provider worker and image.");
  }

  const options: Partial<RecognizeOptions> = {rotateAuto: true};

  if (rect) {
    console.log("Init tesseract using rectangle  " + JSON.stringify(rect) + ".");
    options.rectangle = rect;
  }

  console.log("Started tesseract recognise for image with width " + image.width + " height " + image.height + ".");

  const result = await worker.recognize(image, {rotateAuto: true}, {
    osd: true, text: true, blocks: true,

    imageColor: true, imageGrey: true, imageBinary: true,
    debug: false, pdf: false, unlv: false, tsv: false,
    hocr: false, box: false,
  });

  console.log("Finished tesseract recognise.");

  return result;
}

/**
 * From: https://github.com/JPLeoRX/opencv-text-deskew/blob/master/python-service/services/deskew_service.py
 * See: https://becominghuman.ai/how-to-automatically-deskew-straighten-a-text-image-using-opencv-a0c30aed83df
 */
const calculateDeSkewAngleVariation01 = function (
  imageInput: string | HTMLImageElement | HTMLCanvasElement): number {

  // create an OpenCV image
  const image = opencvWrapImread(imageInput);

  // Convert image to grayscale
  const gray = opencvWrapCvtColor(image, opencvWrapCOLOR_BGR2GRAY);

  // apply gaussian blue
  const blur = opencvWrapGaussianBlur(gray, 9);

  // apply threshold
  const threshold = opencvWrapThreshold(blur, 0, 255, opencvWrapTHRESH_BINARY_INV + opencvWrapTHRESH_OTSU);

  // Apply dilation to merge text into meaningful lines/paragraphs.
  // Use larger kernel on X axis to merge characters into single line, cancelling out any spaces.
  // But use smaller kernel on Y axis to separate between different blocks of text
  const kernel = opencvWrapGetStructuringElement(opencvWrapMORPH_RECT, 30, 5);
  const dilateIterations = 5;
  const dilate = opencvWrapDilate(threshold, kernel, dilateIterations);

  // Find all contours
  const contours = opencvWrapFindContours(dilate);

  // Find the largest contour and surround in min area box
  const largestContour = contours[0];
  const minAreaRect = cv.minAreaRect(largestContour);

  // Determine the angle. Convert it to the value that was originally used to obtain skewed image
  let angle = minAreaRect[-1]
  let skew: number;
  if (angle < -45) {
    angle = 90 + angle
    skew = -1.0 * angle;
  } else if (angle > 45) {
    angle = 90 - angle
    skew = angle;
  } else {
    skew = -1.0 * angle;
  }

  // Maybe use the average angle of all contours.
  // allContourAngles = [cv2.minAreaRect(c)[-1] for c in contours]
  // angle = sum(allContourAngles) / len(allContourAngles)
  //
  // Maybe take the angle of the middle contour.
  // middleContour = contours[len(contours) // 2]
  // angle = cv2.minAreaRect(middleContour)[-1]
  //
  // Maybe average angle between largest, smallest and middle contours.
  // largestContour = contours[0]
  // middleContour = contours[len(contours) // 2]
  // smallestContour = contours[-1]
  // angle = sum([cv2.minAreaRect(largestContour)[-1], cv2.minAreaRect(middleContour)[-1], cv2.minAreaRect(smallestContour)[-1]]) / 3

  return skew;
}

/**
 * De-skew using OpenCV.
 */
const imageDeSkewVariation01 = function () {
  // todo
  // newImage = cvImage.copy()
  //         (h, w) = newImage.shape[:2]
  //         center = (w // 2, h // 2)
  //         M = cv2.getRotationMatrix2D(center, angle, 1.0)
  //         newImage = cv2.warpAffine(newImage, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
  //         return
}

/**
 * De-skew using canvas transforms.
 */
const imageDeSkewVariation02 = function () {
  // todo: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate
  //       https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/translate
}

/**
 * De-skew using css transforms.
 */
const imageDeSkewVariation03 = function () {
  // todo: https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate
}

export {
  drawAndScaleImage,
  convertBlobToBase64,
  convertBlobToImageData,
  convertImageDataToBlob,
  convertObjectURLToBlob,
  convertBlobToObjectURL,
  convertTwoDimArrayToImageData,
  imageResizeVariation01,
  imageThresholdVariation01,
  imageThresholdVariation02,
  imageThresholdVariation03,
  createTesseractWorker,
  executeTesseractRecognize,
  calculateDeSkewAngleVariation01,
  imageDeSkewVariation01,
  imageDeSkewVariation02,
  imageDeSkewVariation03,
};

