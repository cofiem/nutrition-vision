import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatProgressBarModule} from "@angular/material/progress-bar";

import {NutritionRoutingModule} from './nutrition-routing.module';
import {NutritionComponent} from './nutrition.component';
import {AnalysePageComponent} from './analyse-page/analyse-page.component';
import {ExplainPageComponent} from './explain-page/explain-page.component';
import {StepCardComponent} from './explain-page/step-card/step-card.component';
import {MatDividerModule} from "@angular/material/divider";
import {ProcessingService} from "./library/processing.service";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    NutritionComponent,
    AnalysePageComponent,
    ExplainPageComponent,
    StepCardComponent
  ],
  imports: [
    CommonModule,
    NutritionRoutingModule,
    MatCardModule,
    MatProgressBarModule,
    MatDividerModule,
    MatButtonModule
  ],
  providers: [ProcessingService]
})
export class NutritionModule {
}
