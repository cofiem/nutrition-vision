import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from '@angular/cdk/layout';
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavComponent} from './nav/nav.component';
import {HomePageComponent} from './home-page/home-page.component';
import {HelpPageComponent} from './help-page/help-page.component';
import {AboutPageComponent} from './about-page/about-page.component';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';

import * as Honeybadger from '@honeybadger-io/js';

// Configure honeybadger.js
Honeybadger.configure({
  apiKey: 'hbp_7I0Q2XuCe37HOuOY76bMsgQ6XJuQYv0uLHT6',
  environment: 'development',
  revision: 'v0.1.0',
  projectRoot: 'https://nutrition.cofiem.id.au',
})

// Define error handler component
class HoneybadgerErrorHandler implements ErrorHandler {
  handleError(error: any) {
    Honeybadger.notify(error.originalError || error);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomePageComponent,
    HelpPageComponent,
    AboutPageComponent,
    NotFoundPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatCardModule,
    MatListModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [{provide: ErrorHandler, useClass: HoneybadgerErrorHandler}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
