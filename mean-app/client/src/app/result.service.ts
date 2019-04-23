import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

export interface ResultSet {
  oppName: String;
  city: String;
  zillowData: String;
}
export interface ResultSetOpp {
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

  public getZillowData(id: String) {
    return this.http.get(`/api/zillow/${id}`);
  }

  public getChartsData(username: String) {
    return this.http.get(`/api/charts/${username}`);
  }

  public getBLSData(regions: String[]) {
    return this.http.post(`/api/bls`, regions);
  }
}
