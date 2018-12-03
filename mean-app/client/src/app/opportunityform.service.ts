import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
//opportunityform.service is responsible for connecting frontend with the backend
export interface TokenPayload { //Used in opportunity.component.ts and oppedit.component.ts
  form_type: string;
  form_oppName: string;
  form_cityName: string;
  form_oppCost: string;
  form_oppDebt: string;
  form_move: string;
  form_user: string;
}

@Injectable({
  providedIn: 'root'
})
export class OpportunityformService {
  constructor(private http: HttpClient) { } //Uses httpclient to make post/get requests
//Look in the routes.js file to see the corresponding urls where requests are made
  addOpportunity(form: TokenPayload) //parameter is the form when called in other files
  {
    console.log("in addOpportunity in opform service");
    const obj = { //convert to an object
      type: form.form_type,
      oppName: form.form_oppName,
      cityName: form.form_cityName,
      oppCost: form.form_oppCost,
      oppDebt: form.form_oppDebt,
      move: form.form_move,
      user: form.form_user
    };
    this.http.post(`/api/opportunity`, obj).subscribe(res => console.log('Done'));
  }

  getOpportunities(user) {
      var retval = this.http.get(`/api/opportunity/${user}`);
      console.log("retval");
      console.log(retval);
      return retval;
    }

  editOpportunity(id) {
      return this.http.get(`/api/edit/${id}`);
  }

  updateOpportunity(form: TokenPayload, id) { //Take in the data to update
// and the id of the opportunity to update
    const obj = {
      type: form.form_type,
      oppName: form.form_oppName,
      cityName: form.form_cityName,
      oppCost: form.form_oppCost,
      oppDebt: form.form_oppDebt,
      move: form.form_move
      //user: form.form_user
      };
      console.log(obj);
      this.http.post(`/api/edit/${id}`, obj)
      .subscribe(res => console.log('Done'));
  }

  deleteOpportunity(user, id) {
      return this.http.get(`/api/opportunity/delete/${user}/${id}`);
  }

}
