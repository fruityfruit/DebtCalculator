import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

export interface ZillowSet {
  oppName: String;
  city: String;
  zillowData: String;
}
export interface SavingsSet {
  oppName: String;
  city: String;
  income: String;
  savings1: String;
  savings2: String;
}

@Injectable({
  providedIn: "root"
})
export class ResultService {
  constructor(private http: HttpClient) { }

  /*
    This function makes an API call to the app's backend to get Zillow data for an opportunity.
  */
  public getZillowData(id: String) {
    return this.http.get(`/api/zillow/${id}`);
  }

  /*
    This function makes an API call to the app's backend to get chart data for a user.
  */
  public getChartsData(username: String) {
    return this.http.get(`/api/charts/${username}`);
  }

  /*
    This function makes an API call to the app's backend to get cost-of-living data for a user.
  */
  public getBLSData(regions: String[]) {
    return this.http.post(`/api/bls`, regions);
  }
}
