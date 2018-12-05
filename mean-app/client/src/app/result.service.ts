import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  constructor(private http: HttpClient) { }

  public getZillowData(user: string) {
    return this.http.get(`/api/zillow/${user}`);
  }

  public getChartsData(user: string) {
    return this.http.get(`/api/charts/${user}`);
  }
}
