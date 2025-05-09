import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // CurrencyPipe is already part of CommonModule
import { FormsModule } from '@angular/forms'; // For ngModel
import { HttpClientModule } from '@angular/common/http'; // For TransactionService

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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
// MatDatepickerModule and MatNativeDateModule would be needed if you use matDatepicker
// For now, the native HTML5 date input is used, which doesn't require these.

import { provideCharts, withDefaultRegisterables, BaseChartDirective } from 'ng2-charts';
import { SharedModule } from '../shared/shared.module'; // Assuming AddTransactionModalComponent is here

@NgModule({
  declarations: [
    MainComponent,
    SidebarComponent,
    DashboardHomeComponent,
    DashboardSummaryComponent,
    ViewProfileComponent,
    ViewTransactionsComponent,
    MonthlyCatagoryChartComponent,
    RecentOrdersComponent,
    CsvDropzoneComponent,
    // AddTransactionModalComponent should be declared in SharedModule or its own module if used there
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule, // Add HttpClientModule here if TransactionService is primarily used within MainModule
                     // or ensure it's imported in AppModule or a CoreModule.
    MainRoutingModule,
    SharedModule, // This should export any components/modules needed, like AddTransactionModalComponent

    // Angular Material Modules
    MatButtonModule,
    MatIconModule, // Already present, but good to keep in this block
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,

    // ng2-charts
    BaseChartDirective,
    // CurrencyPipe is part of CommonModule, no need to import separately if CommonModule is imported.
  ],
  providers: [
    provideCharts(withDefaultRegisterables()),
    // CurrencyPipe can be provided here if not relying on CommonModule's export, but it's usually not necessary.
  ],
})
export class MainModule {}