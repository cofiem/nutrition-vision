/*
 * Original is copyright https://github.com/federovskys and under GPL 3 License.
 *
 * Source: https://github.com/federovskys/image-thresholding-OCR/blob/ee2751d719eebd0a00147c4acd5523faf4b427ce/adaptativeThreshold.py
 *
 * Includes modifications by https://github.com/cofiem
 */


import {
  OpenCVBORDER_REFLECT,
  OpenCVCOLOR_BGR2GRAY, OpenCVcopyMakeBorder, OpenCVCV_32SC4,
  OpenCVcvtColor,
  OpenCVimread, OpenCVintegral,
  OpenCVMat, OpenCVMatZeros,
  openCVSetPixelGray
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
  threshold: number = 25): number[][] {
  if (threshold < 0 || threshold > 100) {
    throw new Error("Threshold must be greater than or equal to 0 and less than or equal to 100.");
  }
  const logger = new Logger();
  logger.debug(logPrefix, "imageThresholdVariation02: starting");

  // load the image
  const inputMat = OpenCVimread(imageInput);
  logger.debug(logPrefix, "imageThresholdVariation02: original image loaded");

  // Convert image to grayscale
  const grayMat = OpenCVcvtColor(inputMat, OpenCVCOLOR_BGR2GRAY());
  logger.debug(logPrefix, "imageThresholdVariation02: gray image created");

  // Original image size
  const graySize = grayMat.size();
  const grayRows = graySize.height;
  const grayCols = graySize.width;

  // Windows size
  const windowsRows = Math.floor(grayRows / 16) + 1;
  const windowsCols = Math.floor(grayCols / 16) + 1;

  // Image border padding related to windows size
  const windowsRowsExtend = Math.round(windowsRows / 2) - 1;
  const windowsColsExtend = Math.round(windowsCols / 2) - 1;

  // Padding image
  const grayBorderMat = OpenCVcopyMakeBorder(
    grayMat, windowsRowsExtend, windowsRowsExtend,
    windowsColsExtend, windowsColsExtend, OpenCVBORDER_REFLECT());
  logger.debug(logPrefix, "imageThresholdVariation02: aux with border image created");

  // Image integral calculation
  const integralMat = OpenCVMatZeros(windowsRows, windowsCols, OpenCVCV_32SC4());
  const integralOut = OpenCVintegral(grayBorderMat, integralMat, -1);
  logger.debug(logPrefix, "imageThresholdVariation02: integral image created");

  // Integral image size
  const integralSize = integralMat.size();
  const integralRows = integralSize.height;
  const integralCols = integralSize.width;

  // allocation for cumulative region image
  const cumulativeCalcMat = OpenCVMatZeros(windowsRows, windowsCols, OpenCVCV_32SC4());

  console.log('image width: ' + integralMat.cols + '\n' +
    'image height: ' + integralMat.rows + '\n' +
    'image size: ' + integralMat.size().width + '*' + integralMat.size().height + '\n' +
    'image depth: ' + integralMat.depth() + '\n' +
    'image channels ' + integralMat.channels() + '\n' +
    'image type: ' + integralMat.type() + '\n' +
    'image continuous: ' + integralMat.isContinuous());


  // Image cumulative pixels in windows size calculation
  const rowsMax = integralRows - windowsRows;
  const colsMax = integralCols - windowsCols;
  for (let i = 0; i < rowsMax; i++) {
    for (let j = 0; j < colsMax; j++) {
      const value = integralMat[i + windowsRows][j + windowsCols] - integralMat[i][j + windowsCols] + integralMat[i][j] - integralMat[i + windowsRows][j];
      openCVSetPixelGray(cumulativeCalcMat, i, j, value);
    }
  }

  // Output binary image allocation
  const binaryBool: boolean[][] = new Array(grayRows).fill(true).map(() => new Array(grayCols).fill(true));

  // Gray image weighted by windows size
  // const graymult = (gray).astype('float64') * M * N;
  const graymult: number[][] = new Array(grayRows).fill(0).map(() => new Array(grayCols).fill(0));
  for (let i = 0; i < grayRows; i++) {
    for (let j = 0; j < grayCols; j++) {
      graymult[i][j] = grayMat[i][j] * windowsRows * windowsCols;
    }
  }

  // Output image binarization
  // binaryBool[graymult <= result * (100.0 - threshold) / 100.0] = False
  for (let i = 0; i < grayRows; i++) {
    for (let j = 0; j < grayCols; j++) {
      binaryBool[i][j] = graymult[i][j] > cumulativeCalcMat[i][j] * (100.0 - threshold) / 100.0;
    }
  }

  // binary image to UINT8 conversion
  // binaryInt =  = (255 * binaryBool).astype(np.uint8)
  const binaryInt: number[][] = new Array(grayRows).fill(0).map(() => new Array(grayCols).fill(0));
  for (let i = 0; i < grayRows; i++) {
    for (let j = 0; j < grayCols; j++) {
      binaryInt[i][j] = binaryBool[i][j] ? 255 : 0;
    }
  }

  return binaryInt;
}

export default imageThresholdAdaptive02;

