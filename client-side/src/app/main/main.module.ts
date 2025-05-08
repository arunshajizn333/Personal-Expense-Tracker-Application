import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home/dashboard-home.component';
import { DashboardSummaryComponent } from './dashboard-home/dashboard-summary/dashboard-summary.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { ViewTransactionsComponent } from './view-transactions/view-transactions.component';
import { MatIconModule } from '@angular/material/icon';
import { MonthlyCatagoryChartComponent } from './dashboard-home/monthly-catagory-chart/monthly-catagory-chart.component';
import { RecentOrdersComponent } from './dashboard-home/recent-orders/recent-orders.component';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { BaseChartDirective } from 'ng2-charts'; // Ensure this is imported correctly
import { FormsModule } from '@angular/forms';
import { CsvDropzoneComponent } from './view-transactions/csv-dropzone/csv-dropzone.component'; 
import { SharedModule } from '../shared/shared.module';

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
  ],
  imports: [
    CommonModule,
    FormsModule,
    MainRoutingModule,
    MatIconModule,
    BaseChartDirective,
    SharedModule 
  ],
  providers: [provideCharts(withDefaultRegisterables())],  // Ensure this is configured correctly
})
export class MainModule {}
