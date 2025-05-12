// src/app/core/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse // Import HttpErrorResponse
} from '@angular/common/http';
// Import Observable and throwError from 'rxjs'
import { Observable, throwError } from 'rxjs';
// Import catchError operator from 'rxjs/operators'
import { catchError } from 'rxjs/operators';
// Import your AuthService (adjust the path if necessary)
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
// Import Router if your AuthService doesn't handle navigation internally
// import { Router } from '@angular/router';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  // Inject AuthService
  constructor(
    private authService: AuthService,
    private sessionService: SessionService
    // Inject Router if AuthService.logout() doesn't navigate
    // private router: Router
    ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.sessionService.currentTokenValue;

    // Clone the request and add the token if it exists
    // It's better to clone unconditionally here if you always want the interceptor to run
    let clonedRequest = request;
    if (token) {
      clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Pass the cloned request to the next handler and pipe the response
    return next.handle(clonedRequest).pipe(
      // Use catchError to intercept errors in the response stream
      catchError((error: HttpErrorResponse) => {
        // Check if the error is an HTTP error response and has status 401 or 403
        if (error.status === 401 || error.status === 403) {
          // Token is invalid, expired, or user is forbidden

          console.error('Authentication Error: Status', error.status, error.message); // Log the error

          // Call the centralized logout method in your AuthService
          // This method should clear localStorage and navigate to the login page
          this.sessionService.logout();

          // Re-throw the error
          // This allows other parts of your application (e.g., specific component error handlers)
          // to still react to the error if needed, although the user is being redirected.
          return throwError(() => error);
        }

        // If the error is not 401 or 403, re-throw it so it can be handled elsewhere
        return throwError(() => error);
      })
    );
  }
}
