import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  constructor(private http: HttpClient) {
  }

  async get(url, params?): Promise<any> {
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

  public post(url, params): Observable<any> {
    return this.http.post(url, JSON.stringify(params)).pipe(map(res => res));
  }

  public put(url, params): Observable<any> {
    return this.http.post(url, JSON.stringify(params)).pipe(map(res => res));
  }

  async delete(url): Promise<any> {
    return this.http.delete(url).toPromise().then(res => {
      return res;
    }).catch(err => {
      return {'error': err.statusText, 'status': err.status};
    });
  }
}
