// From: https://github.com/opencv/opencv/issues/15306#issuecomment-536124512

declare type MatType = any;

declare class OpenCV {

  static CV_8U: MatType;
  static CV_8UC1: MatType;
  static CV_8UC2: MatType;
  static CV_8UC3: MatType;
  static CV_8UC4: MatType;
  static CV_8S: MatType;
  static CV_8SC1: MatType;
  static CV_8SC2: MatType;
  static CV_8SC3: MatType;
  static CV_8SC4: MatType;
  static CV_16U: MatType;
  static CV_16UC1: MatType;
  static CV_16UC2: MatType;
  static CV_16UC3: MatType;
  static CV_16UC4: MatType;
  static CV_16S: MatType;
  static CV_16SC1: MatType;
  static CV_16SC2: MatType;
  static CV_16SC3: MatType;
  static CV_16SC4: MatType;
  static CV_32S: MatType;
  static CV_32SC1: MatType;
  static CV_32SC2: MatType;
  static CV_32SC3: MatType;
  static CV_32SC4: MatType;
  static CV_32F: MatType;
  static CV_32FC1: MatType;
  static CV_32FC2: MatType;
  static CV_32FC3: MatType;
  static CV_32FC4: MatType;
  static CV_64F: MatType;
  static CV_64FC1: MatType;
  static CV_64FC2: MatType;
  static CV_64FC3: MatType;
  static CV_64FC4: MatType;

  // added

  static COLOR_BGR2BGRA: number;
  static COLOR_RGB2RGBA: number;
  static COLOR_BGRA2BGR: number;
  static COLOR_RGBA2RGB: number;
  static COLOR_BGR2RGBA: number;
  static COLOR_RGB2BGRA: number;
  static COLOR_RGBA2BGR: number;
  static COLOR_BGRA2RGB: number;
  static COLOR_BGR2RGB: number;
  static COLOR_RGB2BGR: number;
  static COLOR_BGRA2RGBA: number;
  static COLOR_RGBA2BGRA: number;
  static COLOR_BGR2GRAY: number;
  static COLOR_RGB2GRAY: number;
  static COLOR_GRAY2BGR: number;
  static COLOR_GRAY2RGB: number;
  static COLOR_GRAY2BGRA: number;
  static COLOR_GRAY2RGBA: number;
  static COLOR_BGRA2GRAY: number;
  static COLOR_RGBA2GRAY: number;
  static COLOR_BGR2BGR565: number;
  static COLOR_RGB2BGR565: number;
  static COLOR_BGR5652BGR: number;
  static COLOR_BGR5652RGB: number;
  static COLOR_BGRA2BGR565: number;
  static COLOR_RGBA2BGR565: number;
  static COLOR_BGR5652BGRA: number;
  static COLOR_BGR5652RGBA: number;
  static COLOR_GRAY2BGR565: number;
  static COLOR_BGR5652GRAY: number;
  static COLOR_BGR2BGR555: number;
  static COLOR_RGB2BGR555: number;
  static COLOR_BGR5552BGR: number;
  static COLOR_BGR5552RGB: number;
  static COLOR_BGRA2BGR555: number;
  static COLOR_RGBA2BGR555: number;
  static COLOR_BGR5552BGRA: number;
  static COLOR_BGR5552RGBA: number;
  static COLOR_GRAY2BGR555: number;
  static COLOR_BGR5552GRAY: number;
  static COLOR_BGR2XYZ: number;
  static COLOR_RGB2XYZ: number;
  static COLOR_XYZ2BGR: number;
  static COLOR_XYZ2RGB: number;
  static COLOR_BGR2YCrCb: number;
  static COLOR_RGB2YCrCb: number;
  static COLOR_YCrCb2BGR: number;
  static COLOR_YCrCb2RGB: number;
  static COLOR_BGR2HSV: number;
  static COLOR_RGB2HSV: number;
  static COLOR_BGR2Lab: number;
  static COLOR_RGB2Lab: number;
  static COLOR_BGR2Luv: number;
  static COLOR_RGB2Luv: number;
  static COLOR_BGR2HLS: number;
  static COLOR_RGB2HLS: number;
  static COLOR_HSV2BGR: number;
  static COLOR_HSV2RGB: number;
  static COLOR_Lab2BGR: number;
  static COLOR_Lab2RGB: number;
  static COLOR_Luv2BGR: number;
  static COLOR_Luv2RGB: number;
  static COLOR_HLS2BGR: number;
  static COLOR_HLS2RGB: number;
  static COLOR_BGR2HSV_FULL: number;
  static COLOR_RGB2HSV_FULL: number;
  static COLOR_BGR2HLS_FULL: number;
  static COLOR_RGB2HLS_FULL: number;
  static COLOR_HSV2BGR_FULL: number;
  static COLOR_HSV2RGB_FULL: number;
  static COLOR_HLS2BGR_FULL: number;
  static COLOR_HLS2RGB_FULL: number;
  static COLOR_LBGR2Lab: number;
  static COLOR_LRGB2Lab: number;
  static COLOR_LBGR2Luv: number;
  static COLOR_LRGB2Luv: number;
  static COLOR_Lab2LBGR: number;
  static COLOR_Lab2LRGB: number;
  static COLOR_Luv2LBGR: number;
  static COLOR_Luv2LRGB: number;
  static COLOR_BGR2YUV: number;
  static COLOR_RGB2YUV: number;
  static COLOR_YUV2BGR: number;
  static COLOR_YUV2RGB: number;
  static COLOR_YUV2RGB_NV12: number;
  static COLOR_YUV2BGR_NV12: number;
  static COLOR_YUV2RGB_NV21: number;
  static COLOR_YUV2BGR_NV21: number;
  static COLOR_YUV420sp2RGB: number;
  static COLOR_YUV420sp2BGR: number;
  static COLOR_YUV2RGBA_NV12: number;
  static COLOR_YUV2BGRA_NV12: number;
  static COLOR_YUV2RGBA_NV21: number;
  static COLOR_YUV2BGRA_NV21: number;
  static COLOR_YUV420sp2RGBA: number;
  static COLOR_YUV420sp2BGRA: number;
  static COLOR_YUV2RGB_YV12: number;
  static COLOR_YUV2BGR_YV12: number;
  static COLOR_YUV2RGB_IYUV: number;
  static COLOR_YUV2BGR_IYUV: number;
  static COLOR_YUV2RGB_I420: number;
  static COLOR_YUV2BGR_I420: number;
  static COLOR_YUV420p2RGB: number;
  static COLOR_YUV420p2BGR: number;
  static COLOR_YUV2RGBA_YV12: number;
  static COLOR_YUV2BGRA_YV12: number;
  static COLOR_YUV2RGBA_IYUV: number;
  static COLOR_YUV2BGRA_IYUV: number;
  static COLOR_YUV2RGBA_I420: number;
  static COLOR_YUV2BGRA_I420: number;
  static COLOR_YUV420p2RGBA: number;
  static COLOR_YUV420p2BGRA: number;
  static COLOR_YUV2GRAY_420: number;
  static COLOR_YUV2GRAY_NV21: number;
  static COLOR_YUV2GRAY_NV12: number;
  static COLOR_YUV2GRAY_YV12: number;
  static COLOR_YUV2GRAY_IYUV: number;
  static COLOR_YUV2GRAY_I420: number;
  static COLOR_YUV420sp2GRAY: number;
  static COLOR_YUV420p2GRAY: number;
  static COLOR_YUV2RGB_UYVY: number;
  static COLOR_YUV2BGR_UYVY: number;
  static COLOR_YUV2RGB_Y422: number;
  static COLOR_YUV2BGR_Y422: number;
  static COLOR_YUV2RGB_UYNV: number;
  static COLOR_YUV2BGR_UYNV: number;
  static COLOR_YUV2RGBA_UYVY: number;
  static COLOR_YUV2BGRA_UYVY: number;
  static COLOR_YUV2RGBA_Y422: number;
  static COLOR_YUV2BGRA_Y422: number;
  static COLOR_YUV2RGBA_UYNV: number;
  static COLOR_YUV2BGRA_UYNV: number;
  static COLOR_YUV2RGB_YUY2: number;
  static COLOR_YUV2BGR_YUY2: number;
  static COLOR_YUV2RGB_YVYU: number;
  static COLOR_YUV2BGR_YVYU: number;
  static COLOR_YUV2RGB_YUYV: number;
  static COLOR_YUV2BGR_YUYV: number;
  static COLOR_YUV2RGB_YUNV: number;
  static COLOR_YUV2BGR_YUNV: number;
  static COLOR_YUV2RGBA_YUY2: number;
  static COLOR_YUV2BGRA_YUY2: number;
  static COLOR_YUV2RGBA_YVYU: number;
  static COLOR_YUV2BGRA_YVYU: number;
  static COLOR_YUV2RGBA_YUYV: number;
  static COLOR_YUV2BGRA_YUYV: number;
  static COLOR_YUV2RGBA_YUNV: number;
  static COLOR_YUV2BGRA_YUNV: number;
  static COLOR_YUV2GRAY_UYVY: number;
  static COLOR_YUV2GRAY_YUY2: number;
  static COLOR_YUV2GRAY_Y422: number;
  static COLOR_YUV2GRAY_UYNV: number;
  static COLOR_YUV2GRAY_YVYU: number;
  static COLOR_YUV2GRAY_YUYV: number;
  static COLOR_YUV2GRAY_YUNV: number;
  static COLOR_RGBA2mRGBA: number;
  static COLOR_mRGBA2RGBA: number;
  static COLOR_RGB2YUV_I420: number;
  static COLOR_BGR2YUV_I420: number;
  static COLOR_RGB2YUV_IYUV: number;
  static COLOR_BGR2YUV_IYUV: number;
  static COLOR_RGBA2YUV_I420: number;
  static COLOR_BGRA2YUV_I420: number;
  static COLOR_RGBA2YUV_IYUV: number;
  static COLOR_BGRA2YUV_IYUV: number;
  static COLOR_RGB2YUV_YV12: number;
  static COLOR_BGR2YUV_YV12: number;
  static COLOR_RGBA2YUV_YV12: number;
  static COLOR_BGRA2YUV_YV12: number;
  static COLOR_BayerBG2BGR: number;
  static COLOR_BayerGB2BGR: number;
  static COLOR_BayerRG2BGR: number;
  static COLOR_BayerGR2BGR: number;
  static COLOR_BayerRGGB2BGR: number;
  static COLOR_BayerGRBG2BGR: number;
  static COLOR_BayerBGGR2BGR: number;
  static COLOR_BayerGBRG2BGR: number;
  static COLOR_BayerRGGB2RGB: number;
  static COLOR_BayerGRBG2RGB: number;
  static COLOR_BayerBGGR2RGB: number;
  static COLOR_BayerGBRG2RGB: number;
  static COLOR_BayerBG2RGB: number;
  static COLOR_BayerGB2RGB: number;
  static COLOR_BayerRG2RGB: number;
  static COLOR_BayerGR2RGB: number;
  static COLOR_BayerBG2GRAY: number;
  static COLOR_BayerGB2GRAY: number;
  static COLOR_BayerRG2GRAY: number;
  static COLOR_BayerGR2GRAY: number;
  static COLOR_BayerRGGB2GRAY: number;
  static COLOR_BayerGRBG2GRAY: number;
  static COLOR_BayerBGGR2GRAY: number;
  static COLOR_BayerGBRG2GRAY: number;
  static COLOR_BayerBG2BGR_VNG: number;
  static COLOR_BayerGB2BGR_VNG: number;
  static COLOR_BayerRG2BGR_VNG: number;
  static COLOR_BayerGR2BGR_VNG: number;
  static COLOR_BayerRGGB2BGR_VNG: number;
  static COLOR_BayerGRBG2BGR_VNG: number;
  static COLOR_BayerBGGR2BGR_VNG: number;
  static COLOR_BayerGBRG2BGR_VNG: number;
  static COLOR_BayerRGGB2RGB_VNG: number;
  static COLOR_BayerGRBG2RGB_VNG: number;
  static COLOR_BayerBGGR2RGB_VNG: number;
  static COLOR_BayerGBRG2RGB_VNG: number;
  static COLOR_BayerBG2RGB_VNG: number;
  static COLOR_BayerGB2RGB_VNG: number;
  static COLOR_BayerRG2RGB_VNG: number;
  static COLOR_BayerGR2RGB_VNG: number;
  static COLOR_BayerBG2BGR_EA: number;
  static COLOR_BayerGB2BGR_EA: number;
  static COLOR_BayerRG2BGR_EA: number;
  static COLOR_BayerGR2BGR_EA: number;
  static COLOR_BayerRGGB2BGR_EA: number;
  static COLOR_BayerGRBG2BGR_EA: number;
  static COLOR_BayerBGGR2BGR_EA: number;
  static COLOR_BayerGBRG2BGR_EA: number;
  static COLOR_BayerRGGB2RGB_EA: number;
  static COLOR_BayerGRBG2RGB_EA: number;
  static COLOR_BayerBGGR2RGB_EA: number;
  static COLOR_BayerGBRG2RGB_EA: number;
  static COLOR_BayerBG2RGB_EA: number;
  static COLOR_BayerGB2RGB_EA: number;
  static COLOR_BayerRG2RGB_EA: number;
  static COLOR_BayerGR2RGB_EA: number;
  static COLOR_BayerBG2BGRA: number;
  static COLOR_BayerGB2BGRA: number;
  static COLOR_BayerRG2BGRA: number;
  static COLOR_BayerGR2BGRA: number;
  static COLOR_BayerRGGB2BGRA: number;
  static COLOR_BayerGRBG2BGRA: number;
  static COLOR_BayerBGGR2BGRA: number;
  static COLOR_BayerGBRG2BGRA: number;
  static COLOR_BayerRGGB2RGBA: number;
  static COLOR_BayerGRBG2RGBA: number;
  static COLOR_BayerBGGR2RGBA: number;
  static COLOR_BayerGBRG2RGBA: number;
  static COLOR_BayerBG2RGBA: number;
  static COLOR_BayerGB2RGBA: number;
  static COLOR_BayerRG2RGBA: number;
  static COLOR_BayerGR2RGBA: number;
  static COLOR_COLORCVT_MAX: number;


  static ADAPTIVE_THRESH_GAUSSIAN_C: number;
  static ADAPTIVE_THRESH_MEAN_C: number;
  static THRESH_BINARY: number;
  static THRESH_BINARY_INV: number;

  static BORDER_REFLECT: number;

  static then: (callback: (mod: typeof OpenCV) => void) => void;

  static imshow(cvs: HTMLCanvasElement | string, dst: OpenCV.Mat): void;

  static matFromImageData(imgData: ImageData): OpenCV.Mat;

  static matFromArray(rows: number, cols: number, type: MatType, array: ArrayBuffer): OpenCV.Mat;

  static imshow(cvs: HTMLCanvasElement | string, mat: OpenCV.Mat): void;

  static imread(source: string | HTMLCanvasElement | HTMLImageElement): OpenCV.Mat;

  // added

  static cvtColor(src: OpenCV.Mat, dst: OpenCV.Mat, code: number, dstCn?: number | undefined): void;

  static adaptiveThreshold(src: OpenCV.Mat, maxValue: number, adaptiveMethod: number, thresholdType: number, blockSize: number, C: number, dst: OpenCV.Mat): OpenCV.Mat;

  static equalizeHist(src: OpenCV.Mat, dst: OpenCV.Mat): OpenCV.Mat;

  static copyMakeBorder(src: OpenCV.Mat, dst: OpenCV.Mat, top: number, bottom: number, left: number, right: number, borderType: number, value: OpenCV.Scalar | undefined): void

  static integral(src: OpenCV.Mat, sum: OpenCV.Mat, sdepth: number): void;

}

declare namespace OpenCV {

  class NativeObject {
    delete: () => void;
  }

  class MatData {
    set: (data: ArrayBuffer) => void;
  }

  class Mat extends NativeObject {
    data: MatData;

    constructor();

    constructor(width: number, height: number, type: number);

    static zeros(width: number, height: number, type: number): Mat;

    [key: number]: number[];

    total(startDim: number, endDim: number): number;
  }

  class VideoCapture {
    video: HTMLVideoElement;

    constructor(src: string | HTMLVideoElement);

    read: (frame: OpenCV.Mat) => void
  }

  class Range {
    start: number;
    end: number;

    constructor(start: number, end: number);
  }

  class Point {
    x: number;
    y: number;

    constructor(x: number, y: number);
  }

  class Size {
    width: number;
    height: number;

    constructor(width: number, height: number);
  }

  class Rect {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor();
    constructor(rect: Rect);
    constructor(point: Point, size: Size);
    constructor(x: number, y: number, width: number, height: number);
  }

  class RotateRect {
    center: Point;
    size: Size;
    angle: number;

    constructor();
    constructor(center: Point, size: Size, angle: number);

    static points: (obj: any) => any;
    static boundingRect: (obj: any) => any;
    static boundingRect2f: (obj: any) => any;
  }

  class Scalar extends Array {
    static all(v: number): Scalar;

    constructor(v0: number, v1: number, v2: number, v3: number);
  }

  class MinMaxLoc {
    minVal: number;
    maxVal: number;
    minLoc: Point;
    maxLoc: Point;

    constructor();
    constructor(minVal: number, maxVal: number, minLoc: Point, maxLoc: Point);
  }

  class Circle {
    center: Point;
    radius: number;

    constructor();
    constructor(center: Point, radius: number);
  }

  class TermCriteria {
    type: number;
    maxCount: number;
    epsilon: number;

    constructor();
    constructor(type: number, maxCount: number, epsilon: number);
  }

  // added

  class intensity_transform {
    static gammaCorrection(input: OpenCV.Mat, output: OpenCV.Mat, gamma: number): void;
  }
}

export default OpenCV;
