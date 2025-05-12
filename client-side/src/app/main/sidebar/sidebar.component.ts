// src/app/sidebar/sidebar.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'] // Use styleUrls
})
export class SidebarComponent {

  constructor(private router: Router) { } // Inject Router

  logout() {
    
    // Navigate to the login page
    this.router.navigate(['/auth/login']); // Navigate to your login route
  
    
    // Remove user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // You might also want to clear any in-memory state if you have it

    }
}