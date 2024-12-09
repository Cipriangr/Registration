import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestType, userData } from './interfaces';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(private httpClient: HttpClient) { }


  registerUser(userData: userData): Observable<RequestType> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  
    return this.httpClient.post<RequestType>(`${environment.apiBaseUrl}/register`, userData, { headers});
  }
  

}
