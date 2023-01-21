import {Component} from '@angular/core';
import {TesseractService} from "../tesseract.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  srcResult: any;
  fileProcessValue: number = 0;

  constructor(private tesseractService: TesseractService) {

  }

  async onFileSelected() {
    const inputNode: any = document.querySelector('#file');
    const result = await this.tesseractService.doRecognize(inputNode.files[0], undefined);
    this.srcResult = result;
  }
}
