import {Injectable, isDevMode} from '@angular/core';
import {ProgressBarMode} from "@angular/material/progress-bar";
import {DomSanitizer} from "@angular/platform-browser";

import {LoggerService} from "../../logger/logger.service";

import {ImageLike, RecognizeResult, Rectangle, Worker} from "tesseract.js";

import {createTesseractWorker, executeTesseractRecognize} from "./tesseract";
import {initOpenCV, OpenCVgetBuildInformation} from "./opencv";

import {convertBlobToSafeUrl, convertImageDataToImage} from "./conversions-01";
import {convertImageDataToBlob} from "./conversions-02";
import imageResizeAlgorithm01 from "./imageResizeAlgorithm01";
import imageThresholdGeneric01 from "./imageThresholdGeneric01";
import imageThresholdAdaptive01 from './imageThresholdAdaptive01';
import imageThresholdAdaptive02 from './imageThresholdAdaptive02';
import ProcessingOutput from "./processing-output";
import StepCard from "./step-card";


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
    if (isDevMode() && !this.openCVIsInitDone) {
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
  async tesseractRecognize(image: ImageLike, rect?: Rectangle | undefined): Promise<RecognizeResult | undefined> {
    if (this.tesseractInProgress) {
      this.logger.warn(this.logPrefix, "Tesseract is already processing, cannot process in parallel.");
      return undefined;
    }

    let result: RecognizeResult | undefined = undefined;

    this.tesseractInProgress = true;
    try {
      const worker = await this.getTesseractWorker();
      result = await executeTesseractRecognize(worker, image, rect);
    } finally {
      this.tesseractInProgress = false;
    }

    if (isDevMode()) {
      this.logger.debug(this.logPrefix, result);
    }

    return result;
  }

  async imageResize01(imageOriginal: HTMLImageElement): Promise<ProcessingOutput> {

    let imageDataProcessed: ImageData;
    imageDataProcessed = imageResizeAlgorithm01(imageOriginal, 600, 600);
    if (imageDataProcessed.width != imageOriginal.width && imageDataProcessed.height != imageOriginal.height) {
      // imageInfo.this.fileSelectedInfo += " The image was resized to " + imageResizedImageData.width + "px wide by " +
      //   imageResizedImageData.height + "px high.";
    }
    const blobProcessed = await convertImageDataToBlob(imageDataProcessed);
    if (blobProcessed) {
      const stepCard = this.buildCardFromBlob(
        'Resize image - option 1',
        'imageResizeOption1',
        imageDataProcessed.width, imageDataProcessed.height,
        blobProcessed);
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
    const imageOneDimArrayProcessed = imageThresholdGeneric01(imageOriginal, 155);
    const imageDataProcessed = new ImageData(imageOneDimArrayProcessed, imageOriginal.width, imageOriginal.height);
    const blobProcessed = await convertImageDataToBlob(imageDataProcessed);
    if (blobProcessed) {
      const stepCard = this.buildCardFromBlob(
        'Threshold image - option 1',
        'imageThresholdOption1',
        imageDataProcessed.width, imageDataProcessed.height,
        blobProcessed);
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
    const imageDataProcessed = imageThresholdAdaptive01(
      imageOriginal, 255, 'gamma', 'gaussian',
      'standard', 255, 19);
    const blobProcessed = await convertImageDataToBlob(imageDataProcessed);

    if (blobProcessed) {
      const stepCard = this.buildCardFromBlob(
        'Threshold adaptive image - option 1',
        'imageThresholdAdaptive01',
        imageDataProcessed.width, imageDataProcessed.height,
        blobProcessed);
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
    const imageDataProcessed = imageThresholdAdaptive02(imageOriginal);
    const blobProcessed = await convertImageDataToBlob(imageDataProcessed);

    if (blobProcessed) {
      const stepCard = this.buildCardFromBlob(
        'Threshold adaptive image - option 2',
        'imageThresholdAdaptive02',
        imageDataProcessed.width, imageDataProcessed.height,
        blobProcessed);
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

  buildCardFromBlob(
    title: string, imageId: string,
    imageWidth: number, imageHeight: number,
    blob: Blob
  ): StepCard {
    const objectUrlCheckedProcessed = convertBlobToSafeUrl(blob, this.sanitizer);
    return {
      title: title,
      imageId: imageId,
      imageAlt: "Preview of " + title,
      imageSrc: objectUrlCheckedProcessed.srcUrl,
      progressMode: 'determinate' as ProgressBarMode,
      progressValue: 0,
      extractedWords: undefined,
      imageWidth: imageWidth,
      imageHeight: imageHeight,
      imageLoadFunc: (event: Event) => {
        URL.revokeObjectURL(objectUrlCheckedProcessed.objectUrl);
        this.logger.debug(this.logPrefix, `Image load for ${imageId} successful (revoked object url).`);
      },
      imageErrorFunc: (event: Event) => {
        URL.revokeObjectURL(objectUrlCheckedProcessed.objectUrl);
        this.logger.error(this.logPrefix, `Image load for ${imageId} error (revoked object url).`);
      }
    };
  }

  buildCardFromDataUri(
    title: string, imageId: string,
    imageWidth: number, imageHeight: number,
    imageDataUri: string
  ): StepCard {
    return {
      title: title,
      imageId: imageId,
      imageAlt: "Preview of " + title,
      imageSrc: imageDataUri,
      progressMode: 'determinate' as ProgressBarMode,
      progressValue: 0,
      extractedWords: undefined,
      imageWidth: imageWidth,
      imageHeight: imageHeight,
      imageLoadFunc: (event: Event) => {
        this.logger.debug(this.logPrefix, `Image ${imageId} successful.`);
      },
      imageErrorFunc: (event: Event) => {
        this.logger.error(this.logPrefix, `Image ${imageId} error.`);
      },
    };
  }
}
