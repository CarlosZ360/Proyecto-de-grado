import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CustomersComponent } from './components/customers/customers.component';
import { RecordComponent } from './record/record.component';
import { CollaboratorsComponent } from './components/collaborators/collaborators.component';
import { CompanyComponent } from './components/company/company.component';
import { ClientsComponent } from './components/clients/clients.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ViewReportComponent } from './components/view-report/view-report.component';
import { ViewFinalReportComponent } from './components/view-final-report/view-final-report.component';
import { ReportsFinalsComponent } from './components/reports-finals/reports-finals.component';
import { DashBoardComponent } from './components/dash-board/dash-board.component';
import { DashBoardConfigComponent } from './components/dash-board-config/dash-board-config.component';
import { StatsComponent } from './components/stats/stats.component';

//Cliente
import { AuditClientComponent } from './components/audit-client/audit-client.component';
import { ReportsClientComponent } from './components/reports-client/reports-client.component';
import { ReportsFinalsClientComponent } from './components/reports-finals-client/reports-finals-client.component';
import { ViewReportClientComponent } from './components/view-report-client/view-report-client.component';
import { ViewFinalReportClientComponent } from './components/view-final-report-client/view-final-report-client.component';
import { HashComponent } from './components/hash/hash.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'customers/:customer', component: RecordComponent },
  { path: 'collaborators', component: CollaboratorsComponent },
  { path: 'company', component: CompanyComponent },
  { path: 'clients', component: ClientsComponent },
  { path: 'my-profile', component: MyProfileComponent },
  { path: 'customers/:customer/:audit', component: ReportsComponent },
  { path: 'customers/:customer/:audit/:report', component: ViewReportComponent },
  { path: 'customers/:customer/:audit/:report/final/:final', component: ViewFinalReportComponent },
  { path: 'customers/:customer/:audit/:report/final', component: ReportsFinalsComponent },
  { path: 'hash', component: HashComponent },
  { path: 'dashboard', component: DashBoardComponent },
  { path: 'dashboard-config', component: DashBoardConfigComponent },
  { path: 'stats/:company', component: StatsComponent },

  //Cliente
  { path: 'audit', component: AuditClientComponent },
  { path: 'reports', component: ReportsClientComponent },
  { path: 'reports-finals', component: ReportsFinalsClientComponent },
  { path: 'reports/view', component: ViewReportClientComponent },
  { path: 'reports-finals/view', component: ViewFinalReportClientComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
