import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundPageComponent} from "./not-found-page/not-found-page.component";
import {HomePageComponent} from "./home-page/home-page.component";
import {AboutPageComponent} from "./about-page/about-page.component";
import {HelpPageComponent} from "./help-page/help-page.component";
import {ExplainPageComponent} from "./explain-page/explain-page.component";

const routes: Routes = [
  {path: 'home', component: HomePageComponent},
  {path: 'explain', component: ExplainPageComponent},
  {path: 'about', component: AboutPageComponent},
  {path: 'help', component: HelpPageComponent},
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {path: '**', component: NotFoundPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
