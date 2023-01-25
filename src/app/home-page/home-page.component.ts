import {Component} from '@angular/core';
import {ProcessingService} from "../processing/processing.service";
import {convertUploadToFile} from "../processing/conversions-01";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  text: string = '';

  fileProcessValue: number = 0;

  constructor(private processingService: ProcessingService) {

  }

  async onFileSelected() {
    // get the selected file
    const inputNode: any = document.querySelector('#file');

    const inputFile = convertUploadToFile(inputNode);

    // show preview of selected file
    const imageOriginal: any = document.querySelector('#previewImageOriginal');
    imageOriginal.src = window.URL.createObjectURL(inputFile);

    // run OCR
    const result = await this.processingService.doRecognize(inputNode.files[0], undefined);
    if (result) {
      this.text = result.data.text;

      const imgOriginal: any = document.getElementById("imgOriginal");
      if (imgOriginal && result.data.imageColor) imgOriginal.src = result.data.imageColor;

      const imgGrey: any = document.getElementById("imgGrey")
      if (imgGrey && result.data.imageColor) imgGrey.src = result.data.imageGrey;

      const imgBinary: any = document.getElementById("imgBinary")
      if (imgBinary && result.data.imageColor) imgBinary.src = result.data.imageBinary;
    }

  }
}
