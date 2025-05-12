import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material Components
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider'; // Added
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Added

// Component
import { AddTransactionModalComponent } from './add-transaction-modal/add-transaction-modal.component';
import { LoaderComponent } from './loader/loader.component';

// Grouped Angular Material modules for cleaner imports
const materialModules = [
  MatDialogModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule,
  MatIconModule,
  MatDividerModule,          // Added
  MatProgressSpinnerModule   // Added
];

@NgModule({
  declarations: [
    AddTransactionModalComponent,
    LoaderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ...materialModules
  ],
  exports: [
    AddTransactionModalComponent,
    LoaderComponent,
    CommonModule
  ]
})
export class SharedModule { }