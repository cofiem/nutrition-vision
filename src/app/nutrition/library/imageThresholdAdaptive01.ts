import {
  OpenCVADAPTIVE_THRESH_GAUSSIAN_C,
  OpenCVADAPTIVE_THRESH_MEAN_C,
  OpenCVadaptiveThreshold, OpenCVCOLOR_BGR2GRAY,
  OpenCVCOLOR_RGBA2GRAY,
  OpenCVcvtColor,
  OpenCVEqualizeHist,
  OpenCVimread,
  OpenCVimshow,
  OpenCVintensityTransformGammaCorrection,
  OpenCVTHRESH_BINARY,
  OpenCVTHRESH_BINARY_INV
} from "./opencv";
import Logger from "../../logger/logger";

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
 * @param thresholdPrepare The preparation to use. Must be 'none', 'gamma', or 'hist'.
 * @param thresholdMethod The adaptive threshold algorithm to use. Must be 'gaussian' or 'mean'.
 * @param thresholdType The type of threshold. Must be 'standard' or 'inverse'.
 * @param thresholdBlockSize The size of the pixel neighborhood that is used to calculate a threshold value. Must be 3 or greater and odd.
 * @param thresholdConstant The constant subtracted from the mean or weighted mean. Usually positive, but may be zero or negative.
 * @returns The thresholded image as image data.
 */
const imageThresholdAdaptive01 = function (
  imageInput: string | HTMLImageElement | HTMLCanvasElement, thresholdValue: number, thresholdPrepare: string, thresholdMethod: string,
  thresholdType: string, thresholdBlockSize: number, thresholdConstant: number): ImageData {
  const logger = new Logger();
  logger.debug(logPrefix, "Start imageThresholdAdaptive01.");
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

  let mat: any = null;
  try {
    // input and output images

    // src	source 8-bit single-channel image.
    mat = OpenCVimread(imageInput);

    // convert the source image to grayscale
    OpenCVcvtColor(mat, OpenCVCOLOR_RGBA2GRAY());

    // preparation - pick one: none, gamma, hist
    switch (thresholdPrepare) {
      case 'none':
        break;
      case 'gamma':
        // gamma correction
        const gamma = 1.2;
        OpenCVintensityTransformGammaCorrection(mat, gamma);
        break;
      case 'hist':
        // histogramm equalization
        OpenCVEqualizeHist(mat);
        break;
      default:
        throw new Error("Invalid threshold prepare " + thresholdPrepare);
    }

    OpenCVadaptiveThreshold(mat, thresholdValue, thresholdMethodValue, thresholdTypeValue, thresholdBlockSize, thresholdConstant);

    const result = OpenCVimshow(mat);

    logger.info(logPrefix, "Finished imageThresholdAdaptive01.");

    return result;
  } finally {
    if (mat) {
      mat.delete();
    }
  }
}




export default imageThresholdAdaptive01;
