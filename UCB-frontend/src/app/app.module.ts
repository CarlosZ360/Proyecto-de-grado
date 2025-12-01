import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CustomersComponent } from './components/customers/customers.component';
import { FormsModule } from '@angular/forms';
import { RecordComponent } from './record/record.component';
import { CollaboratorsComponent } from './components/collaborators/collaborators.component';
import { CompanyComponent } from './components/company/company.component';
import { ClientsComponent } from './components/clients/clients.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ViewReportComponent } from './components/view-report/view-report.component';
import { ViewFinalReportComponent } from './components/view-final-report/view-final-report.component';
import { ReportsFinalsComponent } from './components/reports-finals/reports-finals.component';
import { AuditClientComponent } from './components/audit-client/audit-client.component';
import { ReportsClientComponent } from './components/reports-client/reports-client.component';
import { ReportsFinalsClientComponent } from './components/reports-finals-client/reports-finals-client.component';
import { ViewFinalReportClientComponent } from './components/view-final-report-client/view-final-report-client.component';
import { ViewReportClientComponent } from './components/view-report-client/view-report-client.component';
import { HashComponent } from './components/hash/hash.component';
import { DashBoardComponent } from './components/dash-board/dash-board.component';
import { DashBoardConfigComponent } from './components/dash-board-config/dash-board-config.component';
import { StatsComponent } from './components/stats/stats.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    CustomersComponent,
    RecordComponent,
    CollaboratorsComponent,
    CompanyComponent,
    ClientsComponent,
    MyProfileComponent,
    ReportsComponent,
    ViewReportComponent,
    ViewFinalReportComponent,
    ReportsFinalsComponent,
    AuditClientComponent,
    ReportsClientComponent,
    ReportsFinalsClientComponent,
    ViewFinalReportClientComponent,
    ViewReportClientComponent,
    HashComponent,
    DashBoardComponent,
    DashBoardConfigComponent,
    StatsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
