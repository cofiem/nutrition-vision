import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NutritionComponent} from './nutrition.component';
import {ExplainPageComponent} from "./explain-page/explain-page.component";
import {AnalysePageComponent} from "./analyse-page/analyse-page.component";

const routes: Routes = [
  {path: '', component: NutritionComponent},
  {path: 'explain', component: ExplainPageComponent},
  {path: 'analyse', component: AnalysePageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NutritionRoutingModule {
}
