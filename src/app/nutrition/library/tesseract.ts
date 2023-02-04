import {
  Baseline,
  Bbox, Choice,
  createWorker,
  RecognizeOptions,
  RecognizeResult,
  Rectangle
} from "tesseract.js";
import {fromEvent} from "rxjs";
import Logger from "../../logger/logger";
import * as Tesseract from "tesseract.js";


const tesseractLogPrefix: string = "Tesseract";

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
  const logger = new Logger();
  const tesseractWorker = await createWorker({
    logger: infoHandler || function (arg) {
      logger.debug(tesseractLogPrefix, "Worker log: " + JSON.stringify(arg));
    },
    errorHandler: errorHandler || function (arg) {
      logger.error(tesseractLogPrefix, "Worker error: " + JSON.stringify(arg));
    },
  });
  await tesseractWorker.loadLanguage("eng");
  await tesseractWorker.initialize("eng");
  await tesseractWorker.setParameters({
    tessedit_ocr_engine_mode: Tesseract.OEM.DEFAULT,
    tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK,
    // user_defined_dpi: Define custom dpi, use to fix 'Warning: Invalid resolution 0 dpi. Using 70 instead.'
    user_defined_dpi: '100'
  });

  const browserBeforeUnload = fromEvent<BeforeUnloadEvent>(document, 'beforeunload')

  browserBeforeUnload.subscribe({
    next: async function (v) {
      logger.info(tesseractLogPrefix, "BeforeUnload log: " + JSON.stringify(v));
      if (tesseractWorker) {
        await tesseractWorker.terminate();
      }
    }, error: (arg) => {
      logger.error(tesseractLogPrefix, "BeforeUnload error: " + JSON.stringify(arg));
    }
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

  const logger = new Logger();
  const options: Partial<RecognizeOptions> = {rotateAuto: true};

  if (rect) {
    logger.info(tesseractLogPrefix, "Init tesseract using rectangle  " + JSON.stringify(rect) + ".");
    options.rectangle = rect;
  }

  logger.info(tesseractLogPrefix, "Started tesseract recognise for image.");

  const result = await worker.recognize(image, options, {
    osd: true, text: true, blocks: true,

    imageColor: true, imageGrey: true, imageBinary: true,
    debug: false, pdf: false, unlv: false, tsv: false,
    hocr: false, box: false,
  });

  logger.info(tesseractLogPrefix, "Finished tesseract recognise.");

  return result;
}

interface BasicWord {
  choices: Choice[];
  text: string;
  confidence: number;
  baseline: Baseline;
  bbox: Bbox;
  is_numeric: boolean;
  in_dictionary: boolean;
  direction: string;
  language: string;
  is_bold: boolean;
  is_italic: boolean;
  is_underlined: boolean;
  is_monospace: boolean;
  is_serif: boolean;
  is_smallcaps: boolean;
  font_size: number;
  font_id: number;
  font_name: string;
}

export {
  createTesseractWorker,
  executeTesseractRecognize,
  BasicWord
}
