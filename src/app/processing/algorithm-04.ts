/*
 * Original is copyright https://github.com/federovskys and under GPL 3 License.
 *
 * Source: https://github.com/federovskys/image-thresholding-OCR/blob/ee2751d719eebd0a00147c4acd5523faf4b427ce/adaptativeThreshold.py
 *
 * Includes modifications by https://github.com/cofiem
 */




import {OpenCV, opencvWrapCvtColor} from "./opencv";

/**
 * Apply an adaptive threshold (binarization) to image pixel data.
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
  const image = OpenCV.imread(imageInput);

  // Convert image to grayscale
  const gray = opencvWrapCvtColor(image, OpenCV.COLOR_BGR2GRAY);

  // Original image size
  let orignrows: number, origncols: number;
  orignrows = gray.total(1, 1);
  origncols = gray.total(2, 2);

  // Windows size
  const M = Math.floor(orignrows / 16) + 1;
  const N = Math.floor(origncols / 16) + 1;

  // Image border padding related to windows size
  const Mextend = Math.round(M / 2) - 1;
  const Nextend = Math.round(N / 2) - 1;

  // Padding image
  // _, top, bottom, left, right, borderType
  const auxDst = new OpenCV.Mat();
  const aux = OpenCV.copyMakeBorder(gray, Mextend, Mextend, Nextend, Nextend, OpenCV.BORDER_REFLECT, auxDst, undefined);

  // .new Array(M).fill(0).map(() => new Array(N).fill(0)
  const windows = OpenCV.Mat.zeros(M, N, OpenCV.CV_32SC4);

  // Image integral calculation
  const imageIntegral = OpenCV.integral(aux, windows, -1);

  // Integral image size
  let nrows: number, ncols: number;
  nrows = imageIntegral.total(1, 1);
  ncols = imageIntegral.total(1, 1);

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

export {
  imageThresholdVariation02
}
