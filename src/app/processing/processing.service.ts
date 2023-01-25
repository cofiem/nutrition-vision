import {Injectable} from '@angular/core';
import {RecognizeResult, Worker, Rectangle} from "tesseract.js";
import {createTesseractWorker, executeTesseractRecognize} from "./tesseract";
import * as Tesseract from "tesseract.js";


@Injectable({
  providedIn: 'root'
})
export class ProcessingService {
  private tesseractWorker: Worker | undefined = undefined;

  private tesseractInProgress: boolean = false;

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

  async prepareImages(){

  }

  /**
   * Run the tesseract recognize.
   * @param image The image to process.
   * @param rect The optional portion of the image to process.
   */
  async doRecognize(image: Tesseract.ImageLike, rect: Rectangle | undefined): Promise<RecognizeResult | undefined> {
    const worker = await this.getWorker();
    if (this.tesseractInProgress) {
      console.warn("Tesseract is already processing, cannot process in parallel.");
      return undefined;
    }

    this.tesseractInProgress = true;
    const result = await executeTesseractRecognize(worker, image, rect);
    this.tesseractInProgress = false;

    // debug
    console.log(result);

    return result;
  }
}
