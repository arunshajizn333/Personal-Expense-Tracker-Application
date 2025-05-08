import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-login',
  standalone: false, // Mark as standalone
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; // Use definite assignment assertion
  submitted = false;

  constructor(private formBuilder: FormBuilder) {}

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

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    // Process login here
    console.log('Login successful!', this.loginForm.value);
    alert('SUCCESS!!\n\n' + JSON.stringify(this.loginForm.value, null, 4));
    // Here you would typically call an authentication service
    // For example: this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(...)
  }
}