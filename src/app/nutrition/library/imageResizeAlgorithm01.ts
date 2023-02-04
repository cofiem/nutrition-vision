/*
 * Original is copyright https://github.com/eyalc4 under GPL 3 License.
 *
 * Source: https://github.com/eyalc4/ts-image-resizer/blob/82bc94bd61f0e38abb1b78e02cf59e33b7fa9265/ImageResizer.production.ts
 *
 * Includes modifications by https://github.com/cofiem
 */

import Logger from "../../logger/logger";

const logPrefix = "imageResizeAlgorithm01";

/**
 * Resize an image.
 *
 * @param image The HTML image element.
 * @param targetWidth The target image width.
 * @param targetHeight The target image height.
 * @returns The image data for the resized image.
 */
const imageResizeAlgorithm01 = function (image: HTMLImageElement, targetWidth: number, targetHeight: number): ImageData {
  if (!targetWidth || targetWidth < 1 || !targetHeight || targetHeight < 1) {
    throw new Error("Width and height must be greater than 0.");
  }
  const logger = new Logger();
  logger.debug(logPrefix, "Start imageResize01.");

// Make sure the width and height preserve the original aspect ratio and adjust if needed
  let width: number = targetWidth;
  let height: number = targetHeight;
  if (image.height > image.width) {
    const value = targetHeight * (image.width / image.height);
    width = Math.floor(value);
  } else {
    const value = targetWidth * (image.height / image.width);
    height = Math.floor(value);
  }

  if (!width || isNaN(width) || width < 1) {
    throw new Error("Invalid width " + JSON.stringify(width));
  }

  if (!height || isNaN(height) || height < 1) {
    throw new Error("Invalid height " + JSON.stringify(height));
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

  logger.info(logPrefix, "Finished imageResize01.");

  return result;
}

export default imageResizeAlgorithm01;

