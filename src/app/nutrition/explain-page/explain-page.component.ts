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

    // // get the selected file
    // const inputNode: any = document.querySelector('#file');
    //
    // const inputFile = convertUploadToImageFile(inputNode);
    //
    // // show preview of selected file
    // const imageOriginal: any = document.querySelector('#previewImageOriginal');
    // imageOriginal.src = window.URL.createObjectURL(inputFile);
    //
    // // run OCR
    // const result = await this.tesseractService.doRecognize(inputNode.files[0], undefined);
    // if (result) {
    //   this.text = result.data.text;
    //
    //   const imgOriginal: any = document.getElementById("imgOriginal");
    //   if (imgOriginal && result.data.imageColor) imgOriginal.src = result.data.imageColor;
    //
    //   const imgGrey: any = document.getElementById("imgGrey")
    //   if (imgGrey && result.data.imageColor) imgGrey.src = result.data.imageGrey;
    //
    //   const imgBinary: any = document.getElementById("imgBinary")
    //   if (imgBinary && result.data.imageColor) imgBinary.src = result.data.imageBinary;
    // }

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
    if (ocr && ocr.data && ocr.data.imageColor) {
      this.stepCards.push(this.processingService.buildCardFromDataUri("OCR color image", "imageOcrColor", ocr.data.imageColor));
    }
    if (ocr && ocr.data && ocr.data.imageGrey) {
      this.stepCards.push(this.processingService.buildCardFromDataUri("OCR grey image", "imageOcrGrey", ocr.data.imageGrey));
    }
    if (ocr && ocr.data && ocr.data.imageBinary) {
      this.stepCards.push(this.processingService.buildCardFromDataUri("OCR binary image", "imageOcrBinary", ocr.data.imageBinary));
    }

  }
}
