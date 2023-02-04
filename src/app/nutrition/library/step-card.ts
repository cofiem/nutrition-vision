import {SafeUrl} from "@angular/platform-browser";
import {ProgressBarMode} from "@angular/material/progress-bar";
import {BasicWord} from "./tesseract";
import Logger from "../../logger/logger";

const logger = new Logger();
const logPrefix = "Step Card";

export default class StepCard {
  title: string
  imageId: string
  imageAlt: string
  imageSrc: SafeUrl
  progressMode: ProgressBarMode;
  progressValue: number
  imageWidth: number
  imageHeight: number
  extractedWords: BasicWord[] | undefined
  imageLoadFunc: (event: Event) => void
  imageErrorFunc: (event: Event) => void

  constructor(
    title: string,
    imageId: string,
    imageAlt: string,
    imageSrc: SafeUrl,
    imageWidth: number,
    imageHeight: number,
    progressValue: number,
    progressMode?: ProgressBarMode,
    extractedWords?: BasicWord[] | undefined,
    imageLoadFunc?: (event: Event) => void,
    imageErrorFunc?: (event: Event) => void
  ) {
    this.title = title;
    this.imageId = imageId;
    this.imageAlt = imageAlt;
    this.imageSrc = imageSrc;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.progressMode = progressMode || "determinate";
    this.progressValue = progressValue;
    this.extractedWords = extractedWords;
    this.imageLoadFunc = imageLoadFunc || function (event) {
      logger.info(logPrefix, "imageLoadFunc");
      logger.info(logPrefix, event);
    };
    this.imageErrorFunc = imageErrorFunc || function (event: Event) {
      logger.error(logPrefix, "imageErrorFunc");
      logger.error(logPrefix, event);
    };
  }
}
