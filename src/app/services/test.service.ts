import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AllRange} from '../interfaces/AllRange';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private TEST_URL = `${environment.test_server}/test`;

  constructor(private http: HttpClient) {
  }

  getTests(): Observable<AllRange> {
    return this.http.get<AllRange>(this.TEST_URL);
  }
}
