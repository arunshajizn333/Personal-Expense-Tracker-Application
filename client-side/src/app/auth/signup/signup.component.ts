import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  submitted = false;
  emailExistsError : string ='';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$') // Must include letters and numbers
      ]]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.signupForm.invalid) {
      // Mark all fields as touched to show errors if not already shown
      Object.keys(this.signupForm.controls).forEach(field => {
        const control = this.signupForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    const user: User = {
      userName: this.signupForm.value.username,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password
      // Add id or other properties if your User model requires them for signup
      // e.g., id: undefined (if backend generates it)
    };

    this.authService.signup(user).subscribe({
      next: (res) => {
        console.log('Signup success:', res);
        // Optionally display a success message to the user
        alert('Signup successful! Please login.'); // Or use a more sophisticated notification
        this.router.navigate(['/auth/login']); // Navigate to login
      },
      error: (err) => {
        if (err.status === 400) {
          this.emailExistsError = 'Email already exists';
        } else {
          this.emailExistsError = 'Something went wrong';
        }
      }
    });
  }

  signUpWithGoogle(): void {
    console.log('Sign up with Google initiated');
    // Implement your Google Sign-Up logic here, likely involving the AuthService
    // For example: this.authService.signUpWithGoogle().subscribe(...);
    alert('Google Sign-Up: Integration pending. See console for details.');
  }
}