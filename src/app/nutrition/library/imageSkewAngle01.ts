/*
 * Original is copyright https://github.com/JPLeoRX
 *
 * Used under fair use / small content / modifications made.
 *
 * Source: https://github.com/JPLeoRX/opencv-text-deskew/blob/238907d9452259e7fc94538570647a642b7a44b2/python-service/services/deskew_service.py
 *
 * Related: https://becominghuman.ai/how-to-automatically-deskew-straighten-a-text-image-using-opencv-a0c30aed83df
 *
 * Includes modifications by https://github.com/cofiem
 */


import {
  OpenCVCOLOR_BGR2GRAY,
  OpenCVcvtColor, OpenCVDilate, OpenCVfindContours, OpenCVgaussianBlur, OpenCVgetStructuringElement,
  OpenCVimread, OpenCVminAreaRect, OpenCVMORPH_RECT,
  openCVSetPixelGray,
  OpenCVTHRESH_BINARY_INV, OpenCVTHRESH_OTSU, OpenCVThreshold
} from "./opencv";

const logPrefix = "imageSkewAngle01";

/**
 * Calculate the skew angle of text in an image.
 *
 * @param imageInput The image image.
 * @returns The calculated skew angle.
 */
const imageSkewAngle01 = function (
  imageInput: string | HTMLImageElement | HTMLCanvasElement): number {

  // create an OpenCV image
  const image = OpenCVimread(imageInput);

  // Convert image to grayscale
  const gray = OpenCVcvtColor(image, OpenCVCOLOR_BGR2GRAY());

  // apply gaussian blue
  const blur = OpenCVgaussianBlur(gray, 9);

  // apply threshold
  const threshold = OpenCVThreshold(blur, 0, 255,
    OpenCVTHRESH_BINARY_INV() + OpenCVTHRESH_OTSU());

  // Apply dilation to merge text into meaningful lines/paragraphs.
  // Use larger kernel on X axis to merge characters into single line, cancelling out any spaces.
  // But use smaller kernel on Y axis to separate between different blocks of text
  const kernel = OpenCVgetStructuringElement(OpenCVMORPH_RECT(), 30, 5);
  const dilateIterations = 5;
  const dilate = OpenCVDilate(threshold, kernel, dilateIterations);

  // Find all contours
  const contours = OpenCVfindContours(dilate);

  // Find the largest contour and surround in min area box
  const largestContour = contours[0];
  const minAreaRect = OpenCVminAreaRect(largestContour);

  // Determine the angle. Convert it to the value that was originally used to obtain skewed image
  let angle = minAreaRect[-1]
  let skew: number;
  if (angle < -45) {
    angle = 90 + angle
    skew = -1.0 * angle;
  } else if (angle > 45) {
    angle = 90 - angle
    skew = angle;
  } else {
    skew = -1.0 * angle;
  }

  // Maybe use the average angle of all contours.
  // allContourAngles = [cv2.minAreaRect(c)[-1] for c in contours]
  // angle = sum(allContourAngles) / len(allContourAngles)
  //
  // Maybe take the angle of the middle contour.
  // middleContour = contours[len(contours) // 2]
  // angle = cv2.minAreaRect(middleContour)[-1]
  //
  // Maybe average angle between largest, smallest and middle contours.
  // largestContour = contours[0]
  // middleContour = contours[len(contours) // 2]
  // smallestContour = contours[-1]
  // angle = sum([cv2.minAreaRect(largestContour)[-1], cv2.minAreaRect(middleContour)[-1], cv2.minAreaRect(smallestContour)[-1]]) / 3

  return skew;
}

export default imageSkewAngle01;
