import { NgModule } from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { PersonalComponent } from './personal/personal.component';
import { OpportunityComponent } from './opportunity/opportunity.component';
import { ResultsComponent } from './results/results.component';

const appRoutes: Routes = [
  //{  path: '', component: OpportunityComponent }, //eventually make home page
  {  path: 'opportunity', component: OpportunityComponent },
  {  path: 'personal', component: PersonalComponent },
  {  path: 'results', component: ResultsComponent },
  {  path: '',   redirectTo: '/oc', pathMatch: 'full' }, //eventually make home page
];


@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
