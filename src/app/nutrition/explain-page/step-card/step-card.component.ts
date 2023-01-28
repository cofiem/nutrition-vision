import {Component, Input} from '@angular/core';
import {ProgressBarMode} from "@angular/material/progress-bar";
import {SafeUrl} from "@angular/platform-browser";
import {LoggerService} from "../../../logger/logger.service";
import StepCard from "../../library/step-card";

@Component({
  selector: 'app-step-card',
  templateUrl: './step-card.component.html',
  styleUrls: ['./step-card.component.scss']
})
export class StepCardComponent implements StepCard {

  private logPrefix: string = "Step Card Component";

  constructor(private logger: LoggerService) {
  }

  @Input()
  title: string = "Placeholder title";
  @Input()
  imageId: string = "";
  @Input()
  imageAlt: string = "";
  @Input()
  imageSrc: SafeUrl = "";
  @Input()
  progressMode: ProgressBarMode = "determinate";
  @Input()
  progressValue: number = 0;
  @Input()
  imageLoadFunc: (event: Event) => void = (event) => {
    this.logger.info(this.logPrefix, "imageLoadFunc");
    this.logger.info(this.logPrefix, event);
  };
  @Input()
  imageErrorFunc: (event: Event) => void = (event: Event) => {
    this.logger.error(this.logPrefix, "imageErrorFunc");
    this.logger.error(this.logPrefix, event);
  };

  async imageOnLoad(event: Event) {
    this.imageLoadFunc(event);
  }

  async imageOnError(event: Event) {
    this.imageErrorFunc(event);
  }
}
