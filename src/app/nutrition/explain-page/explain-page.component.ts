import {Component} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {ProgressBarMode} from "@angular/material/progress-bar";

import {LoggerService} from "../../logger/logger.service";
import {ProcessingService} from "../library/processing.service";
import {Observable, of} from "rxjs";
import {convertBlobToImage, convertUploadToImageFile} from "../library/conversions-01";


@Component({
  selector: 'app-explain-page',
  templateUrl: './explain-page.component.html',
  styleUrls: ['./explain-page.component.scss']
})
export class ExplainPageComponent {
  fileSelectedInfo: string;

  stepCards: any[];

  private logPrefix: string = "Explain";

  constructor(
    private processingService: ProcessingService,
    private sanitizer: DomSanitizer,
    private logger: LoggerService) {
    this.stepCards = [];
    this.fileSelectedInfo = "Image info will be shown here.";
  }


  async onFileSelected(event: Event) {
    this.stepCards = [];

    this.processingService.openCVInitialiseResources();
    await this.processingService.tesseractInitialiseResources();

    // get the selected file
    const eventTarget = event.target as HTMLInputElement;
    if (!eventTarget) throw new Error("No 'target' for 'onFileSelected' event.");

    const inputFile = convertUploadToImageFile(eventTarget);
    const image = await convertBlobToImage(inputFile);

    this.fileSelectedInfo = "Selected image is '" + inputFile.type + "' with dimensions " +
      image.width + "px wide by " + image.height + "px high.";

    // resize
    const imageResize = await this.processingService.imageResize01(image);
    this.stepCards.push(imageResize.stepCard);

    // threshold
    const imageThresholdGeneric01 = await this.processingService.imageThresholdGeneric01(imageResize.imageData);
    this.stepCards.push(imageThresholdGeneric01.stepCard);

    const imageThresholdAdaptive01 = await this.processingService.imageThresholdAdaptive01(imageResize.image);
    this.stepCards.push(imageThresholdAdaptive01.stepCard);

    const imageThresholdAdaptive02 = await this.processingService.imageThresholdAdaptive02(imageResize.image);
    this.stepCards.push(imageThresholdAdaptive02.stepCard);

    // ocr
    const ocr = await this.processingService.tesseractRecognize(imageResize.image);
    if (!ocr || !ocr.data) {
      return;
    }

    if (ocr.data.imageColor) {
      this.stepCards.push(this.processingService.buildCardFromDataUri(
        "text recognition color image", "imageOcrColor",
        imageResize.imageData.width, imageResize.imageData.height,
        ocr.data.imageColor));
    }
    if (ocr.data.imageGrey) {
      this.stepCards.push(this.processingService.buildCardFromDataUri(
        "text recognition grey image", "imageOcrGrey",
        imageResize.imageData.width, imageResize.imageData.height,
        ocr.data.imageGrey));
    }
    if (ocr.data.imageBinary) {
      this.stepCards.push(this.processingService.buildCardFromDataUri(
        "text recognition binary image", "imageOcrBinary",
        imageResize.imageData.width, imageResize.imageData.height,
        ocr.data.imageBinary));
    }

    // show image with words outlined using 'ocr.data'
    if (ocr.data.words && imageResize.blob) {
      const card = this.processingService.buildCardFromBlob(
        "text recognition words", "imageOcrWords",
        imageResize.imageData.width, imageResize.imageData.height,
        imageResize.blob);
      card.extractedWords = ocr.data.words;
      card.imageWidth = imageResize.image.width;
      card.imageHeight = imageResize.image.height;
      this.stepCards.push(card);
    } else {
      this.logger.error(this.logPrefix, "Could not load image with words.");
    }

  }
}
