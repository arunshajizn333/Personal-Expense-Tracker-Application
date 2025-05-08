import { Component, OnInit, inject } from '@angular/core'; // Import inject
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

export function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  // If controls haven't been initialized yet, or one is missing, don't validate
  if (!password || !confirmPassword) {
    return null;
  }

  // If passwords don't match, set an error on the confirmPassword control
  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ matching: true });
    return { passwordsMismatch: true }; // Error on the form group
  } else {
    // If they do match, and confirmPassword had the 'matching' error, remove it
    if (confirmPassword.hasError('matching')) {
        confirmPassword.setErrors(null);
    }
    return null; // No error
  }
}

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent  implements OnInit {
  signupForm!: FormGroup;
  submitted = false;

  // For Google Sign-In, you would inject a service like SocialAuthService
  // For example: private authService = inject(SocialAuthService); (after setup)
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      agreeTerms: [false, Validators.requiredTrue] // Checkbox must be true
    }, { validators: passwordsMatchValidator }); // Add custom validator to the form group
  }

  // Convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // Re-validate confirmPassword in case password changed after initial validation
    this.signupForm.get('confirmPassword')?.updateValueAndValidity();

    if (this.signupForm.invalid) {
      console.log('Form is invalid:', this.signupForm.errors);
      // Manually check the agreeTerms checkbox as Validators.requiredTrue might not always set the control to dirty
      if (this.f['agreeTerms'].errors) {
        console.log("Terms not agreed.");
      }
      return;
    }

    // Process signup here
    console.log('Sign up successful!', this.signupForm.value);
    alert('SUCCESS!!\n\n' + JSON.stringify(this.signupForm.value, null, 4));
    // Example: this.authService.signUp(this.signupForm.value).subscribe(...)
    // Navigate to login or dashboard on success
    // this.router.navigate(['/login']);
  }

  signUpWithGoogle(): void {
    console.log('Sign up with Google initiated');
    // Here you would call your Google Sign-In service method
    // e.g., this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(userData => { ... });
    // This requires a library like @abacritt/angularx-social-login (the successor to angularx-social-login)
    // or implementing Google Identity Services directly.
    alert('Google Sign-Up: Integration pending. See console for details.');
  }

  

 
}