import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

export interface Opportunity {
  username: String;
  type: String;
  name: String;
  state: String;
  city: String;
  region: String;
  income: number;
  bonus: number;
  move: String;
}

export interface ShortOpportunity {
  _id: String;
  name: String;
}

@Injectable({
  providedIn: "root"
})

export class OpportunityService {
  constructor(private http: HttpClient) { }

  /*
    This function makes an API call to the app's backend to create a new opportunity for a user.
  */
  public createOpportunity(form: Opportunity) {
    const obj = {
      username: form.username,
      type: form.type,
      name: form.name,
      city: form.city,
      state: form.state,
      region: form.region,
      income: form.income,
      bonus: form.bonus,
      move: form.move
    };
    return this.http.post(`/api/opportunity`, obj);
  }

  /*
    This function makes an API call to the app's backend to get all opportunities that a user has.
  */
  public getOpportunities(username: String) {
    return this.http.get(`/api/opportunity/${username}`);
  }

  /*
    This function makes an API call to the app's backend to get an abbreviated version of all opportunities that a user has.
  */
  public getShortOpportunities(username: String) {
    return this.http.get(`/api/opportunity/short/${username}`);
  }

  /*
    This function makes an API call to the app's backend to one specific opportunity that a user has.
  */
  public editOpportunity(id: String) {
    return this.http.get(`/api/opportunity/edit/${id}`);
  }

  /*
    This function makes an API call to the app's backend to update the value of an existing opportunity that a user has.
  */
  public updateOpportunity(form: Opportunity, id: String) {
    const obj = {
      type: form.type,
      name: form.name,
      city: form.city,
      state: form.state,
      region: form.region,
      income: form.income,
      bonus: form.bonus,
      move: form.move
    };
    return this.http.post(`/api/opportunity/edit/${id}`, obj);
  }

  /*
    This function makes an API call to the app's backend to delete one opportunity that a user has.
  */
  public deleteOpportunity(username: String, id: String) {
    return this.http.get(`/api/opportunity/delete/${username}/${id}`);
  }

}
