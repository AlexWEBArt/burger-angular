import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Data } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { };

  sendOrder(data: any) {
    return this.http.post('https://testologia.site/burgers-order', data);
  }
  
  getData() : Observable<Data[]> {
    return this.http.get<Data[]>('https://testologia.site/burgers-data?extra=black');
  }
}
