import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ResultSet {
  oppName: string;
  city: string;
  zillowData: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  constructor(private http: HttpClient) { }

  public getZillowData(id: string) {
    return this.http.get(`/api/zillow/${id}`);
  }

  public getChartsData(user: string) {
    return this.http.get(`/api/charts/${user}`);
  }

  public getBLSData(codes) {
    return this.http.post(`/api/bls`, codes);
  }
}
