import {isDevMode} from "@angular/core";

declare var cv: any;

const initOpenCV = function (): boolean {
  // NOTE: opencv.js is in the 'scripts' array in 'angular.json'.
  //       This means that the opencv.js script is initialised as part of the angular startup.
  //       So the '<script>' element events aren't available.
  //       Instead, check for startup completion and success in alternative ways.
  let isInitDone = false;
  while (!isInitDone) {
    if (!cv) {
      continue;
    }
    if (cv['calledRun'] === true) {
      isInitDone = true;
    }
  }

  // ensure all required object properties / methods are available
  if (isInitDone) {
    const expected = [
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
      'integral',
      // 'intensity_transform',
      'Mat',
      'minAreaRect',
      'MORPH_RECT',
      'RETR_LIST',
      'Size',
      'THRESH_BINARY',
      'THRESH_BINARY_INV',
      'THRESH_OTSU',
      'threshold',
    ];
    const notFound: string[] = [];

    expected.forEach((item) => {
      const itemValue = cv[item];
      if (cv[item] === undefined && notFound.indexOf(item) < 0) {
        notFound.push(item);
      }
    });
    if (notFound.length > 0) {
      throw new Error("One or more expected opencv properties or methods are not available: " + JSON.stringify(notFound));
    }
  }

  return isInitDone;
}


const openCVSetPixelGray = function (mat: any, row: number, col: number, value: number): void {
  if (!mat.isContinuous()) {
    throw new Error("The Mat provided to openCVSetPixelGray is not continuous.");
  }
  const channels = mat.channels();
  // R
  mat.data[row * mat.cols * channels + col * channels] = value;
  // G
  mat.data[row * mat.cols * channels + col * channels + 1] = value;
  // B
  mat.data[row * mat.cols * channels + col * channels + 2] = value;
  // A
  //mat.data[row * mat.cols * channels + col * channels + 3];
}

const OpenCVimread = function (source: string | HTMLCanvasElement | HTMLImageElement) {
  return cv.imread(source);
}

const OpenCVcvtColor = function (source: any, code: number): any {
  // TODO: ensure mat delete
  const dst = new cv.Mat();
  const out = cv.cvtColor(source, dst, code, 0);
  if (out !== undefined) {
    throw new Error("Unexpected return value from cv.cvtColor: " + JSON.stringify(out));
  }
  return dst;
}

const OpenCVMat = function (): any {
  // TODO: ensure mat delete
  return cv.Mat();
}

const OpenCVMatZeros = function (width: number, height: number, type: number): any {
  // TODO: ensure mat delete
  return cv.Mat.zeros(width, height, type);
}

const OpenCVintensityTransformGammaCorrection = function (source: any, gamma: number) {
  // TODO: ensure mat delete
  const dst = new cv.Mat();
  if (source.isContinuous()) {
    const data = source.data;
    const rows = source.rows;
    const cols = source.cols;
    const ch = source.channels();

    const gammaFunc = (value: number) => (Math.pow((value / 255.0), gamma) * 255.0);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const index = row * cols * ch + col * ch;

        const rIndex = index;
        const rValue = data[rIndex];
        data[rIndex] = gammaFunc(rValue);

        const gIndex = index + 1;
        const gValue = data[gIndex];
        data[gIndex] = gammaFunc(gValue);

        let bIndex = index + 2;
        let bValue = data[bIndex];
        data[bIndex] = gammaFunc(bValue);

        // let A = data[index + 3];

      }
    }
  }
  return dst;
}


const OpenCVCvtColor = function (src: any, code: number): any {
  const dst = new cv.Mat();
  cv.cvtColor(src, dst, code, 0);
  return dst;
}

const OpenCVgaussianBlur = function (image: any, size: any): any {

  return cv.GaussianBlur(image, new cv.Size(size, size), 0);
}

const OpenCVcopyMakeBorder = function (image: any, top: any, bottom: any, left: any, right: any, borderType: any): any {
  const out = cv.copyMakeBorder(image, top, bottom, left, right, borderType);
  if (out !== undefined) {
    throw new Error("Unexpected return value from cv.copyMakeBorder: " + JSON.stringify(out));
  }
  return
}


const OpenCVintegral = function (aux: any, windows: any, num: any): any {
  const out = cv.integral(aux, windows, num);
  if (out !== undefined) {
    throw new Error("Unexpected return value from cv.integral: " + JSON.stringify(out));
  }
  return null;
}

const OpenCVEqualizeHist = function (src: any): any {
  // TODO: ensure mat delete
  const dst = new cv.Mat();
  const out = cv.equalizeHist(src, dst);
  if (out !== undefined) {
    throw new Error("Unexpected return value from cv.equalizeHist: " + JSON.stringify(out));
  }
  return dst;
}
const OpenCVThreshold = function (
  src: any, thresholdValue: any, thresholdMethodValue: any, thresholdTypeValue: any): any {

  const result = cv.threshold(src, thresholdValue, thresholdMethodValue, thresholdTypeValue);
  return result[1];
}
const OpenCVadaptiveThreshold = function (
  src: any, thresholdValue: any, thresholdMethodValue: any, thresholdTypeValue: any,
  thresholdBlockSize: any, thresholdConstant: any): any {
  // TODO: ensure mat delete
  const dst = new cv.Mat();
  const out = cv.adaptiveThreshold(
    src, dst, thresholdValue, thresholdMethodValue,
    thresholdTypeValue, thresholdBlockSize, thresholdConstant);
  if (out !== undefined) {
    throw new Error("Unexpected return value from cv.adaptiveThreshold: " + JSON.stringify(out));
  }
  return dst;
}

const OpenCVgetStructuringElement = function (shape: any, size1: any, size2: any): any {

  return cv.getStructuringElement(shape, new cv.Size(size1, size2));
}
const OpenCVDilate = function (image: any, kernel: any, iterations: any): any {

  return cv.dilate(image, kernel, null, null, iterations);
}

const OpenCVfindContours = function (image: any): any {
  // Extracts all contours from the image, and resorts them by area (from largest to smallest)

  let [contours, hierarchy] = cv.findContours(image, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE)
  // TODO
  // contours = sorted(contours, key = cv.contourArea, reverse = True)
  return contours
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
const OpenCVCV_32SC4 = function (): number {
  return cv.CV_32SC4;
}


export {
  initOpenCV,
  openCVSetPixelGray,
  OpenCVimread,
  OpenCVcvtColor,
  OpenCVMat,
  OpenCVgetStructuringElement,
  OpenCVintensityTransformGammaCorrection,
  OpenCVcopyMakeBorder,
  OpenCVMatZeros,
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
  OpenCVCV_32SC4,
}
