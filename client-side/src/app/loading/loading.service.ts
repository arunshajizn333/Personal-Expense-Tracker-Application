// src/app/core/services/loading.service.ts (or a similar shared location)
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private requestCount = 0;
  private isLoading = new BehaviorSubject<boolean>(false);
  public readonly isLoading$ = this.isLoading.asObservable();

  constructor() { }

  show(): void {
    this.requestCount++;
    if (this.requestCount === 1) { // Only emit true if it's the first request
      this.isLoading.next(true);
    }
  }

  hide(): void {
    if (this.requestCount > 0) { // Ensure count doesn't go negative
      this.requestCount--;
    }
    if (this.requestCount === 0) { // Only emit false if all requests are done
      this.isLoading.next(false);
    }
  }
}