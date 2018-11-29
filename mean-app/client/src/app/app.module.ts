import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { AppComponent } from './app.component';
// import { PostsComponent } from './posts/posts.component';
// import { PostsService } from './posts.service';
import { OpportunityComponent } from './opportunity/opportunity.component';
import { PersonalComponent } from './personal/personal.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ResultsComponent } from './results/results.component';
import { InfoComponent } from './info/info.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { SigninComponent } from './signin/signin.component';
//import { AppRoutingModule } from './app-routing.module';

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
    path: 'personal',
    component: PersonalComponent
  },
  {
    path: 'results',
    component: ResultsComponent
  }
  // {
  //   path: '',
  //   redirectTo: '',
  //   pathMatch: 'full'
  // }
];


@NgModule({
  declarations: [
    AppComponent,
    // PostsComponent,
    OpportunityComponent,
    PersonalComponent,
    NavbarComponent,
    ResultsComponent,
    InfoComponent,
    HomeComponent,
    RegisterComponent,
    SigninComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    //AppRoutingModule,
    RouterModule.forRoot(ROUTES) // Add routes to the app
  ],
  // providers: [PostsService], // Add the posts service
  bootstrap: [AppComponent]
})
export class AppModule { }