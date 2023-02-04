/*
 * Original is copyright https://github.com/federovskys and under GPL 3 License.
 *
 * Source: https://github.com/federovskys/image-thresholding-OCR/blob/ee2751d719eebd0a00147c4acd5523faf4b427ce/adaptativeThreshold.py
 *
 * Includes modifications by https://github.com/cofiem
 */


import {
  OpenCVBORDER_REFLECT,
  OpenCVCOLOR_BGR2GRAY,
  OpenCVcopyMakeBorder,
  OpenCVcvtColor,
  OpenCVGetMatIndex,
  OpenCVimread, OpenCVimshow,
  OpenCVintegral, OpenCVNewMat, OpenCVSetMatPixels
} from "./opencv";
import Logger from "../../logger/logger";

const logPrefix = "imageThresholdAdaptive02";

/**
 * Apply an adaptive threshold (binarization) to image pixel data.
 *
 * @param imageInput The input image.
 * @param threshold The threshold percentage (0 - 100)
 * @returns A two-dimensional array of pixel data with the threshold applied.
 */
const imageThresholdAdaptive02 = function (
  imageInput: string | HTMLImageElement | HTMLCanvasElement,
  threshold: number = 25): ImageData {
  const logger = new Logger();
  logger.debug(logPrefix, "Start imageThresholdAdaptive02.");

  if (threshold < 0 || threshold > 100) {
    throw new Error("Threshold must be greater than or equal to 0 and less than or equal to 100.");
  }

  let matOriginal: any = null;
  let matGrayBorder: any = null;
  let matIntegral: any = null;
  let matCumulative: any = null;
  try {

    // load the image
    matOriginal = OpenCVimread(imageInput);

    // Convert image to grayscale
    OpenCVcvtColor(matOriginal, OpenCVCOLOR_BGR2GRAY());

    // Original image size
    const sizeOriginal = matOriginal.size();
    const rowsOriginal = sizeOriginal.height;
    const colsOriginal = sizeOriginal.width;

    // Windows size
    const windowsRows = Math.floor(rowsOriginal / 16) + 1;
    const windowsCols = Math.floor(colsOriginal / 16) + 1;

    // Image border padding related to windows size
    const windowsRowsExtend = Math.round(windowsRows / 2) - 1;
    const windowsColsExtend = Math.round(windowsCols / 2) - 1;

    // Padding image
    matGrayBorder = OpenCVcopyMakeBorder(
      matOriginal, windowsRowsExtend, windowsRowsExtend,
      windowsColsExtend, windowsColsExtend, OpenCVBORDER_REFLECT());

    // Image integral calculation
    matIntegral = OpenCVintegral(matGrayBorder, windowsRows, windowsCols, -1);

    // Integral image size
    const sizeIntegral = matIntegral.size();
    const rowsIntegral = sizeIntegral.height;
    const colsIntegral = sizeIntegral.width;
    const dataIntegral = matIntegral.data;

    // Image cumulative pixels in windows size calculation
    matCumulative = OpenCVNewMat(rowsOriginal, colsOriginal, matOriginal.type());
    const rowsMax = rowsIntegral - windowsRows;
    const colsMax = colsIntegral - windowsCols;
    const cumulativePixelsFunc = (row: number, col: number, item: string, index: number, data: number[], currentValue: number): number => {
      if (row > rowsMax || colsMax > colsMax) {
        return 0;
      }
      const value1 = dataIntegral[OpenCVGetMatIndex(matIntegral, row + windowsRows, col + windowsCols)];
      const value2 = dataIntegral[OpenCVGetMatIndex(matIntegral, row, col + windowsCols)];
      const value3 = dataIntegral[OpenCVGetMatIndex(matIntegral, row, col)];
      const value4 = dataIntegral[OpenCVGetMatIndex(matIntegral, row + windowsRows, col)];
      return value1 - value2 + value3 - value4;
    };
    OpenCVSetMatPixels(matCumulative, cumulativePixelsFunc);

    // Gray image weighted by windows size
    // const graymult = (gray).astype('float64') * M * N;
    const grayWeightedFunc = (row: number, col: number, item: string, index: number, data: number[], currentValue: number): number => {
      return currentValue * windowsRows * windowsCols;
    };
    OpenCVSetMatPixels(matOriginal, grayWeightedFunc);

    // Output image binarization
    // binaryBool[graymult <= result * (100.0 - threshold) / 100.0] = False
    // binary image to UINT8 conversion
    // binaryInt =  = (255 * binaryBool).astype(np.uint8)
    const binarizationFunc = (row: number, col: number, item: string, index: number, data: number[], currentValue: number): number => {
      const raw = currentValue <= matCumulative.data[index] * (100.0 - threshold) / 100.0;
      return raw ? 255 : 0
    };
    OpenCVSetMatPixels(matOriginal, binarizationFunc);

    const result = OpenCVimshow(matOriginal);

    logger.info(logPrefix, "Finished imageThresholdAdaptive02.");

    return result;

  } finally {
    if (matOriginal) matOriginal.delete();
    if (matGrayBorder) matGrayBorder.delete();
    if (matIntegral) matIntegral.delete();
    if (matCumulative) matCumulative.delete();
  }
}

export default imageThresholdAdaptive02;

