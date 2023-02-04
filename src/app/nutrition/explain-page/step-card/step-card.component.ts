import {Component, Input, OnInit} from '@angular/core';
import {LoggerService} from "../../../logger/logger.service";
import StepCard from "../../library/step-card";
import {BasicWord} from "../../library/tesseract";

@Component({
  selector: 'app-step-card',
  templateUrl: './step-card.component.html',
  styleUrls: ['./step-card.component.scss']
})
export class StepCardComponent implements OnInit {

  private logPrefix: string = "Step Card Component";

  constructor(private logger: LoggerService) {

  }

  @Input()
  stepCard: StepCard | undefined;

  ngOnInit(): void {
  }

  async imageOnLoad(event: Event) {
    this.stepCard?.imageLoadFunc(event);
  }

  async imageOnError(event: Event) {
    this.stepCard?.imageErrorFunc(event);
  }

  displayBox(extractedWord: BasicWord) {
    const result = {
      position: 'absolute', border: '1px solid red', 'overflow-wrap':'anywhere',
      left: '0px', top: '0px', width: '0px', height: '0px'
    };
    if (!this.stepCard) {
      return result;
    }

    // NOTE: if the CSS width of the image changes, also change it here
    const imageWidth = 400;
    const sizeFactor = imageWidth / this.stepCard?.imageWidth;

    const left = extractedWord.bbox.x0 * sizeFactor;
    const top = extractedWord.bbox.y0 * sizeFactor;
    const width = Math.abs(extractedWord.bbox.x1 - extractedWord.bbox.x0) * sizeFactor;
    const height = Math.abs(extractedWord.bbox.y1 - extractedWord.bbox.y0) * sizeFactor;

    result.left = Math.round(left).toString() + 'px';
    result.top = Math.round(top).toString() + 'px';
    result.width = Math.round(width).toString() + 'px';
    result.height = Math.round(height).toString() + 'px';


    return result;
  }
}
