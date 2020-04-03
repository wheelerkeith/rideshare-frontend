import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  url: string = environment.filterUri;

  constructor(private http: HttpClient) { }

  getFilteredDrivers(filters: Array<string>, userId: number, batchId: number) {
    return this.http.post(this.url, {
      "filterTypes": filters,
      "userId": userId,
      "batchId": batchId
    });
  }
}
