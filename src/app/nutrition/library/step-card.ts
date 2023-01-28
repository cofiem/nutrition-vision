import {SafeUrl} from "@angular/platform-browser";
import {ProgressBarMode} from "@angular/material/progress-bar";

export default interface StepCard {
  title: string
  imageId: string
  imageAlt: string
  imageSrc: SafeUrl
  progressMode: ProgressBarMode
  progressValue: number,
  imageLoadFunc: (event: Event) => void,
  imageErrorFunc: (event: Event) => void,

}
