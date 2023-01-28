import {
  OpenCVADAPTIVE_THRESH_GAUSSIAN_C, OpenCVADAPTIVE_THRESH_MEAN_C, OpenCVadaptiveThreshold,
  OpenCVCOLOR_RGBA2GRAY, OpenCVcvtColor, OpenCVEqualizeHist,
  OpenCVimread, OpenCVintensityTransformGammaCorrection,
  OpenCVTHRESH_BINARY, OpenCVTHRESH_BINARY_INV
} from "./opencv";

const logPrefix = "imageThresholdAdaptive01";

/**
 * Use OpenCV Adaptive Threshold.
 *
 * Example: https://docs.opencv.org/4.7.0/d7/d4d/tutorial_py_thresholding.html
 * Example: https://github.com/adrn-mm/local-adaptive-threshold/blob/master/local-adaptive-threshold.py
 * Docs: https://docs.opencv.org/4.7.0/d7/d1b/group__imgproc__misc.html#ga72b913f352e4a1b1b397736707afcde3
 * Docs: https://docs.opencv.org/4.7.0/d7/dd0/tutorial_js_thresholding.html
 *
 * @param imageInput The input image.
 * @param thresholdValue The value to assign to pixels that pass the threshold.
 * @param thresholdMethod The adaptive threshold algorithm to use. Must be 'gaussian' or 'mean'.
 * @param thresholdType The type of threshold. Must be 'standard' or 'inverse'.
 * @param thresholdBlockSize The size of the pixel neighborhood that is used to calculate a threshold value. Must be 3 or greater and odd.
 * @param thresholdConstant The constant subtracted from the mean or weighted mean. Usually positive, but may be zero or negative.
 * @returns The thresholded image as
 */
const imageThresholdAdaptive01 = function (
  imageInput: string | HTMLImageElement | HTMLCanvasElement,
  thresholdValue: number = 0, thresholdMethod: string = 'gaussian',
  thresholdType: string = 'standard', thresholdBlockSize: number = 11,
  thresholdConstant: number = 2): number[][] {

  // maxValue	non-zero value assigned to the pixels for which the condition is satisfied
  // e.g. 200, 0, 255
  if (thresholdValue < 0 || thresholdValue > 255) {
    throw new Error("Threshold value must be between 0 and 255.");
  }

  // constant e.g. 19, 2

  // adaptiveMethod	adaptive thresholding algorithm to use.
  // adaptiveMethod - It decides how thresholding value is calculated:
  // cv.ADAPTIVE_THRESH_MEAN_C or cv.ADAPTIVE_THRESH_GAUSSIAN_C
  let thresholdMethodValue: number;
  switch (thresholdMethod) {
    case 'gaussian':
      thresholdMethodValue = OpenCVADAPTIVE_THRESH_GAUSSIAN_C();
      break;
    case 'mean':
      thresholdMethodValue = OpenCVADAPTIVE_THRESH_MEAN_C();
      break;
    default:
      throw new Error("Invalid threshold method " + thresholdMethod);
  }

  // thresholdType	thresholding type that must be either cv.THRESH_BINARY or cv.THRESH_BINARY_INV.
  let thresholdTypeValue: number;
  switch (thresholdType) {
    case 'standard':
      thresholdTypeValue = OpenCVTHRESH_BINARY();
      break;
    case 'inverse':
      thresholdTypeValue = OpenCVTHRESH_BINARY_INV();
      break;
    default:
      throw new Error("Invalid threshold type " + thresholdType);
  }

  // blockSize	size of a pixel neighborhood that is used to calculate a threshold value for the pixel: 3, 5, 7, and so on.
  // e.g. 255, 3
  if (thresholdBlockSize < 3 || thresholdBlockSize % 2 === 0) {
    throw new Error("Threshold value must be 3 or greater and odd.");
  }

  // input and output images

  // src	source 8-bit single-channel image.
  const originalMat = OpenCVimread(imageInput);

  // convert the source image to grayscale
  const grayMat = OpenCVcvtColor(originalMat, OpenCVCOLOR_RGBA2GRAY());

  // (optional) gamma correction
  const gamma = 1.2;
  const gammaMat = OpenCVintensityTransformGammaCorrection(grayMat, gamma);

  // (optional) histogramm equalization
  const equalisedMat = OpenCVEqualizeHist(grayMat);

  const result = OpenCVadaptiveThreshold(grayMat, thresholdValue, thresholdMethodValue, thresholdTypeValue, thresholdBlockSize, thresholdConstant);

  // todo: convert

  return [];
  // cv.imshow('canvasOutput', dst);
  // src.delete();
  // dst.delete();
}


/**
 * De-skew using OpenCV.
 */
const imageDeSkewVariation01 = function () {
  // todo
  // newImage = cvImage.copy()
  //         (h, w) = newImage.shape[:2]
  //         center = (w // 2, h // 2)
  //         M = cv2.getRotationMatrix2D(center, angle, 1.0)
  //         newImage = cv2.warpAffine(newImage, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
  //         return
}

/**
 * De-skew using canvas transforms.
 */
const imageDeSkewVariation02 = function () {
  // todo: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate
  //       https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/translate
}

/**
 * De-skew using css transforms.
 */
const imageDeSkewVariation03 = function () {
  // todo: https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate
}

export default imageThresholdAdaptive01;
