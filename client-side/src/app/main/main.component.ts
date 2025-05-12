import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  standalone: false,
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  sideMenuVisible: boolean = true;

  toggleSideMenu() {
    this.sideMenuVisible = !this.sideMenuVisible;
  }
}