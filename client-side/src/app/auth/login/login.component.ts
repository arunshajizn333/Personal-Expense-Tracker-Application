import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: false, // Mark as standalone
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; // Use definite assignment assertion
  submitted = false;
  loginError: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private sessionService: SessionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
  
    if (this.loginForm.invalid) {
      return;
    }
  
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        // Save token to localStorage
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        // Call startSession after successful login
      this.sessionService.startSession(res.token, res.user);
  
        // Navigate to dashboard or other route
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login failed', err);
        if (err.status === 401 || err.status === 400) { // Common statuses for bad credentials
          this.loginError = 'Invalid email or password';
      } else {
          this.loginError = 'Login failed due to a server error. Please try again later.';
      }
      }
    }
  );
}
signUpWithGoogle(): void {
  console.log('Sign up with Google initiated');
  // Implement your Google Sign-Up logic here, likely involving the AuthService
  // For example: this.authService.signUpWithGoogle().subscribe(...);
    this.snackBar.open('Integration pending. See console for details.', 'Close', { duration: 3000 });
}


}