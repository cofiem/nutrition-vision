import {Component} from '@angular/core';
import {ProcessingService} from "../processing/processing.service";
import {
  convertBlobToImage, convertBlobToSafeUrl, convertImageDataToImage,
  convertTwoDimArrayToImageData,
  convertUploadToImageFile,
  StepCard
} from "../processing/conversions-01";
import {imageResizeVariation01} from "../processing/algorithm-03";
import {ProgressBarMode} from "@angular/material/progress-bar";
import {convertImageDataToBlob} from "../processing/conversions-02";
import {DomSanitizer} from "@angular/platform-browser";
import {imageThresholdVariation01} from "../processing/algorithm-02";
import {imageThresholdVariation02} from "../processing/algorithm-04";
import {imageThresholdVariation03} from "../processing/algorithm-01";

@Component({
  selector: 'app-explain-page',
  templateUrl: './explain-page.component.html',
  styleUrls: ['./explain-page.component.scss']
})
export class ExplainPageComponent {
  fileSelectedInfo: string = "Image info will be shown here.";

  stepCards: StepCard[];

  constructor(private processingService: ProcessingService, private sanitizer: DomSanitizer) {
    this.stepCards = [];
  }

  async onFileSelected(event: Event) {
    this.stepCards = [];

    // get the selected file
    const eventTarget = event.target as HTMLInputElement;
    if (!eventTarget) throw new Error("No 'target' for 'onFileSelected' event.");

    const inputFile = convertUploadToImageFile(eventTarget);
    const image = await convertBlobToImage(inputFile);

    this.fileSelectedInfo = "Selected image is '" + inputFile.type + "' with dimensions " +
      image.width + "px wide by " + image.height + "px high.";

    // resize
    let imageResizedImageData: ImageData;
    imageResizedImageData = imageResizeVariation01(image, 600, 600);
    if (imageResizedImageData.width != image.width && imageResizedImageData.height != image.height) {
      this.fileSelectedInfo += " The image was resized to " + imageResizedImageData.width + "px wide by " +
        imageResizedImageData.height + "px high.";
    }
    const imageResizedBlob = await convertImageDataToBlob(imageResizedImageData);
    if (imageResizedBlob) {
      const imageResizedObjectUrlChecked = convertBlobToSafeUrl(imageResizedBlob, this.sanitizer);

      const stepCardResizeOption1 = {
        title: 'Resize image - option 1',
        imageId: 'imageResizeOption1',
        imageAlt: "Preview of image 1",
        imageSrc: imageResizedObjectUrlChecked.srcUrl,
        progressMode: 'determinate' as ProgressBarMode,
        progressValue: 0,
        imageLoadFunc: (event: Event) => {
          console.log(event);
          URL.revokeObjectURL(imageResizedObjectUrlChecked.objectUrl);
        },
        imageErrorFunc: (event: Event) => {
          console.error(event);
          URL.revokeObjectURL(imageResizedObjectUrlChecked.objectUrl);
        },
      };
      this.stepCards.push(stepCardResizeOption1);
    }
    const imageResizedImage = convertImageDataToImage(imageResizedImageData);

    // threshold
    {
      const imageThreshold01OneDimArray = imageThresholdVariation01(imageResizedImageData, 155);
      const imageThreshold01ImageData = new ImageData(imageThreshold01OneDimArray, imageResizedImageData.width, imageResizedImageData.height);
      const imageThreshold01Blob = await convertImageDataToBlob(imageThreshold01ImageData);
      if (imageThreshold01Blob) {
        const imageThreshold01ObjectUrlChecked = convertBlobToSafeUrl(imageThreshold01Blob, this.sanitizer);

        const stepCardThresholdOption1 = {
          title: 'Threshold image - option 1',
          imageId: 'imageThresholdOption1',
          imageAlt: "Preview of image 1",
          imageSrc: imageThreshold01ObjectUrlChecked.srcUrl,
          progressMode: 'determinate' as ProgressBarMode,
          progressValue: 0,
          imageLoadFunc: (event: Event) => {
            console.log(event);
            URL.revokeObjectURL(imageThreshold01ObjectUrlChecked.objectUrl);
          },
          imageErrorFunc: (event: Event) => {
            console.error(event);
            URL.revokeObjectURL(imageThreshold01ObjectUrlChecked.objectUrl);
          },
        };
        this.stepCards.push(stepCardThresholdOption1);
      }

      const imageThreshold02TwoDimArray = imageThresholdVariation02(imageResizedImage);
      const imageThreshold02ImageData = convertTwoDimArrayToImageData(imageThreshold02TwoDimArray);
      const imageThreshold02Blob = await convertImageDataToBlob(imageThreshold02ImageData);

      const imageThreshold03TwoDimArray = imageThresholdVariation03(imageResizedImage);
      const imageThreshold03ImageData = convertTwoDimArrayToImageData(imageThreshold03TwoDimArray);
      const imageThreshold03Blob = await convertImageDataToBlob(imageThreshold03ImageData);
    }

  }
}
