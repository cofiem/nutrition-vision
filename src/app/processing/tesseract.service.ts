import {Injectable} from '@angular/core';
import {
  RecognizeOptions,
  RecognizeResult,
  Worker,
  OutputFormats,
  createWorker,
  Rectangle,
  ImageLike
} from "tesseract.js";
import {fromEvent, Observable} from "rxjs";
import {Config, readAndCompressImage} from "browser-image-resizer";
import {createTesseractWorker} from "./image-process";

@Injectable({
  providedIn: 'root'
})
export class TesseractService {

  private tesseractWorker: Worker | undefined = undefined;
  private tesseractFormats: OutputFormats = {
    osd: true, text: true, blocks: true,

    imageColor: true, imageGrey: true, imageBinary: true,
    debug: false, pdf: false, unlv: false, tsv: false,
    hocr: false, box: false,
  };
  private tesseractInProgress: boolean = false;
  private tesseractProgress: number = 0;

  private readonly browserBeforeUnloadObservable: Observable<BeforeUnloadEvent>;

  private imageResizeConfig: Config = {
    quality: 0.7,
    maxWidth: 800,
    maxHeight: 600,
    debug: true,
  };

  constructor() {
    this.browserBeforeUnloadObservable = fromEvent<BeforeUnloadEvent>(document, 'beforeunload');
  }

  onBeforeUnload(): Observable<BeforeUnloadEvent> {
    return this.browserBeforeUnloadObservable;
  }

  /**
   * Get the tesseract worker.
   * Creates a worker if none is available, otherwise will re-use the existing worker.
   */
  async getWorker(): Promise<Worker> {
    if (!this.tesseractWorker) {
      this.tesseractWorker = await createTesseractWorker();
    }
    return this.tesseractWorker;
  }

  /**
   * Run the tesseract recognize.
   * @param image The image to process.
   * @param rect The optional portion of the image to process.
   */
  async doRecognize(image: File, rect: Rectangle | undefined): Promise<RecognizeResult | undefined> {
    const worker = await this.getWorker();
    if (this.tesseractInProgress) {
      return undefined;
    }

    // todo: consider doing resize using canvas instead of File / Blob.

    // resize image
    const resizedImage = await this.resizeImage(image);

    // threshold image
    // const thresholdedImage = await this.thresholdImage(resizedImage);

    // process image
    this.tesseractInProgress = true;
    const options: Partial<RecognizeOptions> = {rotateAuto: true};
    if (rect) {
      options.rectangle = rect;
    }
    const result = await worker.recognize(resizedImage, {rotateAuto: true}, this.tesseractFormats);
    this.tesseractInProgress = false;

    console.log(result);

    return result;
  }

  async resizeImage(file: File) {
    try {
      return await readAndCompressImage(file, this.imageResizeConfig);
    } catch (error) {
      console.error(error);
      throw(error);
    }
  }

  /*
    async thresholdImage(blob: Blob): Promise<ImageData> {
      const imageData = await this.helpers.convertBlobToImageData(blob);
      // const threshold = this.helpers.thresholdOtsuCalc(imageData);
      const raw = this.helpers.thresholdImage(imageData);
      const thresholdImageData = this.helpers.buildImageData(raw, imageData.width, imageData.height);
      return Promise.resolve(thresholdImageData);
    }
  */
}
