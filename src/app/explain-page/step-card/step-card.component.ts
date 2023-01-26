import {Component, Input, Output} from '@angular/core';
import {ProgressBarMode} from "@angular/material/progress-bar";
import {SafeUrl} from "@angular/platform-browser";
import { StepCard } from 'src/app/processing/conversions-01';

@Component({
  selector: 'app-step-card',
  templateUrl: './step-card.component.html',
  styleUrls: ['./step-card.component.scss']
})
export class StepCardComponent implements StepCard {
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
    console.info("imageLoadFunc");
    console.info(event);
  };
  @Input()
  imageErrorFunc: (event: Event) => void = (event: Event) => {
    console.error("imageErrorFunc");
    console.error(event);
  };

  async imageOnLoad(event: Event) {
    this.imageLoadFunc(event);
  }

  async imageOnError(event: Event) {
    this.imageErrorFunc(event);
  }
}
