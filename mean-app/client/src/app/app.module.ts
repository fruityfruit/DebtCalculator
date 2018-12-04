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
import { AuthenticationService } from './authentication.service';
import { OpportunityformService } from './opportunityform.service';
import { ResultService } from './result.service';
import { OppeditComponent } from './oppedit/oppedit.component';

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
    path: 'personal',
    component: PersonalComponent
  },
  {
    path: 'results',
    component: ResultsComponent
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
    OppeditComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    RouterModule.forRoot(ROUTES) // Add routes to the app
  ],
  providers: [AuthenticationService,// Add the Authentication service
              ResultService, // Add the Result service
              OpportunityformService], // Add the Opportunityform service
  bootstrap: [AppComponent]
})
export class AppModule { }
