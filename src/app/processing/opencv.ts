
import OpenCV from "../../assets/js/opencv";
import * as cv from "../../assets/js/opencv";
import {isDevMode} from "@angular/core";

// console.log(cv);

let initOpenCVDone = false;

const initOpenCV = async function (): Promise<any> {
  if (initOpenCVDone) {
    // @ts-ignore
    return OpenCV;
  }
  // @ts-ignore
  if (OpenCV.getBuildInformation) {
    if (isDevMode()) {
      console.log("direct");
      // @ts-ignore
      console.log(OpenCV.getBuildInformation());
    }

    initOpenCVDone = true;
    // @ts-ignore
    return OpenCV;
  } else {
    // WASM
    // @ts-ignore
    if (OpenCV instanceof Promise) {
      // @ts-ignore
      const result = await OpenCV;
      if (isDevMode()) {
        console.log("async");
        console.log(result.getBuildInformation());
      }

      initOpenCVDone = true;
      return result;
    } else {
      // @ts-ignore
      OpenCV['onRuntimeInitialized'] = () => {
        if (isDevMode()) {
          console.log("func");
          // @ts-ignore
          console.log(OpenCV.getBuildInformation());
        }

        initOpenCVDone = true;
        // @ts-ignore
        return OpenCV;
      }
    }
  }
}
// initOpenCV();

const opencvWrapCvtColor = function (src: OpenCV.Mat, code: number): any {
  const dst = new OpenCV.Mat();
  OpenCV.cvtColor(src, dst, code, 0);
  return dst;
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
  // @ts-ignore
  let [contours, hierarchy] = cv.findContours(image, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE)
  // TODO
  // contours = sorted(contours, key = cv.contourArea, reverse = True)
  return contours
}

export {
  OpenCV,
  opencvWrapCvtColor
}


