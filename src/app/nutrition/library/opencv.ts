import Logger from "../../logger/logger";

const logger = new Logger();
const logPrefix = "OpenCV Wrapper";

declare var cv: any;

const initOpenCV = function (): boolean {
  // NOTE: opencv.js is in the 'scripts' array in 'angular.json'.
  //       This means that the opencv.js script is initialised as part of the angular startup.
  //       So the '<script>' element events aren't available.
  //       Instead, check for startup completion and success in alternative ways.
  let isInitDone = false;
  while (!isInitDone) {
    if (!cv) {
      logger.debug(logPrefix, "Cannot access 'cv' yet.");
      continue;
    }
    if (cv['calledRun'] === true) {
      logger.debug(logPrefix, "Variable 'cv' is ready.");
      isInitDone = true;
    }
  }

  // ensure all required object properties / methods are available
  if (isInitDone) {
    const expected = new Set([
      'ADAPTIVE_THRESH_GAUSSIAN_C',
      'ADAPTIVE_THRESH_MEAN_C',
      'adaptiveThreshold',
      'BORDER_REFLECT',
      'CHAIN_APPROX_SIMPLE',
      'COLOR_BGR2GRAY',
      'COLOR_RGBA2GRAY',
      'contourArea',
      'copyMakeBorder',
      'CV_32SC4',
      'cvtColor',
      'dilate',
      'equalizeHist',
      'findContours',
      'GaussianBlur',
      'getBuildInformation',
      'getStructuringElement',
      'imread',
      'imshow',
      'integral',
      'Mat',
      'minAreaRect',
      'MORPH_RECT',
      'RETR_LIST',
      'Size',
      'THRESH_BINARY',
      'THRESH_BINARY_INV',
      'THRESH_OTSU',
      'threshold',

      // not available:
      // 'intensity_transform',
    ]);
    const notFound: string[] = [];

    expected.forEach((item) => {
      const itemValue = cv[item];
      if (itemValue === undefined && notFound.indexOf(item) < 0) {
        notFound.push(item);
      }
    });
    if (notFound.length > 0) {
      throw new Error("One or more expected opencv properties or methods are not available: " + JSON.stringify(notFound));
    }
  }

  return isInitDone;
}

const OpenCVNewMat = function(rows: number, cols: number, type: string): any {
  return new cv.Mat(rows, cols, type);
}

const OpenCVSetMatPixels = function (
  mat: any,
  valueFunc: (row: number, col: number, item: string, index: number, data: number[], currentValue: number) => number
): void {
  if (!mat.isContinuous()) {
    throw new Error("The Mat is not continuous.");
  }
  const data = mat.data;
  const rows = mat.rows;
  const cols = mat.cols;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = OpenCVGetMatIndex(mat, row, col);

      // red
      const rIndex = index;
      const rValue = data[rIndex];
      data[rIndex] = valueFunc(row, col, 'red', index, data, rValue);

      // green
      const gIndex = index + 1;
      const gValue = data[gIndex];
      data[gIndex] = valueFunc(row, col, 'green', index, data, gValue);

      // blue
      const bIndex = index + 2;
      const bValue = data[bIndex];
      data[bIndex] = valueFunc(row, col, 'blue', index, data, bValue);

      // alpha
      const aIndex = index + 3;
      const aValue = data[aIndex];
      data[aIndex] = valueFunc(row, col, 'alpha', index, data, aValue);

    }
  }
}

const OpenCVGetMatIndex = function(mat: any, row: number, col: number): number {
  const ch = mat.channels();
  const cols = mat.cols;
  return row * cols * ch + col * ch;
}

const OpenCVimread = function (image: string | HTMLCanvasElement | HTMLImageElement): any {
  logger.debug(logPrefix, "Converting image into OpenCV Mat format");
  const out = cv.imread(image);
  logger.debug(logPrefix, "Converted image into OpenCV Mat format");
  return out;
}

const OpenCVimshow = function (mat: any): ImageData {
  logger.debug(logPrefix, "Converting OpenCV Mat format into image.");
  const size = mat.size();
  let canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const out = cv.imshow(canvas, mat);
  if (out !== undefined) {
    throw new Error("Unexpected return value from cv.imshow: " + JSON.stringify(out));
  }

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Cannot get canvas 2d context.");

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  logger.debug(logPrefix, "Converted OpenCV Mat format into image.");

  return imageData;
}

const OpenCVcvtColor = function (mat: any, code: number): void {
  logger.debug(logPrefix, "Converting OpenCV Mat instance to cvt color code '" + code + "'.");
  const out = cv.cvtColor(mat, mat, code, 0);
  if (out !== undefined) {
    throw new Error("Unexpected return value from cv.cvtColor: " + JSON.stringify(out));
  }
  logger.debug(logPrefix, "Converted OpenCV Mat instance to cvt color code '" + code + "'.");
}

// const OpenCVMatZeros = function (width: number, height: number, type: number): any {
//   return cv.Mat.zeros(width, height, type);
// }

const OpenCVintensityTransformGammaCorrection = function (mat: any, gamma: number): void {
  logger.debug(logPrefix, "Converting OpenCV Mat instance gamma '" + gamma + "'.");

  const items = ['red', 'green', 'blue'];
  const gammaFunc = (row: number, col: number, item: string, index: number, data: number[], currentValue: number) => {
    if (items.indexOf(item) > -1) {
      return Math.pow((currentValue / 255.0), gamma) * 255.0;
    } else {
      return currentValue;
    }
  };
  OpenCVSetMatPixels(mat, gammaFunc);

  logger.debug(logPrefix, "Converted OpenCV Mat instance gamma '" + gamma + "'.");
}

const OpenCVgaussianBlur = function (mat: any, size: any): void {
  logger.debug(logPrefix, "Converting OpenCV Mat instance using gaussian blur '" + size + "'.");
  const out = cv.GaussianBlur(mat, new cv.Size(size, size), 0);
  if (out !== undefined) {
    throw new Error("Unexpected return value from cv.GaussianBlur: " + JSON.stringify(out));
  }
  logger.debug(logPrefix, "Converted OpenCV Mat instance using gaussian blur '" + size + "'.");
}

const OpenCVcopyMakeBorder = function (image: any, top: any, bottom: any, left: any, right: any, borderType: any, value: number | undefined = undefined): any {
  logger.debug(logPrefix, "Converting OpenCV Mat instance using copy make boarder '" + borderType + "'.");
  const result = new cv.Mat(image.rows + top + bottom, image.cols + left + right, image.type());

  const out = value === undefined
    ? cv.copyMakeBorder(image, result, top, bottom, left, right, borderType)
    : cv.copyMakeBorder(image, result, top, bottom, left, right, borderType, value);
  if (out !== undefined) {
    throw new Error("Unexpected return value from cv.copyMakeBorder: " + JSON.stringify(out));
  }
  logger.debug(logPrefix, "Converted OpenCV Mat instance using copy make boarder '" + borderType + "'.");
  return result;
}


const OpenCVintegral = function (image: any, rows: number, cols: number, num: number): any {
  logger.debug(logPrefix, "Converting OpenCV Mat instance using integral rows '" + rows + "' cols '" + cols + "'.");
  const windows = cv.Mat.zeros(rows, cols, OpenCVCV_8UC4());
  const out = cv.integral(image, windows, num);
  if (out !== undefined) {
    throw new Error("Unexpected return value from cv.integral: " + JSON.stringify(out));
  }
  logger.debug(logPrefix, "Converted OpenCV Mat instance using integral rows '" + rows + "' cols '" + cols + "'.");
  return windows;
}

const OpenCVEqualizeHist = function (mat: any): void {
  logger.debug(logPrefix, "Converting OpenCV Mat instance using equalize hist.");
  const out = cv.equalizeHist(mat, mat);
  if (out !== undefined) {
    throw new Error("Unexpected return value from cv.equalizeHist: " + JSON.stringify(out));
  }
  logger.debug(logPrefix, "Converted OpenCV Mat instance using equalize hist.");
}
const OpenCVThreshold = function (mat: any, thresholdValue: any, thresholdMethodValue: any, thresholdTypeValue: any): void {
  logger.debug(logPrefix, "Converting OpenCV Mat instance using threshold '" + thresholdMethodValue + "'.");
  const out = cv.threshold(mat, mat, thresholdValue, thresholdMethodValue, thresholdTypeValue);
  if (out !== undefined) {
    throw new Error("Unexpected return value from cv.threshold: " + JSON.stringify(out));
  }
  logger.debug(logPrefix, "Converted OpenCV Mat instance using threshold '" + thresholdMethodValue + "'.");
}

const OpenCVadaptiveThreshold = function (
  mat: any, thresholdValue: any, thresholdMethodValue: any, thresholdTypeValue: any,
  thresholdBlockSize: any, thresholdConstant: any): void {
  logger.debug(logPrefix, "Converting OpenCV Mat instance using adaptive threshold '" + thresholdMethodValue + "'.");
  const out = cv.adaptiveThreshold(
    mat, mat, thresholdValue, thresholdMethodValue,
    thresholdTypeValue, thresholdBlockSize, thresholdConstant);
  if (out !== undefined) {
    throw new Error("Unexpected return value from cv.adaptiveThreshold: " + JSON.stringify(out));
  }
  logger.debug(logPrefix, "Converted OpenCV Mat instance using adaptive threshold '" + thresholdMethodValue + "'.");
}

const OpenCVgetStructuringElement = function (shape: any, size1: any, size2: any): void {
  logger.debug(logPrefix, "Converting OpenCV Mat instance using get structuring element '" + size1 + "', '" + size2 + "'.");
  const size = new cv.Size(size1, size2);
  const out = cv.getStructuringElement(shape, size);
  if (out !== undefined) {
    throw new Error("Unexpected return value from cv.getStructuringElement: " + JSON.stringify(out));
  }
  logger.debug(logPrefix, "Converted OpenCV Mat instance using get structuring element '" + size1 + "', '" + size2 + "'.");
}
const OpenCVDilate = function (mat: any, kernel: any, iterations: any): void {
  logger.debug(logPrefix, "Converting OpenCV Mat instance using dilate '" + iterations + "'.");
  const out = cv.dilate(mat, kernel, null, null, iterations);
  if (out !== undefined) {
    throw new Error("Unexpected return value from cv.getStructuringElement: " + JSON.stringify(out));
  }
  logger.debug(logPrefix, "Converted OpenCV Mat instance using dilate '" + iterations + "'.");
}

const OpenCVfindContours = function (mat: any): void {
  logger.debug(logPrefix, "Converting OpenCV Mat instance using find contours.");
  // Extracts all contours from the image, and resorts them by area (from largest to smallest)
  let out = cv.findContours(mat, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE)
  // contours = sorted(contours, key = cv.contourArea, reverse = True)
  if (out !== undefined) {
    throw new Error("Unexpected return value from cv.findContours: " + JSON.stringify(out));
  }
  logger.debug(logPrefix, "Converted OpenCV Mat instance using find contours.");
}


const OpenCVminAreaRect = function (first: any) {
  return cv.minAreaRect(first);
}

const OpenCVgetBuildInformation = function () {
  return cv.getBuildInformation();
}

const OpenCVCOLOR_BGR2GRAY = function (): number {
  return cv.COLOR_BGR2GRAY;
}

const OpenCVCOLOR_RGBA2GRAY = function (): number {
  return cv.COLOR_RGBA2GRAY;
}
const OpenCVADAPTIVE_THRESH_GAUSSIAN_C = function (): number {
  return cv.ADAPTIVE_THRESH_GAUSSIAN_C;
}
const OpenCVADAPTIVE_THRESH_MEAN_C = function (): number {
  return cv.ADAPTIVE_THRESH_MEAN_C;
}
const OpenCVTHRESH_BINARY = function (): number {
  return cv.THRESH_BINARY;
}
const OpenCVTHRESH_BINARY_INV = function (): number {
  return cv.THRESH_BINARY_INV;
}
const OpenCVTHRESH_OTSU = function (): number {
  return cv.THRESH_OTSU;
}
const OpenCVMORPH_RECT = function (): number {
  return cv.MORPH_RECT;
}

const OpenCVBORDER_REFLECT = function (): number {
  return cv.BORDER_REFLECT;
}
const OpenCVCV_8UC4 = function (): number {
  return cv.CV_8UC4;
}

// console.log('image width: ' + mat.cols + '\n' +
//   'image height: ' + mat.rows + '\n' +
//   'image size: ' + mat.size().width + '*' + mat.size().height + '\n' +
//   'image depth: ' + mat.depth() + '\n' +
//   'image channels ' + mat.channels() + '\n' +
//   'image type: ' + mat.type() + '\n' +
//   'image continuous: ' + mat.isContinuous());

export {
  initOpenCV,
  OpenCVNewMat,
  OpenCVSetMatPixels,
  OpenCVGetMatIndex,
  OpenCVimread,
  OpenCVimshow,
  OpenCVcvtColor,
  OpenCVgetStructuringElement,
  OpenCVintensityTransformGammaCorrection,
  OpenCVcopyMakeBorder,
  OpenCVintegral,
  OpenCVEqualizeHist,
  OpenCVadaptiveThreshold,
  OpenCVgaussianBlur,
  OpenCVThreshold,
  OpenCVDilate,
  OpenCVfindContours,
  OpenCVminAreaRect,
  OpenCVgetBuildInformation,
  OpenCVCOLOR_BGR2GRAY,
  OpenCVCOLOR_RGBA2GRAY,
  OpenCVADAPTIVE_THRESH_GAUSSIAN_C,
  OpenCVADAPTIVE_THRESH_MEAN_C,
  OpenCVTHRESH_BINARY,
  OpenCVTHRESH_BINARY_INV,
  OpenCVTHRESH_OTSU,
  OpenCVMORPH_RECT,
  OpenCVBORDER_REFLECT,
}
