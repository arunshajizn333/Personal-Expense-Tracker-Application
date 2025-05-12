// src/app/core/interceptors/loading.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';
import { LoadingService } from '../loading.service'; // Adjust path if needed

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Start the loader
    this.loadingService.startLoading();

    return next.handle(request).pipe(
      delay(500), 
      finalize(() => {
        // Stop the loader when the request completes (success or error)
        this.loadingService.stopLoading();
      })
    );
  }
}