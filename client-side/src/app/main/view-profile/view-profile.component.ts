// src/app/main/view-profile/view-profile.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // For reactive forms
import { UserService, User } from '../../services/user.service'; // Adjust path as needed
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar'; // For notifications
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-profile',
  standalone:false,
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css'] // Use styleUrls (plural)
})
export class ViewProfileComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  profileForm: FormGroup;
  isEditingName: boolean = false;
  isEditingEmail: boolean = false;
  showPasswordInput: boolean = false;
  newPassword: string = ''; // For dummy password change
  isLoading: boolean = false;

  private userSubscription: Subscription | undefined;

  // Store original values for cancellation
  private originalUserName: string = '';
  private originalEmail: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.userSubscription = this.userService.currentUser.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.originalUserName = user.userName;
        this.originalEmail = user.email;
        this.profileForm.patchValue({
          userName: user.userName,
          email: user.email
        });
        // Initially, email is not editable by default as per original design.
        // We can make it always editable or follow the pencil icon pattern.
        // For now, let's make form controls read-only until edit is clicked.
        this.profileForm.get('email')?.disable();
        this.profileForm.get('userName')?.disable();

      } else {
        // Handle case where user data is not available (e.g., redirect to login)
        this.userService.logout(); // Or redirect to login
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  startEditing(field: 'userName' | 'email'): void {
    if (field === 'userName') {
      this.isEditingName = true;
      this.profileForm.get('userName')?.enable();
    } else if (field === 'email') {
      this.isEditingEmail = true;
      this.profileForm.get('email')?.enable();
    }
  }

  cancelEditing(field: 'userName' | 'email'): void {
    if (field === 'userName') {
      this.isEditingName = false;
      this.profileForm.get('userName')?.setValue(this.originalUserName);
      this.profileForm.get('userName')?.disable();
    } else if (field === 'email') {
      this.isEditingEmail = false;
      this.profileForm.get('email')?.setValue(this.originalEmail);
      this.profileForm.get('email')?.disable();
    }
  }

  saveProfile(): void {
    if (!this.currentUser) return;

    const updatedFields: { userName?: string; email?: string } = {};
    const currentFormValues = this.profileForm.value;

    let changesMade = false;

    if (this.isEditingName && currentFormValues.userName !== this.originalUserName) {
      updatedFields.userName = currentFormValues.userName;
      changesMade = true;
    }
    if (this.isEditingEmail && currentFormValues.email !== this.originalEmail) {
      updatedFields.email = currentFormValues.email;
      changesMade = true;
    }

    if (!changesMade) {
      this.snackBar.open('No changes to save.', 'Close', { duration: 3000 });
      this.isEditingName = false;
      this.isEditingEmail = false;
      this.profileForm.get('userName')?.disable();
      this.profileForm.get('email')?.disable();
      return;
    }

    if (Object.keys(updatedFields).length === 0) {
        this.snackBar.open('No changes detected or fields are invalid.', 'Close', { duration: 3000 });
        return;
    }
    
    // Ensure form validity for the fields being edited
    if ((this.isEditingName && this.profileForm.get('userName')?.invalid) ||
        (this.isEditingEmail && this.profileForm.get('email')?.invalid)) {
        this.snackBar.open('Please correct the invalid fields.', 'Close', { duration: 3000 });
        return;
    }


    this.isLoading = true;
    this.userService.updateUserProfile(updatedFields).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.currentUser = response.user; // Update current user with response
        this.originalUserName = response.user.userName; // Update original values
        this.originalEmail = response.user.email;

        this.profileForm.patchValue({ // Update form with potentially normalized values from backend
             userName: response.user.userName,
             email: response.user.email
        });

        this.snackBar.open(response.message || 'Profile updated successfully!', 'Close', { duration: 3000 });
        this.isEditingName = false;
        this.isEditingEmail = false;
        this.profileForm.get('userName')?.disable();
        this.profileForm.get('email')?.disable();
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(error.message || 'Failed to update profile. Please try again.', 'Close', { duration: 5000 });
        // Optionally revert changes on error
        this.profileForm.get('userName')?.setValue(this.originalUserName);
        this.profileForm.get('email')?.setValue(this.originalEmail);
      }
    });
  }

  // --- Dummy Password and Avatar Methods ---
  togglePasswordInput(): void {
    this.showPasswordInput = !this.showPasswordInput;
    if (!this.showPasswordInput) {
      this.newPassword = ''; // Clear password if canceling
    }
  }

  changePassword(): void {
    if (this.newPassword) {
      // In a real app, you'd call a service method here
      this.snackBar.open('Password change functionality is not connected to backend.', 'INFO', { duration: 4000 });
      // alert('Password changed successfully! (This is a dummy message)');
      this.showPasswordInput = false;
      this.newPassword = '';
    } else {
       this.snackBar.open('New password cannot be empty.', 'WARN', { duration: 3000 });
    }
  }

  editAvatar(): void {
    // In a real app, you'd open a file dialog or modal here
    this.snackBar.open('Avatar editing functionality is not implemented yet.', 'INFO', { duration: 4000 });
    // alert('Avatar editing functionality is not implemented yet.');
  }

  logout(): void {
    // Navigate to the login page
    this.router.navigate(['/auth/login']); // Navigate to your login route
  
    
    // Remove user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // You might also want to clear any in-memory state if you have it
    this.snackBar.open('You have been logged out.', 'Close', { duration: 3000 });
  }
}