import 'hammerjs'; //needed for deployment
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { OpportunityComponent } from './opportunity/opportunity.component';
import { PersonalComponent } from './personal/personal.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ResultsComponent } from './results/results.component';
import { InfoComponent } from './info/info.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { SigninComponent } from './signin/signin.component';
import { OppeditComponent } from './oppedit/oppedit.component';
import { AuthenticationService } from './authentication.service';
import { OpportunityService } from './opportunity.service';
import { ResultService } from './result.service';
import { ProfileService } from './profile.service';
import { AccountComponent } from './account/account.component';
import {MatSidenavModule, MatTableModule, MatFormFieldModule, MatInputModule,
        MatSelectModule, MatIconModule, MatButtonModule,
        MatSnackBarModule, MatCardModule, MatTooltipModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { DebteditComponent } from './debtedit/debtedit.component';
import { DebtComponent } from './debt/debt.component';

// Define the routes
const ROUTES = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'signin',
    component: SigninComponent
  },
  {
    path: 'info',
    component: InfoComponent
  },
  {
    path: 'opportunity',
    component: OpportunityComponent
  },
  {
    path: 'edit/:id',
    component: OppeditComponent
  },
  {
    path: 'debt',
    component: DebtComponent
  },
  {
    path: 'debtedit/:id',
    component: DebteditComponent
  },
  {
    path: 'personal',
    component: PersonalComponent
  },
  {
    path: 'results',
    component: ResultsComponent
  },
  {
    path: 'account',
    component: AccountComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];


@NgModule({
  declarations: [
    AppComponent,
    OpportunityComponent,
    PersonalComponent,
    NavbarComponent,
    ResultsComponent,
    InfoComponent,
    HomeComponent,
    RegisterComponent,
    SigninComponent,
    OppeditComponent,
    AccountComponent,
    DebteditComponent,
    DebtComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatSidenavModule,
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
    MatTooltipModule,
    RouterModule.forRoot(ROUTES) // Add routes to the app
  ],
  providers: [AuthenticationService,// Add the Authentication service
              ResultService, // Add the Result service
              ProfileService, // Add the Profile service
              OpportunityService], // Add the Opportunity service
  bootstrap: [AppComponent]
})
export class AppModule { }
