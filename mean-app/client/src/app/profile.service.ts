import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

export interface Profile {
  username: String;
  state: String;
  region: String;
  groceries: number;
  rent: number;
  spending: number;
  savings: number;
}

export interface Debt {
  username: String;
  name: String;
  principal: number;
  rate: number;
  annualCompounds: number;
  monthlyPayment: number;
  opportunity: String;
}

@Injectable({
  providedIn: "root"
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  /*
    This function makes an API call to the app's backend to update a user's profile data.
  */
  public updateProfile(form: Profile) {
    const obj = {
      username: form.username,
      state: form.state,
      region: form.region,
      groceries: form.groceries,
      rent: form.rent,
      spending: form.spending,
      savings: form.savings
    };
    return this.http.post(`/api/profile`, obj);
  }

  /*
    This function makes an API call to the app's backend to get a user's profile data.
  */
  public getProfile(username: String) {
    return this.http.get(`/api/profile/${username}`);
  }

  /*
    This function makes an API call to the app's backend to create a new debt for a user.
  */
  public createDebt(form: Debt) {
    const obj = {
      username: form.username,
      name: form.name,
      principal: form.principal,
      rate: form.rate,
      annualCompounds: form.annualCompounds,
      monthlyPayment: form.monthlyPayment,
      opportunity: form.opportunity
    };
    return this.http.post(`/api/debt`, obj);
  }

  /*
    This function makes an API call to the app's backend to get all debts that a user has.
  */
  public getDebts(username: String) {
    return this.http.get(`/api/debt/${username}`);
  }

  /*
    This function makes an API call to the app's backend to one specific debt that a user has.
  */
  public editDebt(id: String) {
    return this.http.get(`/api/debt/edit/${id}`);
  }

  /*
    This function makes an API call to the app's backend to update the value of an existing debt that a user has.
  */
  public updateDebt(form: Debt, id: String) {
    const obj = {
      name: form.name,
      principal: form.principal,
      rate: form.rate,
      annualCompounds: form.annualCompounds,
      monthlyPayment: form.monthlyPayment,
      opportunity: form.opportunity
    };
    return this.http.post(`/api/debt/edit/${id}`, obj);
  }

  /*
    This function makes an API call to the app's backend to delete one debt that a user has.
  */
  public deleteDebt(username: String, id: String) {
    return this.http.get(`/api/debt/delete/${username}/${id}`);
  }
}
