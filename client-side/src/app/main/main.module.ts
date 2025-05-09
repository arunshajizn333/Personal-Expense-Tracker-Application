// src/app/main/main.module.ts
import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common'; // Added TitleCasePipe
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home/dashboard-home.component';
import { DashboardSummaryComponent } from './dashboard-home/dashboard-summary/dashboard-summary.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { ViewTransactionsComponent } from './view-transactions/view-transactions.component';
import { MonthlyCatagoryChartComponent } from './dashboard-home/monthly-catagory-chart/monthly-catagory-chart.component';
import { RecentOrdersComponent } from './dashboard-home/recent-orders/recent-orders.component';
import { CsvDropzoneComponent } from './view-transactions/csv-dropzone/csv-dropzone.component';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Keep for other uses or if you want to use it here
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table'; // <-- Import MatTableModule

import { provideCharts, withDefaultRegisterables, BaseChartDirective } from 'ng2-charts';
import { SharedModule } from '../shared/shared.module'; // If you have one
// import { TransactionService } from '../services/transaction.service'; // Service is providedIn: 'root'

import { ReactiveFormsModule } from '@angular/forms'; // Add this
import { MatSnackBarModule } from '@angular/material/snack-bar'; // Add this
import { MatCardModule } from '@angular/material/card'; // For the new design
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [
    MainComponent,
    SidebarComponent,
    DashboardHomeComponent,
    DashboardSummaryComponent,
    ViewProfileComponent,
    ViewTransactionsComponent,
    MonthlyCatagoryChartComponent,
    RecentOrdersComponent, // Ensure it's declared
    CsvDropzoneComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MainRoutingModule,
    SharedModule, // If used
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule, // Now used in recent-orders.component
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    MatTableModule,         // <-- Add MatTableModule here
    BaseChartDirective,
    ReactiveFormsModule, // Add this
    MatSnackBarModule,   // Add this
    MatCardModule,       // Add this
    MatDividerModule,    // Add this
  ],
  providers: [
    provideCharts(withDefaultRegisterables()),
    CurrencyPipe, // If you use it directly in templates, it's good to have it here
    TitleCasePipe // For {{ transaction.type | titlecase }}
    // TransactionService is already providedIn: 'root'
  ],
})
export class MainModule {}