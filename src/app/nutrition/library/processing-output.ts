import StepCard from "./step-card";

class ProcessingOutput {
  imageData: ImageData;
  blob: Blob | undefined;
  image: HTMLImageElement;
  stepCard: StepCard | undefined;

  constructor(
    imageData: ImageData, blob: Blob | undefined,
    image: HTMLImageElement, stepCard: StepCard | undefined) {
    this.imageData = imageData;
    this.blob = blob;
    this.image = image;
    this.stepCard = stepCard;
  }
}

export default ProcessingOutput;
