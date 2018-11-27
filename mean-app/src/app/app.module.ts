import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
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

// Define the routes
const ROUTES = [
  // {
  //   path: '',
  //   redirectTo: 'opportunity',
  //   pathMatch: 'full'
  // },
  // {
  //   path: 'posts',
  //   component: PostsComponent
  // },
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
  },
  {
    path: '**',
    redirectTo: 'opportunity',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    // PostsComponent,
    OpportunityComponent,
    PersonalComponent,
    NavbarComponent,
    ResultsComponent,
    InfoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES) // Add routes to the app
  ],
  // providers: [PostsService], // Add the posts service
  bootstrap: [AppComponent]
})
export class AppModule { }
