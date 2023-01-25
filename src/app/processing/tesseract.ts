import {createWorker, RecognizeOptions, RecognizeResult, Rectangle} from "tesseract.js";
import {fromEvent} from "rxjs";
import * as Tesseract from "tesseract.js";

/**
 * Create a new Tesseract worker.
 *
 * @param infoHandler The function for info events.
 * @param errorHandler The function for error events.
 * @returns The initialised Tesseract worker.
 */
const createTesseractWorker = async function (
  infoHandler?: (arg: any) => void,
  errorHandler?: (arg: any) => void) {
  const tesseractWorker = await createWorker({
    logger: infoHandler || function (arg) {
      console.info(arg);
    },
    errorHandler: errorHandler || function (arg) {
      console.error(arg);
    },
  });
  await tesseractWorker.loadLanguage("eng");
  await tesseractWorker.initialize("eng");

  const browserBeforeUnload = fromEvent<BeforeUnloadEvent>(document, 'beforeunload')

  browserBeforeUnload.subscribe({
    next: async function (v) {
      console.info(v);
      if (tesseractWorker) {
        await tesseractWorker.terminate();
      }
    }, error: console.error
  });
  return tesseractWorker;
}

/**
 * Recognise text in an image using Tesseract.
 *
 * The image does not need to be pre-processed, as tesseract.js will do some pre-processing.
 *
 * However, it can be useful to do some manual pre-processing, depending on the image.
 *
 * @param worker The initialised tesseract worker.
 * @param image The image to process.
 * @param rect The optional portion of the image.
 * @returns The tesseract result.
 */
const executeTesseractRecognize = async function (
  worker: Tesseract.Worker, image: Tesseract.ImageLike, rect: Rectangle | undefined): Promise<RecognizeResult | undefined> {
  if (!worker || !image) {
    throw new Error("Must provider worker and image.");
  }

  const options: Partial<RecognizeOptions> = {rotateAuto: true};

  if (rect) {
    console.log("Init tesseract using rectangle  " + JSON.stringify(rect) + ".");
    options.rectangle = rect;
  }

  console.log("Started tesseract recognise for image.");

  const result = await worker.recognize(image, {rotateAuto: true}, {
    osd: true, text: true, blocks: true,

    imageColor: true, imageGrey: true, imageBinary: true,
    debug: false, pdf: false, unlv: false, tsv: false,
    hocr: false, box: false,
  });

  console.log("Finished tesseract recognise.");

  return result;
}

export {
  createTesseractWorker,
  executeTesseractRecognize,
}
