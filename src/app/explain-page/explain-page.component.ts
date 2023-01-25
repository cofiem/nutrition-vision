import { Component } from '@angular/core';
import {ProcessingService} from "../processing/processing.service";

@Component({
  selector: 'app-explain-page',
  templateUrl: './explain-page.component.html',
  styleUrls: ['./explain-page.component.scss']
})
export class ExplainPageComponent {


  constructor(private processingService: ProcessingService) {
  }

  async onFileSelected() {

  }
}
