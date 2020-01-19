import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {BaseService} from './base.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService extends BaseService {

  static MEMBER_URL = `${environment.server}/members`;
  static TEST_URL = `${environment.server}/tests`;

  async getMembers(): Promise<any> {
    return this.get(MemberService.MEMBER_URL);
  }

  async search(queryParams): Promise<any> {
    return this.get(MemberService.TEST_URL, queryParams);
  }

  public test(data): Observable<any> {
    return this.post(MemberService.TEST_URL, data);
  }
}
