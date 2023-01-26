/*
 * Original is copyright https://github.com/pa7
 *
 * Used under fair use / small content / modifications made.
 *
 * Source: https://github.com/pa7/binarize.js/blob/master/src/user-defined.js
 *
 * Also based on: Based on https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/
 *
 * Includes modifications by https://github.com/cofiem
 */

/**
 * Apply a threshold (binarization) to image pixel data.
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

    const grayscaleValue = (grayscaleMethod < threshold) ? 0 : 255

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

export {
  imageThresholdVariation01
}
