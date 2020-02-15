import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  static headers: Headers;

  constructor(private http: HttpClient) {
  }

  protected async get(url, params?): Promise<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(param => {
        if (params[param]) {
          httpParams = httpParams.append(param, params[param]);
        }
      });
    }
    return await this.http.get(url, {params: httpParams}).toPromise().then(res => {
      return res;
    }).catch(err => {
      return {'error': err.statusText, 'status': err.status};
    });
  }

  protected post(url, params): Observable<any> {
    return this.http.post(url, JSON.stringify(params)).pipe(map(res => res));
  }

  protected put(url, params): Observable<any> {
    return this.http.put(url, JSON.stringify(params)).pipe(map(res => res));
  }

  protected async delete(url): Promise<any> {
    return this.http.delete(url).toPromise().then(res => {
      return res;
    }).catch(err => {
      return {'error': err.statusText, 'status': err.status};
    });
  }
}
