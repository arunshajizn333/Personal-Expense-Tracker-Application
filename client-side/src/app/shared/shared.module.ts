import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTransactionModalComponent } from './add-transaction-modal/add-transaction-modal.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // Required for native date adapter
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule

import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AddTransactionModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule // Add this
  ],
  exports: [
    AddTransactionModalComponent
  ]
})
export class SharedModule { }
