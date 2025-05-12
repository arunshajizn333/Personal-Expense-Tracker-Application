// src/app/shared/loader/loader.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for *ngIf
import { LoadingService } from '../../core/loading.service'; // Adjust path

@Component({
  selector: 'app-loader',
  standalone: false, // Assuming you'll import this module
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent {
  // Inject the loading service and expose its observable directly to the template
  constructor(public loadingService: LoadingService) {}
}