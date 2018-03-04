import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { User } from '../models/User';

import 'rxjs/add/operator/map';

@Injectable()
export class GetConnectionsService {

  constructor(private http: Http) { }

  private serverApi = 'http://localhost:3000';

  public getConnectionsForUser(userId: String):Observable<User[]> {
    let URI = this.serverApi + "/user/connections/" + userId;
    return this.http.get(URI)
      .map(res => res.json())
      .map(res => <User[]>res.data);
  }

}