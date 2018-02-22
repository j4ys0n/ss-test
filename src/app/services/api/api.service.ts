import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Response } from '@angular/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Observable } from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';
import { environment } from './../../../environments/environment';

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { }

  getData(endpoint: string = ''): Observable<any> {
    return this.http.get(endpoint)
    .map(this.extractData)
    .catch(this.handleError);
  }

  private extractData(res: Response) {
    return res || [];
  }

  private handleError(error: any) {
    const msg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(msg);
    return _throw(msg);
  }

}
