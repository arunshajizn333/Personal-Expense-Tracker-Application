// src/app/core/loading.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' // Provided in root, accessible application-wide
})
export class LoadingService {
  private activeRequests = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Expose loading state as an observable
  // debounceTime prevents quick flickers
  // distinctUntilChanged ensures we only emit when the state actually changes
  isLoading$ = this.loadingSubject.asObservable().pipe(
    debounceTime(100), // Adjust time as needed
    distinctUntilChanged()
  );

  constructor() { }

  /**
   * Call this when an HTTP request starts.
   */
  startLoading() {
    this.activeRequests++;
    this.updateLoadingState();
  }

  /**
   * Call this when an HTTP request finishes (success or error).
   */
  stopLoading() {
    // Ensure we don't go below zero
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    this.updateLoadingState();
  }

  private updateLoadingState() {
    this.loadingSubject.next(this.activeRequests > 0);
  }
}