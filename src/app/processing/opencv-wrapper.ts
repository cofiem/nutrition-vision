/*
 * This file is a way to suppress the Typescript 'missing types' errors,
 * as OpenCV.js does not have types defined.
 */

// @ts-ignore
import * as cv from "../../assets/js/opencv"

const opencvWrapImread = function (image: any): any {
  // @ts-ignore
  return cv.imread(image);
}

const opencvWrapCvtColor = function (image: any, method: any): any {
  // @ts-ignore
  return cv.cvtColor(image, method);
}
const opencvWrapCvtColorFull = function (src: any, dst: any, method: any, num: any): any {
  // @ts-ignore
  return cv.cvtColor(src, dst, method, num);
}

const opencvWrapGaussianBlur = function (image: any, size: any): any {
  // @ts-ignore
  return cv.GaussianBlur(image, new cv.Size(size, size), 0);
}

const opencvWrapCopyMakeBorder = function (image: any, top: any, bottom: any, left: any, right: any, borderType: any): any {
  // @ts-ignore
  return cv.CopyMakeBorder(image, top, bottom, left, right, borderType);
}


const opencvWrapIntegral = function (aux: any, windows: any, num: any): any {
  // @ts-ignore
  return cv.Integral(aux, windows, num);
}

const opencvWrapMat = function (): any {
  // @ts-ignore
  return new cv.Mat();
}

const opencvWrapIntensityTransformGammaCorrection = function (src: any, dst: any, gamma: any): any {
  // @ts-ignore
  return cv.intensity_transform.gammaCorrection(src, dst, gamma);
}

const opencvWrapEqualizeHist = function (src: any, dst: any): any {
  // @ts-ignore
  return cv.EqualizeHist(src, dst);
}
const opencvWrapThreshold = function (
  src: any, thresholdValue: any, thresholdMethodValue: any, thresholdTypeValue: any): any {
  // @ts-ignore
  const result = cv.Threshold(src, thresholdValue, thresholdMethodValue, thresholdTypeValue);
  return result[1];
}
const opencvWrapAdaptiveThreshold = function (
  src: any, dst: any, thresholdValue: any, thresholdMethodValue: any, thresholdTypeValue: any,
  thresholdBlockSize: any, thresholdConstant: any): any {
  // @ts-ignore
  return cv.AdaptiveThreshold(src, dst, thresholdValue, thresholdMethodValue, thresholdTypeValue, thresholdBlockSize, thresholdConstant);
}

const opencvWrapGetStructuringElement = function (shape: any, size1: any, size2: any): any {
  // @ts-ignore
  return cv.getStructuringElement(shape, new cv.Size(size1, size2));
}
const opencvWrapDilate = function (image: any, kernel: any, iterations: any): any {
  // @ts-ignore
  return cv.dilate(image, kernel, null, null, iterations);
}

const opencvWrapFindContours = function (image: any): any {
  // Extracts all contours from the image, and resorts them by area (from largest to smallest)
  // todo
  let [contours, hierarchy] = cv.findContours(image, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE)
  contours = sorted(contours, key = cv.contourArea, reverse = True)
  return contours
}

// @ts-ignore
const opencvWrapCOLOR_BGR2GRAY = cv.COLOR_BGR2GRAY;
// @ts-ignore
const opencvWrapCOLOR_RGBA2GRAY = cv.COLOR_RGBA2GRAY;
// @ts-ignore
const opencvWrapADAPTIVE_THRESH_GAUSSIAN_C = cv.ADAPTIVE_THRESH_GAUSSIAN_C;
// @ts-ignore
const opencvWrapADAPTIVE_THRESH_MEAN_C = cv.ADAPTIVE_THRESH_MEAN_C;
// @ts-ignore
const opencvWrapTHRESH_BINARY = cv.THRESH_BINARY;
// @ts-ignore
const opencvWrapTHRESH_BINARY_INV = cv.THRESH_BINARY_INV;
// @ts-ignore
const opencvWrapBORDER_REFLECT = cv.BORDER_REFLECT;
// @ts-ignore
const opencvWrapTHRESH_OTSU = cv.THRESH_OTSU;
// @ts-ignore
const opencvWrapMORPH_RECT = cv.MORPH_RECT;


export {
  opencvWrapImread,
  opencvWrapCvtColor,
  opencvWrapCvtColorFull,
  opencvWrapGaussianBlur,
  opencvWrapCopyMakeBorder,
  opencvWrapIntegral,
  opencvWrapMat,
  opencvWrapIntensityTransformGammaCorrection,
  opencvWrapEqualizeHist,
  opencvWrapThreshold,
  opencvWrapAdaptiveThreshold,
  opencvWrapGetStructuringElement,
  opencvWrapDilate,
  opencvWrapFindContours,
  opencvWrapCOLOR_BGR2GRAY,
  opencvWrapCOLOR_RGBA2GRAY,
  opencvWrapADAPTIVE_THRESH_GAUSSIAN_C,
  opencvWrapADAPTIVE_THRESH_MEAN_C,
  opencvWrapTHRESH_BINARY,
  opencvWrapTHRESH_BINARY_INV,
  opencvWrapBORDER_REFLECT,
  opencvWrapTHRESH_OTSU,
  opencvWrapMORPH_RECT,
}
