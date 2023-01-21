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

@Injectable({
  providedIn: 'root'
})
export class TesseractService {

  private tesseractWorker: Worker | undefined = undefined;
  private tesseractFormats: OutputFormats = {
    osd: true, text: true, blocks: true,

    imageColor: false, imageGrey: false, imageBinary: false,
    debug: false, pdf: false, unlv: false, tsv: false,
    hocr: false, box: false,
  };
  private tesseractInProgress: boolean = false;
  private tesseractProgress: number = 0;

  private browserBeforeUnloadObservable;

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
      this.tesseractWorker = await createWorker({
        logger: m => {
          console.info(m);
        },
        errorHandler: m => {
          console.error(m);
        },
      });
      const worker = this.tesseractWorker;
      await worker.loadLanguage("eng");
      await worker.initialize("eng");

      this.browserBeforeUnloadObservable.subscribe(async function (v) {
        console.log(v);
        if (worker) {
          await worker.terminate();
        }
      }, console.error);
    }
    return this.tesseractWorker;
  }

  /**
   * Run the tesseract recognize.
   * @param image The image to process.
   * @param rect The optional portion of the image to process.
   */
  async doRecognize(image: ImageLike, rect: Rectangle | undefined): Promise<RecognizeResult | undefined> {
    const worker = await this.getWorker();
    if (this.tesseractInProgress) {
      return undefined;
    }

    this.tesseractInProgress = true;
    const options: Partial<RecognizeOptions> = {rotateAuto: true};
    if (rect) {
      options.rectangle = rect;
    }
    const result = await worker.recognize(image, {}, this.tesseractFormats);
    this.tesseractInProgress = false;

    console.log(result);

    return result;
  }
}
