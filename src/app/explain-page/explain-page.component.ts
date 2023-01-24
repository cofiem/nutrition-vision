import { Component } from '@angular/core';
import {TesseractService} from "../processing/tesseract.service";

@Component({
  selector: 'app-explain-page',
  templateUrl: './explain-page.component.html',
  styleUrls: ['./explain-page.component.scss']
})
export class ExplainPageComponent {


  constructor(private tesseractService: TesseractService) {
  }

  async onFileSelected() {

  }
}
