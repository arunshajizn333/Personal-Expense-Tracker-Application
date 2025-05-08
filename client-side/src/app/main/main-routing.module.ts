import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { authGuard } from '../core/auth.guard';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home/dashboard-home.component';
import { ViewTransactionsComponent } from './view-transactions/view-transactions.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'transactions', component: ViewTransactionsComponent },
      { path: 'profile', component: ViewProfileComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
