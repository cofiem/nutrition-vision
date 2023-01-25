/*
 * Original is copyright https://github.com/eyalc4 under GPL 3 License.
 *
 * Source: https://github.com/eyalc4/ts-image-resizer/blob/82bc94bd61f0e38abb1b78e02cf59e33b7fa9265/ImageResizer.production.ts
 *
 * Includes modifications by https://github.com/cofiem
 */

/**
 * Resize an image.
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

export {
  imageResizeVariation01
}
