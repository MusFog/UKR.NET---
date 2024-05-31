import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';


import 'materialize-css/dist/js/materialize.js'
import {AppRoutingModule, routes} from "./app/app.routes";
import {importProvidersFrom} from "@angular/core";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi
} from "@angular/common/http";
import {TokenInterceptor} from "./app/shared/classes/token.interceptor";
import {provideRouter} from "@angular/router";

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      AppRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
    ),

    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],

}).catch((err) => console.error(err));

