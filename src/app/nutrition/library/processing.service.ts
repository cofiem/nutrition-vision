import {Injectable} from '@angular/core';
import {isDevMode} from "@angular/core";
import {ProgressBarMode} from "@angular/material/progress-bar";
import {DomSanitizer} from "@angular/platform-browser";

import {LoggerService} from "../../logger/logger.service";

import {ImageLike, RecognizeResult, Rectangle, Worker} from "tesseract.js";

import {createTesseractWorker, executeTesseractRecognize} from "./tesseract";
import {initOpenCV, OpenCVgetBuildInformation} from "./opencv";

import {convertBlobToSafeUrl, convertImageDataToImage, convertTwoDimArrayToImageData} from "./conversions-01";
import {convertImageDataToBlob} from "./conversions-02";
import imageResizeAlgorithm01 from "./imageResizeAlgorithm01";
import imageThresholdGeneric01 from "./imageThresholdGeneric01";
import imageThresholdAdaptive01 from './imageThresholdAdaptive01';
import imageThresholdAdaptive02 from './imageThresholdAdaptive02';
import ProcessingOutput from "./processing-output";


@Injectable()
export class ProcessingService {
  private logPrefix: string = "Processing";

  // open cv
  private openCVIsInitDone: boolean = false;

  // tesseract
  private tesseractWorker: Worker | undefined = undefined;
  private tesseractInProgress: boolean = false;

  constructor(
    private logger: LoggerService,
    private sanitizer: DomSanitizer
  ) {
  }

  openCVInitialiseResources(): void {
    const isOpenCVInitialised = initOpenCV();
    if (isOpenCVInitialised) {
      this.logger.info(this.logPrefix, "Initialisation finished successfully.");
    } else {
      throw new Error("OpenCV Initialisation failed.");
    }
    if (isDevMode()) {
      this.logger.debug(this.logPrefix, OpenCVgetBuildInformation());
    }
    this.openCVIsInitDone = true;
  }

  openCvIsInitialised(): boolean {
    return this.openCVIsInitDone;
  }

  openCVCheckInitialised(): void {
    if (!this.openCvIsInitialised()) {
      throw new Error("OpenCV is not initialised.");
    }
  }

  /**
   * Creates a worker if none is available.
   */
  async tesseractInitialiseResources(): Promise<boolean> {
    if (!this.tesseractWorker) {
      this.tesseractWorker = await createTesseractWorker();
    }
    return !!this.tesseractWorker;
  }

  tesseractIsInitialised(): boolean {
    return !!this.tesseractWorker;
  }

  tesseractCheckInitialised(): void {
    if (!this.tesseractIsInitialised()) {
      throw new Error("Tesseract is not initialised.");
    }
  }

  async getTesseractWorker(): Promise<Worker> {
    await this.tesseractInitialiseResources();
    if (this.tesseractWorker) {
      return this.tesseractWorker;
    } else {
      throw new Error("Tesseract worker is not available.");
    }
  }

  /**
   * Run the tesseract recognize.
   * @param image The image to process.
   * @param rect The optional portion of the image to process.
   */
  async runTesseractRecognize(image: ImageLike, rect: Rectangle | undefined): Promise<RecognizeResult | undefined> {
    if (this.tesseractInProgress) {
      this.logger.warn(this.logPrefix, "Tesseract is already processing, cannot process in parallel.");
      return undefined;
    }

    this.tesseractInProgress = true;
    const worker = await this.getTesseractWorker();
    const result = await executeTesseractRecognize(worker, image, rect);
    this.tesseractInProgress = false;

    if (isDevMode()) {
      this.logger.debug(this.logPrefix, result);
    }

    return result;
  }

  async imageResize01(imageOriginal: HTMLImageElement): Promise<ProcessingOutput> {
    this.logger.info(this.logPrefix, "Start imageResize01.");
    let imageDataProcessed: ImageData;
    imageDataProcessed = imageResizeAlgorithm01(imageOriginal, 600, 600);
    if (imageDataProcessed.width != imageOriginal.width && imageDataProcessed.height != imageOriginal.height) {
      // imageInfo..this.fileSelectedInfo += " The image was resized to " + imageResizedImageData.width + "px wide by " +
      //   imageResizedImageData.height + "px high.";
    }
    const blobProcessed = await convertImageDataToBlob(imageDataProcessed);
    if (blobProcessed) {
      const objectUrlCheckedProcessed = convertBlobToSafeUrl(blobProcessed, this.sanitizer);

      const stepCard = {
        title: 'Resize image - option 1',
        imageId: 'imageResizeOption1',
        imageAlt: "Preview of image 1",
        imageSrc: objectUrlCheckedProcessed.srcUrl,
        progressMode: 'determinate' as ProgressBarMode,
        progressValue: 0,
        imageLoadFunc: (event: Event) => {
          this.logger.info(this.logPrefix, "Image resize successful.");
          this.logger.info(this.logPrefix, "Revoke object url.");
          URL.revokeObjectURL(objectUrlCheckedProcessed.objectUrl);
        },
        imageErrorFunc: (event: Event) => {
          this.logger.error(this.logPrefix, "Image resize error.");
          this.logger.error(this.logPrefix, "Revoke object url.");
          URL.revokeObjectURL(objectUrlCheckedProcessed.objectUrl);
        },
      };
      return new ProcessingOutput(
        imageDataProcessed,
        blobProcessed,
        convertImageDataToImage(imageDataProcessed),
        stepCard
      );
    } else {
      return new ProcessingOutput(
        imageDataProcessed,
        undefined,
        convertImageDataToImage(imageDataProcessed),
        undefined
      );
    }

  }

  async imageThresholdGeneric01(imageOriginal: ImageData): Promise<ProcessingOutput> {
    this.logger.info(this.logPrefix, "Start imageThresholdGeneric01.");
    const imageOneDimArrayProcessed = imageThresholdGeneric01(imageOriginal, 155);
    const imageDataProcessed = new ImageData(imageOneDimArrayProcessed, imageOriginal.width, imageOriginal.height);
    const blobProcessed = await convertImageDataToBlob(imageDataProcessed);
    if (blobProcessed) {
      const objectUrlCheckedProcessed = convertBlobToSafeUrl(blobProcessed, this.sanitizer);

      const stepCard = {
        title: 'Threshold image - option 1',
        imageId: 'imageThresholdOption1',
        imageAlt: "Preview of image 1",
        imageSrc: objectUrlCheckedProcessed.srcUrl,
        progressMode: 'determinate' as ProgressBarMode,
        progressValue: 0,
        imageLoadFunc: (event: Event) => {
          this.logger.info(this.logPrefix, "Image threshold variation 01 successful.");
          this.logger.info(this.logPrefix, "Revoke object url.");
          URL.revokeObjectURL(objectUrlCheckedProcessed.objectUrl);
        },
        imageErrorFunc: (event: Event) => {
          this.logger.info(this.logPrefix, "Image threshold variation 01 error.");
          this.logger.info(this.logPrefix, "Revoke object url.");
          URL.revokeObjectURL(objectUrlCheckedProcessed.objectUrl);
        },
      };
      return new ProcessingOutput(
        imageDataProcessed,
        blobProcessed,
        convertImageDataToImage(imageDataProcessed),
        stepCard
      );
    } else {
      return new ProcessingOutput(
        imageDataProcessed,
        undefined,
        convertImageDataToImage(imageDataProcessed),
        undefined
      );
    }
  }

  async imageThresholdAdaptive01(imageOriginal: string | HTMLImageElement | HTMLCanvasElement): Promise<ProcessingOutput> {
    this.logger.info(this.logPrefix, "Start imageThresholdAdaptive01.");
    const imageTwoDimArrayProcessed = imageThresholdAdaptive01(imageOriginal);
    const imageDataProcessed = convertTwoDimArrayToImageData(imageTwoDimArrayProcessed);
    const blobProcessed = await convertImageDataToBlob(imageDataProcessed);

    if (blobProcessed) {
      const objectUrlCheckedProcessed = convertBlobToSafeUrl(blobProcessed, this.sanitizer);

      const stepCard = {
        title: 'Threshold adaptive image - option 1',
        imageId: 'imageThresholdAdaptive01',
        imageAlt: "Preview of image threshold adaptive 1",
        imageSrc: objectUrlCheckedProcessed.srcUrl,
        progressMode: 'determinate' as ProgressBarMode,
        progressValue: 0,
        imageLoadFunc: (event: Event) => {
          this.logger.info(this.logPrefix, "Image threshold adaptive variation 01 successful.");
          this.logger.info(this.logPrefix, "Revoke object url.");
          URL.revokeObjectURL(objectUrlCheckedProcessed.objectUrl);
        },
        imageErrorFunc: (event: Event) => {
          this.logger.info(this.logPrefix, "Image threshold adaptive variation 01 error.");
          this.logger.info(this.logPrefix, "Revoke object url.");
          URL.revokeObjectURL(objectUrlCheckedProcessed.objectUrl);
        },
      };
      return new ProcessingOutput(
        imageDataProcessed,
        blobProcessed,
        convertImageDataToImage(imageDataProcessed),
        stepCard
      );
    } else {
      return new ProcessingOutput(
        imageDataProcessed,
        undefined,
        convertImageDataToImage(imageDataProcessed),
        undefined
      );
    }
  }

  async imageThresholdAdaptive02(imageOriginal: string | HTMLImageElement | HTMLCanvasElement) {
    this.logger.info(this.logPrefix, "Start threshold image variation 03.");
    const imageTwoDimArrayProcessed = imageThresholdAdaptive02(imageOriginal);
    const imageDataProcessed = convertTwoDimArrayToImageData(imageTwoDimArrayProcessed);
    const blobProcessed = await convertImageDataToBlob(imageDataProcessed);
  }
}
