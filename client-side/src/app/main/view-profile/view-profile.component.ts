import { Component } from '@angular/core';

@Component({
  selector: 'app-view-profile',
  standalone: false,
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.css'
})
export class ViewProfileComponent {
  email: string = 'user@example.com';
  userName: string = 'John Doe';
  isEditingName: boolean = false;
  showPasswordInput: boolean = false;
  newPassword: string = '';

  // Start editing username
  startEditingName() {
    this.isEditingName = true;
  }

  // Save username and stop editing
  stopEditingName() {
    this.isEditingName = false;
    // Add save logic if needed
  }

  // Trigger password change input
  togglePasswordInput() {
    this.showPasswordInput = !this.showPasswordInput;
  }

  // Save password
  changePassword() {
    if (this.newPassword) {
      alert('Password changed successfully!');
      this.showPasswordInput = false;
      this.newPassword = '';
    }
  }

  // Dummy avatar editing method
  editAvatar() {
    alert('Avatar editing functionality is not implemented yet.');
  }
}
