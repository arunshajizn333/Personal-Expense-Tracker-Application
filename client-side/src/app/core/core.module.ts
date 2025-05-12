// src/app/core/core.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// REMOVE HttpClientModule from this import line
import { HTTP_INTERCEPTORS } from '@angular/common/http'; // Only import HTTP_INTERCEPTORS

import { LoadingService } from './loading.service';
import { LoadingInterceptor } from './interceptors/loading.interceptor'; // Adjust path

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // REMOVE HttpClientModule from imports
    // HttpClientModule // <-- Remove this line
  ],
  providers: [
    LoadingService, // Provide the loading service
    { // Provide the interceptor using the HTTP_INTERCEPTORS token
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true // Multi is true because there can be multiple interceptors
    },
    // ... other core services
  ],
  exports: [
    CommonModule // Export CommonModule if needed by modules importing CoreModule
    // REMOVE HttpClientModule from exports
    // HttpClientModule // <-- Remove this line
  ]
})
export class CoreModule { }