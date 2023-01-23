import {Component} from '@angular/core';
import {TesseractService} from "../processing/tesseract.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  text: string = '';

  fileProcessValue: number = 0;

  constructor(private tesseractService: TesseractService) {

  }

  async onFileSelected() {
    // get the selected file
    const inputNode: any = document.querySelector('#file');
    const inputFile = inputNode.files[0];

    // ensure selected file is an image
    if (!inputFile.type.match(/image.*/)) {
      return;
    }

    // show preview of selected file
    const imageOriginal: any = document.querySelector('#previewImageOriginal');
    imageOriginal.src = window.URL.createObjectURL(inputFile);

    // run OCR
    const result = await this.tesseractService.doRecognize(inputNode.files[0], undefined);
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

  webWorkerTest() {
    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker(new URL('../processing/convert.worker', import.meta.url));
      worker.onmessage = ({data}) => {
        console.log(`page got message: ${data}`);
      };
      worker.postMessage('hello');
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }
}
