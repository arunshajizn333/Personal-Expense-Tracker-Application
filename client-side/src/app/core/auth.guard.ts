import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(private router: Router) {}

canActivate(): boolean {
  if (typeof window !== 'undefined' && localStorage) {
    const token = localStorage.getItem('token');
    if (token) return true;
  }

  this.router.navigate(['/login']);
  return false;
}

}
